/* =============================================================
   Intro screen: the first time someone opens the site in a visit,
   a black screen shows the crest and "Phi Gamma Delta", then fades
   to the page. When it's gone it fires "fiji:intro-done", which the
   Home page's typed pillars wait for.

   Load in <head> (not deferred) so the black screen covers the page
   before it paints. Shows once per browser session; click, tap, Esc,
   Enter or the Skip button ends it early.
   ============================================================= */
(function () {
  "use strict";

  var KEY = "fiji-intro-seen";
  var SHOW_MS = 2300, REDUCED_MS = 1200, MAX_MS = 6000;

  function announceDone() {
    window.fijiIntroDone = true;
    document.dispatchEvent(new Event("fiji:intro-done"));
  }

  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* private mode: just show it */ }
  if (seen) { window.fijiIntroDone = true; return; }
  try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* ignore */ }

  var root = document.documentElement;
  root.classList.add("intro-on");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function build() {
    var el = document.createElement("div");
    el.className = "intro";
    el.innerHTML =
      '<img class="intro-crest" src="assets/img/crest.png" width="246" height="406" alt="">' +
      '<div class="intro-name">Phi Gamma Delta</div>' +
      '<span class="intro-sr">Phi Gamma Delta</span>' +
      '<button type="button" class="intro-skip">Skip</button>';
    document.body.appendChild(el);

    var done = false;
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function finish() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      el.classList.add("intro--out");
      root.classList.remove("intro-on");
      document.removeEventListener("keydown", onKey);
      setTimeout(function () { el.remove(); }, 900);
      setTimeout(announceDone, 450); // start the page's own animations as the fade gets going
    }
    function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } }

    el.addEventListener("click", finish);
    document.addEventListener("keydown", onKey);
    el.querySelector(".intro-skip").focus({ preventScroll: true });
    later(finish, reduced ? REDUCED_MS : SHOW_MS);
    later(finish, MAX_MS); // never trap anyone behind the intro
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
