// Sets the color theme before first paint to avoid a flash. Saved choice wins; otherwise follow the system.
(function () {
  try {
    var saved = localStorage.getItem("tb-theme");
    var dark = saved === "dark" || (saved !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    /* storage unavailable: keep light */
  }
})();
