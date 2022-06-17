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
  if (window.electron) {
    this.document.getElementById("support").style.display = "none";
  }
});

const input = document.getElementById("input");
const output = document.getElementById("output");
if (input.addEventListener) {
  input.addEventListener("input", parse, false);
}

function parse() {
  console.log("parse");

  const numberPattern = /\d+/g;
  const numbers = input.value.match(numberPattern);
  if (!numbers) {
    output.value = input.value;
    console.log("nothing");

    return;
  }

  let minimum = Math.floor(new Date(localStorage.getItem("epoch")).getTime());

  console.log("seconds", minimum);

  if (localStorage.getItem("unit") === "seconds") {
    minimum = Math.floor(minimum / 1000);
    console.log("seconds", minimum);
  }
  const filtered = numbers.filter((n) => n > minimum);

  output.innerHTML = input.value;
  hljs.highlightAll();

  let text = output.innerHTML;
  filtered.forEach((n) => {
    text = text.replace(n, `<span class="inverse">${dateTimeString(n)}</span>`);
    // text = text.replace(n, `${dateTimeString(n)}`);
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
