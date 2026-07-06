/* Ringco admin dashboard — gate + Looker Studio embed.
   ------------------------------------------------------------------
   CONFIG — set these two values to go live:
   1) LOOKER_EMBED_URL — in Looker Studio: Share → Embed report → copy the
      URL from the iframe "src". Leave "" to show setup instructions.
   2) ACCESS_CODE_SHA256 — SHA-256 hash of the access code. Default code is
      "ringco-admin". To change it, hash your new code and paste it here.
   NOTE: this client-side gate is light protection (keeps casual visitors out
   + the page is noindex/unlinked). The REAL data protection is your Looker
   report's Google sharing — keep it shared only to your Google account(s).
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var LOOKER_EMBED_URL = ""; // <-- paste your Looker Studio embed URL
  var ACCESS_CODE_SHA256 = "dff6d0940d621f14d1f8a2c14a52bbf54a35af5e56ed660036e78271d3bda122"; // "ringco-admin"

  var gate = document.getElementById("admin-gate");
  var dash = document.getElementById("admin-dash");
  var setup = document.getElementById("admin-setup");
  var frame = document.getElementById("looker-frame");
  var form = document.getElementById("gate-form");
  var input = document.getElementById("gate-code");
  var err = document.getElementById("gate-err");
  var signout = document.getElementById("admin-signout");

  function showDashboard() {
    gate.hidden = true;
    dash.hidden = false;
    signout.hidden = false;
    if (LOOKER_EMBED_URL) {
      frame.src = LOOKER_EMBED_URL;
      frame.hidden = false;
      setup.hidden = true;
    } else {
      frame.hidden = true;
      setup.hidden = false;
    }
  }

  function lock() {
    try { sessionStorage.removeItem("ringco-admin-ok"); } catch (_) {}
    dash.hidden = true;
    signout.hidden = true;
    gate.hidden = false;
    if (frame) frame.src = "";
    if (input) { input.value = ""; input.focus(); }
  }

  async function sha256hex(str) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  // Already unlocked this session?
  var unlocked = false;
  try { unlocked = sessionStorage.getItem("ringco-admin-ok") === "1"; } catch (_) {}
  if (unlocked) showDashboard();

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.textContent = "";
      var val = input.value.trim();
      if (!val) return;
      if (!window.crypto || !crypto.subtle) {
        err.textContent = "Secure context required — open this page over https.";
        return;
      }
      sha256hex(val).then(function (hash) {
        if (hash === ACCESS_CODE_SHA256) {
          try { sessionStorage.setItem("ringco-admin-ok", "1"); } catch (_) {}
          showDashboard();
        } else {
          err.textContent = "Incorrect code.";
          input.select();
        }
      });
    });
  }

  if (signout) signout.addEventListener("click", lock);
})();
