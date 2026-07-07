/* Theme boot — loaded synchronously in <head> before the stylesheet so a
   saved dark-mode choice applies before first paint (no flash).
   External file (not inline) so the site's CSP can disallow inline scripts. */
try {
  var t = localStorage.getItem("ringco-theme");
  if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches))
    document.documentElement.dataset.theme = "dark";
} catch (e) { /* storage blocked — default light */ }
