/* Ringco admin dashboard — Firebase email/password auth + live leads.
   ------------------------------------------------------------------
   What this shows once Firebase is connected:
     • KPI cards (total, new, last-7-days, top requested service)
     • A live, searchable, filterable list of every enquiry submitted
       through the website contact form (the `leads` collection)
     • One-click status tracking: New → Contacted → Closed
     • (Optional) an embedded Google Analytics / Looker Studio report

   SETUP
   1) FIREBASE_CONFIG is generated at deploy by build-config.js from the
      project's NEXT_PUBLIC_FIREBASE_* Vercel env vars. Locally (no build)
      the import fails and the page shows the setup guide.
   2) Firebase console → Authentication → enable Email/Password + Add user.
   3) Firestore → Rules: publish /firestore.rules.
   4) LOOKER_EMBED_URL (optional) — Looker Studio → Share → Embed report →
      copy the iframe src. Leave "" to hide the analytics panel entirely.
   Access is granted only when the signed-in account also has a /users doc
   with role == "admin" and status == "active".
   ------------------------------------------------------------------ */

let FIREBASE_CONFIG = {};
try {
  const mod = await import("/js/firebase-config.js");
  FIREBASE_CONFIG = (mod && mod.FIREBASE_CONFIG) || {};
} catch (_) { /* not generated yet (e.g. local preview) */ }

const LOOKER_EMBED_URL = ""; // optional: paste your Looker Studio embed URL

const SDK = "https://www.gstatic.com/firebasejs/10.12.0";

const el = (id) => document.getElementById(id);
const gate = el("admin-gate"), dash = el("admin-dash"),
  live = el("admin-live"), setup = el("admin-setup"),
  gaPanel = el("ga-panel"), frame = el("looker-frame"),
  form = el("gate-form"), emailInput = el("gate-email"), passInput = el("gate-pass"),
  err = el("gate-err"), signout = el("admin-signout"),
  listEl = el("lead-list"), loadingEl = el("lead-loading"),
  emptyEl = el("lead-empty"), noneEl = el("lead-none"),
  searchEl = el("lead-search"), filterEl = el("lead-filter");

