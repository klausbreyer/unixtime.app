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

// bridged tracking for header links
window.addEventListener("DOMContentLoaded", function () {
  const firstFive = location.pathname.substring(0, 5);
  const restUrl = location.pathname.substring(5);
  if (firstFive !== "/ref/") {
    return;
  }

  document.querySelector("#mss-link").href = "/mss/" + restUrl;
  document.querySelector("#mas-link").href = "/mas/" + restUrl;
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
    text = text.replace(n, `<span class="inverse">${dateTimeString(n)}</span>`);
  });
  output.innerHTML = text;
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
