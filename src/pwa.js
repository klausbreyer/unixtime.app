import "https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate";

const el = document.createElement("pwa-update");
document.body.appendChild(el);

// This is the "Offline copy of assets" service worker

const CACHE = "pwabuilder-offline";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
  })
);
