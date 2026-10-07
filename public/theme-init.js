// Runs before first paint (external file: CSP allows no inline scripts).
// 1) Color theme: saved choice wins; otherwise follow the system.
// 2) Language: the HTML is pre-rendered in English. If a different language is saved, set <html lang>
//    and hide the page until React has rendered that language (avoids an English flash).
//    A safety timeout always reveals the page, even if the app fails to start.
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("tb-theme");
    var dark = saved === "dark" || (saved !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
  } catch (e) {
    /* storage unavailable: keep light */
  }
  try {
    var lang = localStorage.getItem("tb-lang");
    if (lang === "es" || lang === "pt" || lang === "ht") {
      root.lang = lang;
      root.setAttribute("data-lang-pending", lang);
      setTimeout(function () {
        root.removeAttribute("data-lang-pending");
      }, 2500);
    }
  } catch (e) {
    /* storage unavailable: English */
  }
})();
