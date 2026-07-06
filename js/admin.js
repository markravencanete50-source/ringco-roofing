/* Ringco admin dashboard — Firebase email/password auth + Looker Studio embed.
   ------------------------------------------------------------------
   SETUP (all values below are public identifiers, safe to commit):
   1) FIREBASE_CONFIG — Firebase console → Project settings → Your apps →
      Web app → "SDK setup and configuration" → Config. Paste the object.
   2) In Firebase console → Authentication → Sign-in method: enable
      Email/Password. Then Authentication → Users → Add user with your
      admin email + a password (this is the login).
   3) Firestore → Rules: publish the rules from /firestore.rules so a
      signed-in admin can read their own /users record.
   4) LOOKER_EMBED_URL — Looker Studio → Share → Embed report → copy the
      iframe src. Leave "" to keep showing the setup guide.
   Access is granted only when the signed-in account also has a /users doc
   with role == "admin" and status == "active".
   ------------------------------------------------------------------ */

// FIREBASE_CONFIG is generated at deploy time by build-config.js from the
// project's NEXT_PUBLIC_FIREBASE_* Vercel env vars. Locally (no build) the
// import fails and the page shows the setup guide.
let FIREBASE_CONFIG = {};
try {
  const mod = await import("/js/firebase-config.js");
  FIREBASE_CONFIG = (mod && mod.FIREBASE_CONFIG) || {};
} catch (_) { /* not generated yet */ }

const LOOKER_EMBED_URL = ""; // paste your Looker Studio embed URL

const SDK = "https://www.gstatic.com/firebasejs/10.12.0";

const el = function (id) { return document.getElementById(id); };
const gate = el("admin-gate"), dash = el("admin-dash"), setup = el("admin-setup"),
  frame = el("looker-frame"), form = el("gate-form"),
  emailInput = el("gate-email"), passInput = el("gate-pass"),
  err = el("gate-err"), signout = el("admin-signout");

function showDashboard() {
  gate.hidden = true; dash.hidden = false; signout.hidden = false;
  if (LOOKER_EMBED_URL) { frame.src = LOOKER_EMBED_URL; frame.hidden = false; setup.hidden = true; }
  else { frame.hidden = true; setup.hidden = false; }
}
function showGate() {
  dash.hidden = true; signout.hidden = true; gate.hidden = false;
  if (frame) frame.src = "";
}
function showSetupOnly() {
  // Firebase not configured yet — reveal the setup guide, no auth.
  gate.hidden = true; dash.hidden = false; signout.hidden = true;
  frame.hidden = true; setup.hidden = false;
}

function friendly(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Wrong email or password.";
    case "auth/invalid-email": return "Enter a valid email address.";
    case "auth/too-many-requests": return "Too many attempts — try again in a few minutes.";
    case "auth/network-request-failed": return "Network error — check your connection.";
    default: return "Sign-in failed. Please try again.";
  }
}

const configured = FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey;

if (!configured) {
  showSetupOnly();
} else {
  (async function () {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import(SDK + "/firebase-app.js"),
      import(SDK + "/firebase-auth.js"),
      import(SDK + "/firebase-firestore.js"),
    ]);
    const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = authMod;
    const { getFirestore, collection, query, where, getDocs } = fsMod;

    const app = initializeApp(FIREBASE_CONFIG);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // throws on Firestore errors (e.g. rules) so the caller can explain
    async function isActiveAdmin(user) {
      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);
      let ok = false;
      snap.forEach(function (d) {
        const u = d.data();
        if (u.role === "admin" && (u.status === "active" || u.status === undefined)) ok = true;
      });
      return ok;
    }

    onAuthStateChanged(auth, async function (user) {
      if (!user) { showGate(); return; }
      try {
        if (await isActiveAdmin(user)) { showDashboard(); }
        else { err.textContent = "This account isn't an authorized admin."; await signOut(auth); showGate(); }
      } catch (e) {
        err.textContent = "Couldn't verify admin access — check the Firestore rules.";
        await signOut(auth); showGate();
      }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      err.textContent = "";
      const email = emailInput.value.trim(), pass = passInput.value;
      if (!email || !pass) return;
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        // onAuthStateChanged completes the flow (role check → dashboard)
      } catch (e2) {
        err.textContent = friendly(e2 && e2.code);
      } finally {
        btn.disabled = false;
      }
    });

    signout.addEventListener("click", function () { signOut(auth); });
  })().catch(function () {
    err.textContent = "Couldn't load sign-in. Check your Firebase config.";
    showGate();
  });
}
