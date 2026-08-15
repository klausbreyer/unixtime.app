if ("serviceWorker" in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || refreshing) {
      return;
    }

    refreshing = true;
    window.location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const serviceWorkerUrl = `${window.location.origin}/pwabuilder-sw.js`;
      const registration = await navigator.serviceWorker.register(
        serviceWorkerUrl,
        {
          scope: "/",
          updateViaCache: "none",
        }
      );

      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      await registration.update();
    } catch (error) {
      console.error("Service worker registration failed", error);
    }
  });
}
