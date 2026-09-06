import assert from "node:assert/strict";
import test from "node:test";
import { initAnalytics } from "../src/analytics.mjs";

function fixture(hostname = "unixtime.app") {
  const elements = Object.fromEntries(
    ["input", "output", "unit", "epoch"].map((id) => {
      const element = new EventTarget();
      element.value = "";
      return [id, element];
    })
  );
  elements.unit.value = "seconds";
  elements.epoch.value = "2026";
  const link = new EventTarget();
  link.getAttribute = () => "https://github.com/klausbreyer/unixtime.app";
  const win = new EventTarget();
  win.location = { hostname };
  const doc = {
    getElementById: (id) => elements[id],
    querySelectorAll: () => [link],
  };
  const events = [];
  let config;
  const client = {
    init: (key, options) => { config = options; },
    capture: (name, properties) => events.push({ name, properties }),
  };
  return { elements, link, win, doc, client, events, get config() { return config; } };
}

test("analytics stays disabled on local and preview hosts", () => {
  for (const host of ["localhost", "127.0.0.1", "preview.pages.dev", "unixtime.app.example.com"]) {
    const f = fixture(host);
    initAnalytics(f);
    assert.equal(f.config, undefined);
    f.elements.input.dispatchEvent(new Event("paste"));
    assert.deepEqual(f.events, []);
  }
});

test("live hosts capture page usage without automatic content collection", () => {
  for (const host of ["unixtime.app", "www.unixtime.app"]) {
    const f = fixture(host);
    initAnalytics(f);
    assert.equal(f.config.capture_pageview, true);
    assert.equal(f.config.capture_pageleave, true);
    assert.equal(f.config.autocapture, false);
    assert.equal(f.config.disable_session_recording, true);
    assert.equal(f.config.capture_exceptions, false);
    assert.equal(f.config.disable_external_dependency_loading, true);
    assert.equal(f.config.advanced_disable_flags, true);
  }
});

test("typing, paste, copy and clear events never contain source or output text", () => {
  const f = fixture();
  initAnalytics(f);
  const secret = '{"token":"private-value","createdAt":1788652800}';
  f.elements.input.value = secret;
  f.elements.output.textContent = secret;
  f.elements.input.dispatchEvent(new Event("paste"));
  f.elements.input.dispatchEvent(new Event("input"));
  f.elements.input.dispatchEvent(new Event("input"));
  f.elements.output.dispatchEvent(new Event("copy"));
  f.elements.input.value = "";
  f.elements.input.dispatchEvent(new Event("input"));
  f.elements.input.value = secret;
  f.elements.input.dispatchEvent(new Event("input"));
  assert.deepEqual(f.events.map(({ name }) => name), [
    "input_pasted", "input_started", "output_copied", "input_cleared", "input_started",
  ]);
  assert.equal(JSON.stringify(f.events).includes("private-value"), false);
  assert.equal(f.elements.input.value, secret);
  assert.equal(f.elements.output.textContent, secret);
});

test("settings record valid values in both directions and ignore arbitrary text", () => {
  const f = fixture();
  initAnalytics(f);
  for (const value of ["millis", "seconds", "private-value"]) {
    f.elements.unit.value = value;
    f.elements.unit.dispatchEvent(new Event("change"));
  }
  for (const value of ["Epoch", "2026", "private-value"]) {
    f.elements.epoch.value = value;
    f.elements.epoch.dispatchEvent(new Event("change"));
  }
  assert.deepEqual(f.events, [
    { name: "setting_changed", properties: { setting: "unit", value: "millis" } },
    { name: "setting_changed", properties: { setting: "unit", value: "seconds" } },
    { name: "setting_changed", properties: { setting: "minimum_year", value: "Epoch" } },
    { name: "setting_changed", properties: { setting: "minimum_year", value: "2026" } },
  ]);
});

test("header links and installation emit fixed event properties", () => {
  const f = fixture();
  initAnalytics(f);
  f.link.dispatchEvent(new Event("click"));
  f.win.dispatchEvent(new Event("appinstalled"));
  assert.deepEqual(f.events, [
    { name: "header_link_clicked", properties: { link: "github" } },
    { name: "app_installed", properties: undefined },
  ]);
});

test("analytics failures do not interrupt app event handlers", () => {
  const f = fixture();
  f.client.init = () => { throw new Error("Storage unavailable"); };
  assert.doesNotThrow(() => initAnalytics(f));
  const active = fixture();
  active.client.capture = () => { throw new Error("Offline"); };
  initAnalytics(active);
  assert.doesNotThrow(() => active.elements.input.dispatchEvent(new Event("paste")));
});
