(function () {

  // get height of current document, and send to parent window
  function sendHeight() {
    var height = document.querySelector('html').scrollHeight;
    window.parent.postMessage(['setHeight', height], '*');
  }

  // delay sending height, so height is calculated after click/keypress
  function delayedSendHeight() {
    window.setTimeout(sendHeight, 0);
  }

  // delegate (delayed) sending height to only 'Enter' keypress
  function enterKeyPressed(e) {
    if ((e.key && e.key === 'Enter') || (e.keyCode && e.keyCode === 13)) {
      delayedSendHeight();
    }
  }

  document.addEventListener('DOMContentLoaded', sendHeight, false);
  document.addEventListener('click', delayedSendHeight, false);
  document.addEventListener('keypress', enterKeyPressed, false);

})();
