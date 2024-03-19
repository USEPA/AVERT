(function () {
  // get height of the current document, and send to the parent window
  function sendHeight() {
    const height = document.querySelector("body").offsetHeight;
    window.parent.postMessage(["setHeight", height], "*");
  }

  // delay sending height, so height is calculated after all elements load
  document.addEventListener("DOMContentLoaded", (_ev) => {
    window.setTimeout(sendHeight, 1000);
  });

  // delay sending height, so height is calculated after click
  document.addEventListener("click", (_ev) => {
    window.setTimeout(sendHeight, 0);
  });

  // delegate delayed sending of height to only 'Enter' keypress
  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    window.setTimeout(sendHeight, 0);
  });
})();
