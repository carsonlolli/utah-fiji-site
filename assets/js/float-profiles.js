/* =============================================================
   Floating profile cards
   Example network cards drift slowly up behind a hero. They're
   illustrations, not real people: roles and cities only, initials
   for avatars, no names or photos.

   Usage: <header class="hero hero--profiles"> … </header>
   Pauses off screen; holds still for reduced motion.
   ============================================================= */
(function () {
  "use strict";

  var CARDS = [
    { i: "JM", role: "Parent · Finance", meta: "Salt Lake City", tag: "Internships" },
    { i: "AR", role: "Alum ’26 · Software", meta: "Lehi, UT", tag: "Mentoring" },
    { i: "KS", role: "Parent · Healthcare", meta: "Denver, CO", tag: "Résumé review" },
    { status: "Intro accepted", meta: "Coffee on Thursday" },
    { i: "DT", role: "Parent · Real estate", meta: "Park City, UT", tag: "Industry advice" },
    { i: "BL", role: "Alum ’27 · Consulting", meta: "Chicago, IL", tag: "Job referrals" },
    { i: "MW", role: "Parent · Law", meta: "Phoenix, AZ", tag: "Mentoring" },
    { status: "Request sent", meta: "Marketing internship" },
    { i: "CN", role: "Parent · Engineering", meta: "Seattle, WA", tag: "Internships" },
    { i: "RP", role: "Alum ’26 · Sales", meta: "Salt Lake City", tag: "Industry advice" },
    { i: "EH", role: "Parent · Small business", meta: "Boise, ID", tag: "Résumé review" },
    { status: "Happy to help", meta: "Replied by email" },
    { i: "TG", role: "Parent · Aviation", meta: "Dallas, TX", tag: "Job referrals" },
    { i: "SV", role: "Alum ’27 · Product", meta: "San Francisco, CA", tag: "Mentoring" },
  ];

  // Lanes across the width. The middle lanes sit behind the headline, so they stay faint.
  var LANES = [3, 15, 28, 41, 54, 67, 80, 92];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function card(c) {
    var n = el("div", c.status ? "fp-card fp-card--status" : "fp-card");
    if (c.status) {
      n.appendChild(el("span", "fp-check", "✓"));
      var s = el("div", "fp-body");
      s.appendChild(el("div", "fp-role", c.status));
      s.appendChild(el("div", "fp-meta", c.meta));
      n.appendChild(s);
      return n;
    }
    n.appendChild(el("span", "fp-avatar", c.i));
    var b = el("div", "fp-body");
    b.appendChild(el("div", "fp-role", c.role));
    b.appendChild(el("div", "fp-meta", c.meta));
    b.appendChild(el("span", "fp-tag", c.tag));
    n.appendChild(b);
    return n;
  }

  document.querySelectorAll(".hero--profiles").forEach(function (hero) {
    var layer = el("div", "fp-layer");
    layer.setAttribute("aria-hidden", "true");

    var small = window.matchMedia("(max-width: 720px)").matches;
    var list = small ? CARDS.filter(function (_, i) { return i % 2 === 0; }) : CARDS;

    list.forEach(function (c, i) {
      var n = card(c);
      var lane = LANES[(i * 3) % LANES.length];         // spread neighbours apart
      var centre = lane > 22 && lane < 76;
      var depth = (i % 3) / 2;                            // 0 near, 1 far
      var dur = 34 + depth * 22 + (i % 4) * 3;            // far cards drift slower
      n.style.setProperty("--x", lane + "%");
      n.style.setProperty("--dur", dur + "s");
      n.style.setProperty("--delay", -((i / list.length) * dur) + "s"); // already spread out on load
      n.style.setProperty("--scale", (1 - depth * 0.22).toFixed(2));
      n.style.setProperty("--alpha", (centre ? 0.22 : 0.62) - depth * 0.14);
      n.style.setProperty("--sway", (i % 2 ? 14 : -14) + "px");
      if (depth === 1) n.classList.add("fp-far");
      layer.appendChild(n);
    });

    hero.insertBefore(layer, hero.firstChild);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        layer.classList.toggle("fp-paused", !entries[0].isIntersecting);
      }).observe(hero);
    }
  });
})();
