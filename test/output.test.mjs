import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { renderOutput } from "../src/output.mjs";

// Use the bundled highlighter and a fixed timezone for date assertions.
process.env.TZ = "Europe/Berlin";
const context = vm.createContext({});
vm.runInContext(readFileSync(new URL("../src/lib/highlight.js-11.5.1/highlight.min.js", import.meta.url), "utf8"), context);
const settings = { unit: "seconds", epoch: "2026" };
const render = (text, overrides = {}) => renderOutput(text, { ...settings, ...overrides }, context.hljs);
const textOf = (html) => html.replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const date = "1/1/2026 1:00:00 AM";

test("JSON colors keys, strings, numbers and literals without changing whitespace", () => {
  const source = '{\n\t"name": "API", "count": 42, "active": true, "error": null\n}';
  const output = render(source);
  for (const token of ["attr", "string", "number", "keyword"]) {
    assert.match(output, new RegExp(`class="hljs-${token}"`));
  }
  assert.equal(textOf(output), source);
});

test("converts repeated timestamps in JSON numbers, strings and plain text once each", () => {
  for (const source of ['{"at":1767225600,"again":"1767225600"}', "1767225600\n1767225600"]) {
    const output = render(source);
    assert.equal((output.match(/class="inverse"/g) || []).length, 2);
    assert.equal(textOf(output), source.replaceAll("1767225600", date));
  }
});

test("minimum year and unit changes work in both directions", () => {
  const source = '{"before":1767225599,"at":1767225600}';
  assert.equal(textOf(render(source)), `{"before":1767225599,"at":${date}}`);
  assert.equal(textOf(render(source, { epoch: "2027" })), source);
  assert.equal(textOf(render(source)), `{"before":1767225599,"at":${date}}`);
  const millis = '{"at":1767225600000}';
  assert.equal(textOf(render(millis, { unit: "millis" })), `{"at":${date}}`);
  assert.equal(textOf(render(source, { unit: "millis" })), source);
});

test("escapes pasted HTML and entities with and without timestamps", () => {
  for (const source of [
    '<img src=x onerror="alert(1)"> &lt;b&gt; \'quoted\'',
    '{"html":"<script>alert(1767225600)</script>","entity":"&#1767225600;"}',
  ]) {
    const output = render(source);
    assert.doesNotMatch(output, /<(?:img|script)\b/);
    assert.equal(textOf(output), source.replaceAll("1767225600", date));
  }
});

test("keeps empty input, text, incomplete JSON and unsupported dates readable", () => {
  for (const source of ["", "just text & <br>", '{"name": "unfinished', '{"at":999999999999999999999999}']) {
    assert.equal(textOf(render(source)), source);
  }
});

test("each edit gets fresh highlighting", () => {
  assert.match(render('{"first":true}'), /hljs-keyword/);
  assert.match(render('{"second":"text"}'), /hljs-string/);
  assert.equal(render(""), "");
  assert.match(render('{"third":42}'), /hljs-number/);
});
