/* RINGCO — shared interactions & scroll motion
   Principal-dev notes:
   - All scroll animation is IntersectionObserver-driven (no scroll listeners for reveals).
   - Ambient/pointer motion (aurora, tilt, magnetic) is guarded by prefers-reduced-motion
     AND (pointer:fine) so it never fires on touch or for motion-sensitive users.
   - Everything is progressive enhancement: content is fully readable with JS off.
*/
(function () {
  "use strict";

  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(pointer:fine)").matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll progress bar ---------- */
  var bar = document.querySelector(".scroll-progress");
  if (bar && !REDUCE) {
    var ticking = false;
    var updateBar = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    };
    var requestBar = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
    };
    window.addEventListener("scroll", requestBar, { passive: true });
    window.addEventListener("resize", requestBar);
    updateBar();
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal on scroll (.reveal / [data-stagger]) ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, [data-stagger]").forEach(function (el) {
    io.observe(el);
  });

  /* ---------- Hero headline word-rise ---------- */
  document.querySelectorAll("[data-split]").forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.textContent = "";
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "hero-word";
      s.textContent = w;
      s.style.transitionDelay = 0.08 * i + "s";
      h.appendChild(s);
      h.appendChild(document.createTextNode(" "));
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        h.querySelectorAll(".hero-word").forEach(function (s) {
          s.classList.add("in");
        });
      });
    });
  });

  /* ---------- Count-up stats ([data-count]) ---------- */
  var cio = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        if (REDUCE) { el.textContent = prefix + target.toLocaleString("en-US") + suffix; return; }
        var dur = 1400;
        var t0 = null;
        var step = function (t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(target * eased);
          el.textContent = prefix + val.toLocaleString("en-US") + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) {
    cio.observe(el);
  });

  /* ---------- Before/after comparison slider (pointer + keyboard) ---------- */
  document.querySelectorAll(".ba-wrap").forEach(function (wrap) {
    var after = wrap.querySelector(".ba-after");
    var handle = wrap.querySelector(".ba-handle");
    if (!after || !handle) return;

    var pct = 50;
    var apply = function () {
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      handle.style.left = pct + "%";
      handle.setAttribute("aria-valuenow", String(Math.round(pct)));
    };
    var setFromX = function (clientX) {
      var r = wrap.getBoundingClientRect();
      pct = Math.min(Math.max((clientX - r.left) / r.width, 0.04), 0.96) * 100;
      apply();
    };

    handle.setAttribute("tabindex", "0");
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Drag to compare before and after");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");

    var dragging = false;
    wrap.addEventListener("pointerdown", function (e) {
      dragging = true;
      wrap.classList.add("dragging");
      try { wrap.setPointerCapture(e.pointerId); } catch (_) {}
      setFromX(e.clientX);
    });
    wrap.addEventListener("pointermove", function (e) {
      if (dragging) setFromX(e.clientX);
    });
    var end = function (e) {
      dragging = false;
      wrap.classList.remove("dragging");
      try { wrap.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    wrap.addEventListener("pointerup", end);
    wrap.addEventListener("pointercancel", end);

    handle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 4;
      if (e.key === "ArrowLeft") { pct = Math.max(4, pct - step); apply(); e.preventDefault(); }
      else if (e.key === "ArrowRight") { pct = Math.min(96, pct + step); apply(); e.preventDefault(); }
      else if (e.key === "Home") { pct = 4; apply(); e.preventDefault(); }
      else if (e.key === "End") { pct = 96; apply(); e.preventDefault(); }
    });

    apply();

    /* one-time "drag me" nudge when first scrolled into view */
    if (!REDUCE) {
      var nudged = false;
      var nio = new IntersectionObserver(function (entries) {
        entries.forEach(function (x) {
          if (!x.isIntersecting || nudged) return;
          nudged = true;
          nio.unobserve(x.target);
          var seq = [42, 58, 50], i = 0;
          var run = function () {
            if (i >= seq.length) return;
            pct = seq[i++]; apply();
            setTimeout(run, 260);
          };
          setTimeout(run, 500);
        });
      }, { threshold: 0.5 });
      nio.observe(wrap);
    }
  });

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        document.querySelectorAll(".g-item, .g-card").forEach(function (item) {
          var show = f === "all" || item.getAttribute("data-cat") === f;
          item.classList.toggle("hide", !show);
        });
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbMedia = lb.querySelector(".lightbox-media");
    var lbCap = lb.querySelector(".lightbox-cap");
    var closeLb = function () {
      lb.classList.remove("open");
      document.body.classList.remove("nav-open");
      lbMedia.innerHTML = "";
    };
    var openLb = function (btn) {
      var type = btn.getAttribute("data-type");
      var src = btn.getAttribute("data-media");
      var title = btn.getAttribute("data-title") || "";
      var city = btn.getAttribute("data-city") || "";
      lbMedia.innerHTML = type === "video"
        ? '<video src="' + src + '" autoplay muted loop playsinline controls></video>'
        : '<img src="' + src + '" alt="' + title + '">';
      lbCap.innerHTML = title + (city ? "<span>" + city + "</span>" : "");
      lb.classList.add("open");
      document.body.classList.add("nav-open");
    };
    document.querySelectorAll(".g-expand").forEach(function (b) {
      b.addEventListener("click", function () { openLb(b); });
    });
    lb.querySelector(".lightbox-close").addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) closeLb();
    });
  }

  /* ---------- Contact form → saves the lead to Firestore ----------
     The estimate/contact form writes each enquiry to the `leads`
     collection, which is what powers the /admin "Leads & Enquiries"
     dashboard. Firebase is lazy-loaded only on submit so the public
     pages stay light. If the Firebase config isn't present (e.g. local
     preview with no build step) we still confirm to the visitor rather
     than showing an error. */
  var form = document.querySelector("#estimate-form");
  if (form) {
    var FB_SDK = "https://www.gstatic.com/firebasejs/10.12.0";
    var submitting = false;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitting) return;
      submitting = true;

      var btn = form.querySelector("button[type=submit]");
      var original = btn.innerHTML;
      var data = {
        name: (form.name && form.name.value ? form.name.value : "").trim(),
        phone: (form.phone && form.phone.value ? form.phone.value : "").trim(),
        email: (form.email && form.email.value ? form.email.value : "").trim(),
        city: (form.city && form.city.value ? form.city.value : "").trim(),
        service: (form.service && form.service.value ? form.service.value : "").trim(),
        message: (form.message && form.message.value ? form.message.value : "").trim(),
        status: "new",
        page: location.pathname
      };

      btn.disabled = true;
      btn.textContent = "Sending…";

      try {
        var cfgMod = await import("/js/firebase-config.js");
        var cfg = cfgMod && cfgMod.FIREBASE_CONFIG;
        if (cfg && cfg.apiKey) {
          var appMod = await import(FB_SDK + "/firebase-app.js");
          var fsMod = await import(FB_SDK + "/firebase-firestore.js");
          var app = appMod.initializeApp(cfg);
          var db = fsMod.getFirestore(app);
          data.createdAt = fsMod.serverTimestamp();
          await fsMod.addDoc(fsMod.collection(db, "leads"), data);
        }
        // No Firebase config (local/preview): fall through to the success
        // state so the flow is still testable end-to-end.
      } catch (err) {
        // Real failure while saving — let the visitor know so the lead
        // isn't silently lost, and point them at the phone line.
        btn.disabled = false;
        btn.innerHTML = original;
        submitting = false;
        var f = form.querySelector(".form-error");
        if (!f) {
          f = document.createElement("p");
          f.className = "form-error";
          form.appendChild(f);
        }
        f.textContent = "Sorry — something went wrong sending that. Please call (405) 470-7696 and we'll help right away.";
        return;
      }

      btn.textContent = "Request sent ✓ — we'll call you shortly";
      btn.style.opacity = "0.85";
      form.reset();
    });
  }

  /* ============================================================
     Pointer-driven flourishes — desktop, motion-safe only
     ============================================================ */
  if (FINE && !REDUCE) {

    /* Magnetic pull on primary CTAs */
    var STRENGTH = 0.28;
    document.querySelectorAll("[data-magnetic], .btn-primary").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + mx * STRENGTH + "px," + my * STRENGTH + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    /* Subtle 3D tilt on cards */
    var TILT = 6;
    document.querySelectorAll("[data-tilt], .stat-card, .value-card").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          "perspective(760px) rotateX(" + (-py * TILT) + "deg) rotateY(" + (px * TILT) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ============================================================
     Storm detector — live NWS/NOAA severe-weather alerts
     Shows a dismissible navbar banner when roofing-relevant severe
     weather is active in the OKC-metro service area. No key, no
     backend — api.weather.gov is public + CORS-enabled.
     Preview any state without a live storm: /?stormdemo=Tornado%20Warning
     ============================================================ */
  (function stormDetector() {
    // Roof-damaging event types we care about
    var RELEVANT = /(Tornado|Severe Thunderstorm|High Wind|Wind Advisory|Hail|Flash Flood)/i;
    // Ringco service area — Oklahoma County + surrounding metro counties
    var METRO = /\b(Oklahoma|Cleveland|Canadian|Pottawatomie|McClain|Logan|Grady|Lincoln|Kingfisher)\b/i;
    var SEV = { extreme: 4, severe: 3, moderate: 2, minor: 1, unknown: 0 };

    function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
    function rank(f) { return SEV[(f.properties.severity || "").toLowerCase()] || 0; }

    function render(f) {
      var p = f.properties;
      var id = f.id || p.event;
      var dismissed;
      try { dismissed = sessionStorage.getItem("ringco-storm-dismissed"); } catch (_) {}
      if (dismissed && dismissed === id) return;

      var isWarning = /Warning/i.test(p.event);
      var bar = document.createElement("div");
      bar.className = "storm-alert " + (isWarning ? "warning" : "watch");
      bar.setAttribute("role", "alert");
      bar.innerHTML =
        '<span class="sa-dot" aria-hidden="true"></span>' +
        '<span><b>' + esc(p.event) + '</b> active for the OKC metro.' +
        '<span class="sa-msg-extra"> Storm or roof damage? We\'re on call 24/7.</span></span>' +
        '<a class="sa-cta" href="/contact">' + (isWarning ? "Get a free inspection →" : "Storm-damage help →") + "</a>" +
        '<button class="sa-close" type="button" aria-label="Dismiss weather alert">✕</button>';
      document.body.appendChild(bar);
      document.body.classList.add("storm-on");
      // setTimeout (not rAF) so the entrance still runs in background tabs
      setTimeout(function () { bar.classList.add("show"); }, 30);
      bar.querySelector(".sa-close").addEventListener("click", function () {
        bar.classList.remove("show");
        document.body.classList.remove("storm-on");
        setTimeout(function () { bar.remove(); }, 400);
        try { sessionStorage.setItem("ringco-storm-dismissed", id); } catch (_) {}
      });
    }

    /* "Recent storm" banner — published from the admin Storm center when a
       past storm is toggled on ("Match leads"). Read via the Firestore REST
       API (public-read /settings doc) so no SDK weight lands on visitors.
       Live NWS alerts always take priority over this. */
    function renderRecent(ev, onset) {
      var id = "recent|" + (onset || ev);
      var dismissed;
      try { dismissed = sessionStorage.getItem("ringco-storm-dismissed"); } catch (_) {}
      if (dismissed === id) return;

      var day = "";
      if (onset) {
        try { day = new Date(onset).toLocaleDateString([], { month: "short", day: "numeric" }); } catch (_) {}
      }
      var bar = document.createElement("div");
      bar.className = "storm-alert recent";
      bar.setAttribute("role", "status");
      bar.innerHTML =
        '<span class="sa-dot" aria-hidden="true"></span>' +
        "<span><b>" + esc(ev) + "</b> hit the OKC metro" + (day ? " on " + esc(day) : "") + "." +
        '<span class="sa-msg-extra"> Roof damage isn\'t always visible from the ground.</span></span>' +
        '<a class="sa-cta" href="/contact">Get a free inspection →</a>' +
        '<button class="sa-close" type="button" aria-label="Dismiss storm notice">✕</button>';
      document.body.appendChild(bar);
      document.body.classList.add("storm-on");
      setTimeout(function () { bar.classList.add("show"); }, 30);
      bar.querySelector(".sa-close").addEventListener("click", function () {
        bar.classList.remove("show");
        setTimeout(function () { bar.remove(); }, 400);
        try { sessionStorage.setItem("ringco-storm-dismissed", id); } catch (_) {}
      });
    }

    function checkRecent() {
      import("/js/firebase-config.js").then(function (m) {
        var cfg = m && m.FIREBASE_CONFIG;
        if (!cfg || !cfg.projectId || !cfg.apiKey) return;
        fetch("https://firestore.googleapis.com/v1/projects/" + cfg.projectId +
          "/databases/(default)/documents/settings/stormBanner?key=" + cfg.apiKey)
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) {
            var f = d && d.fields;
            if (!f || !f.enabled || f.enabled.booleanValue !== true) return;
            renderRecent(
              (f.event && f.event.stringValue) || "A severe storm",
              (f.onset && f.onset.stringValue) || null
            );
          })
          .catch(function () {});
      }).catch(function () { /* config not generated (local preview) */ });
    }

    // Preview hooks — force either banner state for design review
    var params = new URLSearchParams(location.search);
    var demo = params.get("stormdemo");
    if (demo) {
      render({ id: "demo", properties: { event: demo, severity: "Severe", areaDesc: "Oklahoma, OK" } });
      return;
    }
    var demoRecent = params.get("recentdemo");
    if (demoRecent) {
      renderRecent(demoRecent, new Date().toISOString());
      return;
    }

    if (!("fetch" in window)) return;
    fetch("https://api.weather.gov/alerts/active?area=OK", { headers: { Accept: "application/geo+json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var hits = (j && j.features || []).filter(function (f) {
          var p = f.properties;
          return RELEVANT.test(p.event) && METRO.test(p.areaDesc || "");
        });
        if (!hits.length) { checkRecent(); return; } // no live danger — maybe a published recent storm
        hits.sort(function (a, b) { return rank(b) - rank(a); });
        render(hits[0]);
      })
      .catch(checkRecent); /* NWS unreachable — still try the published banner */
  })();
})();
