/* =============================================================
   Typed pillars: types each of the five pillars under the Home
   page title, deletes it, types the next, and keeps cycling.
   Starts once the intro screen has faded (or right away if there
   was none), and pauses while the hero is off screen. Screen
   readers get the full list once instead of the typing.

   Markup: <span class="pillar-type" data-pillars></span>
   ============================================================= */
(function () {
  "use strict";

  var PILLARS = ["Friendship", "Knowledge", "Service", "Morality", "Excellence"];
  var TYPE_MS = 75, DELETE_MS = 38, HOLD_MS = 1500, GAP_MS = 260;

  document.querySelectorAll("[data-pillars]").forEach(function (host) {
    host.innerHTML = '<span class="pillar-sr">' + PILLARS.join(", ") + '</span>' +
      '<span class="pillar-word" aria-hidden="true"></span><span class="pillar-caret" aria-hidden="true"></span>';
    var word = host.querySelector(".pillar-word");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      word.textContent = PILLARS.join(" · ");
      host.classList.add("pillar-type--still");
      return;
    }

    var i = 0, n = 0, deleting = false, timer = 0, visible = true, started = false;

    function tick() {
      timer = 0;
      if (!visible) return;
      var text = PILLARS[i];
      if (!deleting) {
        word.textContent = text.slice(0, ++n);
        if (n < text.length) return schedule(TYPE_MS);
        deleting = true;
        return schedule(HOLD_MS);
      }
      word.textContent = text.slice(0, --n);
      if (n > 0) return schedule(DELETE_MS);
      deleting = false;
      i = (i + 1) % PILLARS.length;
      schedule(GAP_MS);
    }
    function schedule(ms) { timer = setTimeout(tick, ms); }
    function start() { if (started) return; started = true; schedule(250); }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && started && !timer) schedule(200);
      }).observe(host);
    }

    if (window.fijiIntroDone) start();
    else {
      document.addEventListener("fiji:intro-done", start, { once: true });
      setTimeout(start, 7000); // in case the intro script didn't load
    }
  });
})();
