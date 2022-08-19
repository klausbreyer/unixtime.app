const input = document.getElementById("input");
const output = document.getElementById("output");

const epochElement = document.getElementById("epoch");
const unitElement = document.getElementById("unit");

let dirty = false;

epochElement.addEventListener("change", function () {
  localStorage.setItem("epoch", epochElement.value);
  parse();
  if (!dirty) {
    welcome();
  }
});

unitElement.addEventListener("change", function () {
  localStorage.setItem("unit", unitElement.value);
  parse();

  if (!dirty) {
    welcome();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("epoch")) {
    localStorage.setItem("epoch", new Date().getFullYear());
  }

  if (!localStorage.getItem("unit")) {
    localStorage.setItem("unit", "seconds");
  }

  epochElement.value = localStorage.getItem("epoch");
  unitElement.value = localStorage.getItem("unit");

  welcome();
});

window.addEventListener("DOMContentLoaded", function () {
  if (isElectron() || isPwa()) {
    this.document.querySelector("header").style.display = "none";
  }
});

input.addEventListener(
  "input",
  () => {
    dirty = true;
    parse();
  },
  false
);

function parse() {
  const numberPattern = /\d+/g;
  const numbers = input.value.match(numberPattern);
  if (!numbers) {
    output.innerHTML = input.value;
    hljs.highlightAll();
    return;
  }

  let minimum = Math.floor(new Date(localStorage.getItem("epoch")).getTime());
  if (localStorage.getItem("unit") === "seconds") {
    minimum = Math.floor(minimum / 1000);
  }
  const toReplace = numbers.filter((n) => n >= minimum);

  output.innerHTML = input.value;
  hljs.highlightAll();

  let text = output.innerHTML;
  let showAlert = false;
  toReplace.forEach((n, i) => {
    if (!isElectron() && !isPwa() && i > 2) {
      showAlert = true;
      return;
    }
    text = text.replace(n, `<span class="inverse">${dateTimeString(n)}</span>`);
  });
  output.innerHTML = text;

  if (showAlert && isBrowserMac()) {
    alert(
      "Hey, just a little heads-up!\n\nYour results are limited to 3. Please download the desktop application from the Mac App Store to replace more. You can find the link below.\n\nYour support is greatly appreciated to ensure the continued development of the application!\n\nCheers, Klaus."
    );
  }
}

function dateTimeString(n) {
  if (localStorage.getItem("unit") === "seconds") {
    n = Math.floor(n * 1000);
  }
  return (
    new Date(n * 1).toLocaleDateString("en") +
    " " +
    new Date(n * 1).toLocaleTimeString("en")
  );
}

function welcome() {
  let now = new Date(localStorage.getItem("epoch")).getTime();
  if (localStorage.getItem("unit") === "seconds") {
    now = Math.floor(now / 1000);
  }

  const welcomeTemplate = `Welcome to unixtime.app!\n\nJust write or paste text with timestamps here, like ${now}!\n\nUse the settings down below to differentiate between seconds and millis and configure the minimum year of your timestamps.\n\n\nBtw: Also works well for JSON API responses!\n\n{\n  "id": 1,\n  "createdAt": ${now}\n}`;
  input.value = welcomeTemplate;

  this.setTimeout(() => parse(), 500);
}

function isElectron() {
  return !!window.electron;
}

function isBrowserMac() {
  return window.navigator.platform.includes("Mac");
}

function isPwa() {
  return ["fullscreen", "standalone", "minimal-ui"].some(
    (displayMode) =>
      window.matchMedia("(display-mode: " + displayMode + ")").matches
  );
}
