/* Vercel build step (runs via vercel.json "buildCommand").
   Reads the project's NEXT_PUBLIC_FIREBASE_* environment variables and writes
   js/firebase-config.js so the static /admin page can initialize Firebase.
   ONLY the 6 PUBLIC web-config fields are emitted — never the Admin SDK
   service-account secrets (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY). */
const fs = require("fs");
const env = process.env;

function pick(names, pattern) {
  for (const n of names) if (env[n]) return env[n];
  if (pattern) {
    const key = Object.keys(env).find((k) => pattern.test(k) && env[k]);
    if (key) return env[key];
  }
  return "";
}

var cfg = {
  apiKey:            pick(["NEXT_PUBLIC_FIREBASE_API_KEY", "FIREBASE_API_KEY"], /FIREBASE.*API_KEY$/i),
  authDomain:        pick(["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "FIREBASE_AUTH_DOMAIN"], /FIREBASE.*AUTH_DOMAIN$/i),
  projectId:         pick(["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "FIREBASE_PROJECT_ID"], /FIREBASE.*PROJECT_ID$/i),
  storageBucket:     pick(["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "FIREBASE_STORAGE_BUCKET"], /FIREBASE.*BUCKET$/i),
  messagingSenderId: pick(["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "FIREBASE_MESSAGING_SENDER_ID"], /FIREBASE.*SENDER_ID$/i),
  appId:             pick(["NEXT_PUBLIC_FIREBASE_APP_ID", "FIREBASE_APP_ID"], /FIREBASE.*APP_ID$/i),
};

fs.mkdirSync("js", { recursive: true });
fs.writeFileSync("js/firebase-config.js",
  "export const FIREBASE_CONFIG = " + JSON.stringify(cfg, null, 2) + ";\n");

var mask = function (v) { return v ? v.slice(0, 6) + "…(" + v.length + ")" : "MISSING"; };
console.log("[build-config] wrote js/firebase-config.js:",
  JSON.stringify({
    apiKey: mask(cfg.apiKey), authDomain: cfg.authDomain || "MISSING",
    projectId: cfg.projectId || "MISSING", storageBucket: cfg.storageBucket || "MISSING",
    messagingSenderId: mask(cfg.messagingSenderId), appId: mask(cfg.appId),
  }));

/* ---------- cache-busting ----------
   css/js are served with max-age=86400, so without versioned URLs a
   visitor's phone can render NEW html with DAY-OLD css/js after a deploy
   (symptom: broken layout that "works on my machine"). Stamp every local
   css/js reference with the commit sha so each deploy is a new URL. */
var ver = (env.VERCEL_GIT_COMMIT_SHA || String(Date.now())).slice(0, 10);
var stamped = 0;
fs.readdirSync(".").filter(function (f) { return /\.html$/.test(f) && !/\.dc\.html$/.test(f); })
  .forEach(function (file) {
    var html = fs.readFileSync(file, "utf8");
    var out = html.replace(/(href|src)="(\/(?:css|js)\/[^"?]+\.(?:css|js))"/g,
      '$1="$2?v=' + ver + '"');
    if (out !== html) { fs.writeFileSync(file, out); stamped++; }
  });
console.log("[build-config] cache-busted css/js URLs in " + stamped + " html files (v=" + ver + ")");
