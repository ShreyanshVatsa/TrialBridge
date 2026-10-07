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
  // 3) Trial page head start: begin fetching the trial's data bucket now, before the app bundle has
  //    downloaded and hydrated. lib/data/loader.ts adopts this response when its URL matches.
  try {
    var id = location.pathname.indexOf("/trial") === 0 && new URLSearchParams(location.search).get("id");
    if (id && /^NCT\d{8}$/i.test(id.trim()) && window.fetch) {
      id = id.trim().toUpperCase();
      window.__tbEarlyBucket = fetch("/data/manifest.json")
        .then(function (r) {
          return r.ok ? r.json() : Promise.reject();
        })
        .then(function (m) {
          var url = m.trialBase + "/" + id.slice(-3) + ".json";
          return fetch(url).then(function (r) {
            return r.ok ? r.json().then(function (data) { return { url: url, data: data }; }) : Promise.reject();
          });
        });
      window.__tbEarlyBucket.catch(function () {});
    }
  } catch (e) {
    /* best effort: the app fetches the data itself */
  }
})();
