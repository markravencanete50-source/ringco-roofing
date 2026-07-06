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

  /* ---------- Contact form (front-end only — wire to endpoint in prod) ---------- */
  var form = document.querySelector("#estimate-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      btn.textContent = "Request sent ✓ — we'll call you shortly";
      btn.disabled = true;
      btn.style.opacity = "0.85";
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
})();
