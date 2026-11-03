/* =============================================================
   Scroll effects. Load BEFORE main.js.

   1. Gentle reveals: headings, cards, images, callouts and list rows
      that aren't already inside a .reveal block get the class, so
      main.js fades them up as they scroll into view. Grid items are
      staggered left to right. Stat numbers count up when they appear.

   2. Scroll-driven FAQ
   The FAQ section pins in place while you scroll. Each question
   opens in turn, then closes as the next one opens. Once the last
   one closes, the section lets go and the page carries on.

   Markup: <section class="scroll-faq"> <div class="scroll-faq-pin"> …
   .faq-item rows … <span data-faq-count></span> <span data-faq-bar></span>
   Falls back to the normal click accordion (from main.js) for reduced
   motion, or when the pinned panel wouldn't fit the screen.
   ============================================================= */
(function () {
  "use strict";

  // Event lists: hide anything that's already over, and show the "more coming" note if nothing's left.
  document.querySelectorAll("[data-events]").forEach(function (list) {
    var now = Date.now();
    list.querySelectorAll("[data-ends]").forEach(function (row) {
      var end = Date.parse(row.getAttribute("data-ends"));
      if (!isNaN(end) && end < now) row.remove();
    });
    if (!list.children.length) {
      list.hidden = true;
      var empty = list.parentNode.querySelector("[data-events-empty]");
      if (empty) empty.hidden = false;
    }
  });

  var SKIP = ".reveal, .hero, .scroll-faq-pin, .hwf-root, .nav, .admin-panel, .gate";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tag(el, delay) {
    if (el.closest(SKIP)) return;
    el.classList.add("reveal");
    if (delay) el.setAttribute("data-delay", String(delay));
  }

  // Grid items first, so each row ripples in left to right.
  document.querySelectorAll(".grid").forEach(function (grid) {
    // Read columns from the class: grids inside hidden tabs have no computed layout yet.
    var m = /grid-(\d)/.exec(grid.className);
    var cols = m ? +m[1] : 3;
    Array.prototype.forEach.call(grid.children, function (el, i) { tag(el, Math.min(i % cols, 3)); });
  });
  document.querySelectorAll(
    "section .eyebrow, section .section-title, section .lede, .cta h2, .cta p, .cta .btn, " +
    ".card, .callout, .frame, .video-frame, .person, .bucket-header, .lms-step, .btn-row, .pullquote"
  ).forEach(function (el) { tag(el, 0); });

  // Once something has faded in, drop its stagger delay so hover effects respond instantly.
  function settled(el) {
    setTimeout(function () { el.removeAttribute("data-delay"); el.classList.add("reveal-done"); }, 1000);
  }

  // Count stat numbers up from zero ("100+", "3.4", "500+"). Years like "2025" stay put.
  function countUp(el) {
    var raw = el.textContent.trim();
    var m = /^(\d+(?:\.\d+)?)(\D*)$/.exec(raw);
    if (!m || /^(19|20)\d\d$/.test(m[1]) || reduced) return;
    var target = parseFloat(m[1]);
    var places = (m[1].split(".")[1] || "").length;
    var start = null;
    el.textContent = (0).toFixed(places) + m[2];
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / 1400);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(places) + m[2];
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = raw;
    }
    requestAnimationFrame(frame);
  }

  // main.js adds .in when an element scrolls into view; react to that here.
  if ("MutationObserver" in window) {
    var watch = new MutationObserver(function (records) {
      records.forEach(function (r) {
        var el = r.target;
        if (!el.classList.contains("in") || el.classList.contains("reveal-done")) return;
        settled(el);
        el.querySelectorAll(".stat .n, .n").forEach(function (n) { if (n.closest(".stat")) countUp(n); });
      });
    });
    document.querySelectorAll(".reveal").forEach(function (el) {
      watch.observe(el, { attributes: true, attributeFilter: ["class"] });
    });
  }

  var STEP = 0.5; // viewport heights of scrolling per question

  document.querySelectorAll(".scroll-faq").forEach(function (section) {
    var pin = section.querySelector(".scroll-faq-pin");
    var items = Array.prototype.slice.call(section.querySelectorAll(".faq-item"));
    var count = section.querySelector("[data-faq-count]");
    var bar = section.querySelector("[data-faq-bar]");
    if (!pin || !items.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var enabled = false;
    var active = -2;
    var ticking = false;

    function navHeight() {
      var nav = document.querySelector(".nav");
      return nav ? nav.offsetHeight : 0;
    }

    function setOpen(item, open) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      item.classList.toggle("open", open);
      if (q) q.setAttribute("aria-expanded", open ? "true" : "false");
      if (a) a.style.maxHeight = open ? a.scrollHeight + "px" : null;
    }

    // Pin only if the panel, with its tallest answer open, fits on screen.
    function fits() {
      var available = window.innerHeight - navHeight();
      var closed = pin.scrollHeight;
      items.forEach(function (it) { if (it.classList.contains("open")) closed -= it.querySelector(".faq-a").offsetHeight; });
      var tallest = 0;
      items.forEach(function (it) { tallest = Math.max(tallest, it.querySelector(".faq-a").scrollHeight); });
      return closed + tallest <= available - 24;
    }

    function layout() {
      section.classList.remove("is-pinned");
      section.style.height = "";
      enabled = pin.offsetWidth > 0 && !reduced.matches && fits();
      if (!enabled) {
        if (count) count.textContent = "";
        return;
      }
      section.classList.add("is-pinned");
      section.style.setProperty("--faq-top", navHeight() + "px");
      // Enough room to scroll: one screen for the panel plus a step per question,
      // with half a step of breathing room before the first and after the last.
      var travel = (items.length + 1) * STEP * window.innerHeight;
      section.style.height = pin.offsetHeight + travel + "px";
      active = -2;
      update();
    }

    function update() {
      ticking = false;
      if (!enabled) return;
      var range = section.offsetHeight - pin.offsetHeight;
      var travelled = navHeight() - section.getBoundingClientRect().top;
      var p = Math.max(0, Math.min(1, travelled / range));
      var slot = Math.floor(p * (items.length + 1) - 0.5);
      var next = slot >= 0 && slot < items.length ? slot : -1;

      if (bar) bar.style.transform = "scaleX(" + p + ")";
      if (next === active) return;
      active = next;
      items.forEach(function (it, i) { setOpen(it, i === next); });
      if (count) {
        var shown = next < 0 ? (p < 0.5 ? 0 : items.length) : next + 1;
        count.textContent = String(shown).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    // Clicking a question while pinned scrolls to that question's spot instead of fighting the scroll.
    items.forEach(function (it, i) {
      var q = it.querySelector(".faq-q");
      if (!q) return;
      q.addEventListener("click", function (e) {
        if (!enabled) return;
        e.stopImmediatePropagation();
        var range = section.offsetHeight - pin.offsetHeight;
        var top = section.getBoundingClientRect().top + window.scrollY - navHeight();
        var p = (i + 1) / (items.length + 1);
        window.scrollTo({ top: top + p * range, behavior: "smooth" });
      }, true);
    });

    layout();
    // Re-measure if the FAQ was hidden at load (the members page reveals it after login).
    var lastWidth = pin.offsetWidth;
    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        if (pin.offsetWidth !== lastWidth) { lastWidth = pin.offsetWidth; layout(); }
      }).observe(pin);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    if (reduced.addEventListener) reduced.addEventListener("change", layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  });
})();
