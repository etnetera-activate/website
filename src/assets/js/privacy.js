function hideCookiebot() {
    var style = document.createElement("style");
    style.setAttribute("id", "cookiebotHidingStyle");
    style.innerHTML = "div#CybotCookiebotDialog, div#CybotCookiebotDialogBodyUnderlay {display: none !important} body {overflow: auto !important}";
    document.head.appendChild(style);
}
function unhideCookiebot() {
  if (document.getElementById("cookiebotHidingStyle")) document.getElementById("cookiebotHidingStyle").remove();
}

hideCookiebot();

window.CookiebotCallback_OnDialogDisplay = function(){
  if (!Cookiebot.hidingDone) {
    Cookiebot.hidingDone = true;
    Cookiebot.hide();
    setTimeout(unhideCookiebot,500);
  }
}