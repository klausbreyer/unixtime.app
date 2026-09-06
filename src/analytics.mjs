// Explicit events keep pasted text and rendered output out of analytics.
export function initAnalytics({ client, win = window, doc = document }) {
  if (!["unixtime.app", "www.unixtime.app"].includes(win.location.hostname)) {
    return;
  }

  try {
    client.init("phc_vwSQu3VpqF9mduqWBADzpfh6g59iipScsKLtBjMDEeUB", {
      api_host: "https://eu.i.posthog.com",
      persistence: "localStorage",
      person_profiles: "never",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      capture_exceptions: false,
      capture_performance: false,
      capture_heatmaps: false,
      capture_dead_clicks: false,
      disable_surveys: true,
      disable_web_experiments: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
    });
  } catch {
    // Analytics must not prevent local conversion when storage is unavailable.
    return;
  }

  function capture(name, properties) {
    try {
      client.capture(name, properties);
    } catch {
      // Conversion remains available if analytics fails.
    }
  }

  const input = doc.getElementById("input");
  let started = false;
  input.addEventListener("input", () => {
    if (input.value.length === 0) {
      capture("input_cleared");
      started = false;
    } else if (!started) {
      capture("input_started");
      started = true;
    }
  });
  input.addEventListener("paste", () => capture("input_pasted"));
  input.addEventListener("copy", () => capture("input_copied"));
  doc.getElementById("output").addEventListener("copy", () => capture("output_copied"));

  const unit = doc.getElementById("unit");
  unit.addEventListener("change", () => {
    if (["seconds", "millis"].includes(unit.value)) {
      capture("setting_changed", { setting: "unit", value: unit.value });
    }
  });
  const epoch = doc.getElementById("epoch");
  epoch.addEventListener("change", () => {
    if (epoch.value === "Epoch" || /^(197[1-9]|19[89]\d|20[0-4]\d|2050)$/.test(epoch.value)) {
      capture("setting_changed", { setting: "minimum_year", value: epoch.value });
    }
  });

  const links = new Map([
    ["/", "home"],
    ["https://www.v01.io/posts/2022-unixtimestamp-workflow/", "about"],
    ["https://github.com/klausbreyer/unixtime.app", "github"],
    ["https://v01.io", "author"],
  ]);
  doc.querySelectorAll("header a").forEach((element) => {
    const link = links.get(element.getAttribute("href"));
    if (link) {
      element.addEventListener("click", () => capture("header_link_clicked", { link }));
    }
  });
  win.addEventListener("appinstalled", () => capture("app_installed"));
}
