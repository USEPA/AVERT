/* prettier-ignore */
(function () {
  // get height of current document, and send to parent window
  function sendHeight() {
    var height = document.querySelector('html').offsetHeight;
    window.parent.postMessage(['setHeight', height], '*');
  }

  // delay sending height, so height is calculated after all elements load
  document.addEventListener('DOMContentLoaded', function(ev) {
    window.setTimeout(sendHeight, 1000);
  }, false);

  // delay sending height, so height is calculated after click
  document.addEventListener('click', function(ev) {
    window.setTimeout(sendHeight, 0);
  }, false);

  // delegate delayed sending of height to only 'Enter' keypress
  document.addEventListener('keypress', function(ev) {
    if ((ev.key && ev.key === 'Enter') || (ev.keyCode && ev.keyCode === 13)) {
      window.setTimeout(sendHeight, 0);
    }
  }, false);
})();