/* ---------- screen switching ---------- */
function showGate() {
  dash.hidden = true; live.hidden = true; signout.hidden = true; gate.hidden = false;
}
function showSetupOnly() {
  // Firebase not configured — reveal the setup guide, no auth possible.
  gate.hidden = true; dash.hidden = false; live.hidden = true;
  setup.hidden = false; signout.hidden = true;
}
function showDashboard() {
  gate.hidden = true; dash.hidden = false;
  setup.hidden = true; live.hidden = false; signout.hidden = false;
  if (LOOKER_EMBED_URL && frame && gaPanel) {
    frame.src = LOOKER_EMBED_URL;
    gaPanel.hidden = false;
  }
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

/* ---------- leads rendering ---------- */
const STATUSES = ["new", "contacted", "closed"];
const STATUS_LABEL = { new: "New", contacted: "Contacted", closed: "Closed" };
const NEXT_STATUS = { new: "contacted", contacted: "closed", closed: "new" };

let allLeads = [];        // full snapshot (newest first)
let curFilter = "all";
let curSearch = "";
let updateStatusFn = null; // set once Firestore is wired

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtDate(d) {
  if (!d) return "Just now";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return "Today · " + time;
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday · " + time;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + time;
}

function renderKPIs() {
  const now = Date.now();
  const weekAgo = now - 7 * 864e5;
  const total = allLeads.length;
  const news = allLeads.filter((l) => l.status === "new").length;
  const week = allLeads.filter((l) => l.ts && l.ts.getTime() >= weekAgo).length;

  const counts = {};
  allLeads.forEach((l) => { if (l.service) counts[l.service] = (counts[l.service] || 0) + 1; });
  let top = "—";
  let max = 0;
  Object.keys(counts).forEach((k) => { if (counts[k] > max) { max = counts[k]; top = k; } });
  // trim long service labels for the card
  if (top.length > 22) top = top.slice(0, 21) + "…";

  el("kpi-total").textContent = total;
  el("kpi-new").textContent = news;
  el("kpi-week").textContent = week;
  el("kpi-service").textContent = total ? top : "—";
}

function visibleLeads() {
  const q = curSearch.trim().toLowerCase();
  return allLeads.filter((l) => {
    if (curFilter !== "all" && l.status !== curFilter) return false;
    if (!q) return true;
    return (l.name + " " + l.phone + " " + l.email + " " + l.service + " " + l.message)
      .toLowerCase().includes(q);
  });
}

function leadRow(l) {
  const row = document.createElement("article");
  row.className = "lead-row";
  row.dataset.status = l.status;

  const tel = l.phone ? '<a href="tel:' + esc(l.phone.replace(/[^\d+]/g, "")) + '">' + esc(l.phone) + "</a>" : "";
  const mail = l.email ? '<a href="mailto:' + esc(l.email) + '">' + esc(l.email) + "</a>" : "";
  const contacts = [tel, mail].filter(Boolean).join('<span class="dot">·</span>');

  row.innerHTML =
    '<div class="lead-when">' + esc(fmtDate(l.ts)) + "</div>" +
    '<div class="lead-body">' +
      '<div class="lead-name">' + esc(l.name || "(no name)") +
        ' <span class="lead-badge ' + l.status + '">' + STATUS_LABEL[l.status] + "</span></div>" +
      (contacts ? '<div class="lead-contacts">' + contacts + "</div>" : "") +
      (l.service ? '<div class="lead-service">' + esc(l.service) + "</div>" : "") +
      (l.message ? '<p class="lead-msg">' + esc(l.message) + "</p>" : "") +
    "</div>" +
    '<div class="lead-actions">' +
      '<button type="button" class="lead-advance" data-id="' + esc(l.id) + '">' +
        "Mark " + STATUS_LABEL[NEXT_STATUS[l.status]] +
      "</button>" +
    "</div>";

  return row;
}

function renderList() {
  renderKPIs();
  const rows = visibleLeads();
  listEl.innerHTML = "";

  loadingEl.hidden = true;
  const noLeadsAtAll = allLeads.length === 0;
  emptyEl.hidden = !noLeadsAtAll;
  noneEl.hidden = noLeadsAtAll || rows.length > 0;

  const frag = document.createDocumentFragment();
  rows.forEach((l) => frag.appendChild(leadRow(l)));
  listEl.appendChild(frag);
}

/* ---------- boot ---------- */
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
    const {
      getFirestore, collection, query, where, orderBy, onSnapshot,
      getDocs, doc, updateDoc, serverTimestamp,
    } = fsMod;

    const app = initializeApp(FIREBASE_CONFIG);
    const auth = getAuth(app);
    const db = getFirestore(app);

    let leadsUnsub = null;

    // throws on Firestore errors (e.g. rules) so the caller can explain
    async function isActiveAdmin(user) {
      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);
      let ok = false;
      snap.forEach((d) => {
        const u = d.data();
        if (u.role === "admin" && (u.status === "active" || u.status === undefined)) ok = true;
      });
      return ok;
    }

    // live subscription to the leads collection (newest first)
    function startLeads() {
      if (leadsUnsub) return;
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      leadsUnsub = onSnapshot(q, (snap) => {
        allLeads = snap.docs.map((d) => {
          const v = d.data() || {};
          const ts = v.createdAt && v.createdAt.toDate ? v.createdAt.toDate() : null;
          return {
            id: d.id,
            name: v.name || "", phone: v.phone || "", email: v.email || "",
            service: v.service || "", message: v.message || "",
            status: STATUSES.includes(v.status) ? v.status : "new",
            ts,
          };
        });
        renderList();
      }, (e) => {
        loadingEl.textContent = "Couldn't load leads — check the Firestore rules are published.";
        loadingEl.hidden = false;
      });
    }
    function stopLeads() { if (leadsUnsub) { leadsUnsub(); leadsUnsub = null; } allLeads = []; }

    updateStatusFn = async function (id, status) {
      try {
        await updateDoc(doc(db, "leads", id), { status, updatedAt: serverTimestamp() });
      } catch (_) { /* onSnapshot will resync; ignore transient errors */ }
    };

    onAuthStateChanged(auth, async (user) => {
      if (!user) { stopLeads(); showGate(); return; }
      try {
        if (await isActiveAdmin(user)) { showDashboard(); startLeads(); }
        else { err.textContent = "This account isn't an authorized admin."; await signOut(auth); showGate(); }
      } catch (e) {
        err.textContent = "Couldn't verify admin access — check the Firestore rules.";
        await signOut(auth); showGate();
      }
    });

    form.addEventListener("submit", async (e) => {
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

    signout.addEventListener("click", () => signOut(auth));
  })().catch(() => {
    err.textContent = "Couldn't load sign-in. Check your Firebase config.";
    showGate();
  });
}

/* ---------- dashboard interactions (work regardless of Firestore load order) ---------- */
if (filterEl) {
  filterEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]");
    if (!b) return;
    curFilter = b.dataset.f;
    filterEl.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    renderList();
  });
}
if (searchEl) {
  searchEl.addEventListener("input", () => { curSearch = searchEl.value; renderList(); });
}
if (listEl) {
  listEl.addEventListener("click", (e) => {
    const b = e.target.closest(".lead-advance");
    if (!b) return;
    const id = b.dataset.id;
    const lead = allLeads.find((l) => l.id === id);
    if (!lead || !updateStatusFn) return;
    const next = NEXT_STATUS[lead.status];
    // optimistic UI; snapshot will confirm
    lead.status = next;
    renderList();
    updateStatusFn(id, next);
  });
}
