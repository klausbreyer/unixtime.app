const epochElement = document.getElementById("epoch");
const unitElement = document.getElementById("unit");

epochElement.addEventListener("change", function () {
  localStorage.setItem("epoch", epochElement.value);
  parse();
});

unitElement.addEventListener("change", function () {
  localStorage.setItem("unit", unitElement.value);
  parse();
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
});

window.addEventListener("DOMContentLoaded", function () {
  if (isElectron()) {
    this.document.getElementById("support").style.display = "none";
  }
});

const input = document.getElementById("input");
const output = document.getElementById("output");
if (input.addEventListener) {
  input.addEventListener("input", parse, false);
}

function parse() {
  const numberPattern = /\d+/g;
  const numbers = input.value.match(numberPattern);
  if (!numbers) {
    output.value = input.value;
    return;
  }

  let minimum = Math.floor(new Date(localStorage.getItem("epoch")).getTime());
  if (localStorage.getItem("unit") === "seconds") {
    minimum = Math.floor(minimum / 1000);
  }
  const toReplace = numbers.filter((n) => n > minimum);

  output.innerHTML = input.value;
  hljs.highlightAll();

  let text = output.innerHTML;
  let showAlert = false;
  toReplace.forEach((n, i) => {
    if (!isElectron() && i > 2) {
      showAlert = true;
      return;
    }
    text = text.replace(n, `<span class="inverse">${dateTimeString(n)}</span>`);
  });
  output.innerHTML = text;

  if (showAlert && isMac()) {
    alert(
      "Hey, just a little heads-up!\n\nYour results have been limited to 3. To replace more, please download the desktop application from the Mac App Store. You can find the link below.\n\nYour support is greatly appreciated to ensure the continued development of the application!\n\nCheers, Klaus."
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

function isElectron() {
  return !!window.electron;
}

function isMac() {
  return window.navigator.platform.includes("Mac");
}
