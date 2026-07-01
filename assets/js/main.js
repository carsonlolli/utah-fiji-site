/* =============================================================
   Phi Gamma Delta · University of Utah — shared behavior
   ============================================================= */
(function () {
  "use strict";

  /* ---------- Nav: mobile toggle + scroll state ---------- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".hamburger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Hero / welcome video: play in view, sound toggle ---------- */
  var video = document.getElementById("heroVideo");
  if (video && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { video.play().catch(function () {}); }
        else { video.pause(); }
      });
    }, { threshold: 0.4 });
    vio.observe(video);
    var soundBtn = document.getElementById("videoSound");
    if (soundBtn) {
      var syncIcon = function () {
        soundBtn.innerHTML = video.muted
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
        soundBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
      };
      syncIcon();
      soundBtn.addEventListener("click", function () { video.muted = !video.muted; if (!video.muted) video.play().catch(function(){}); syncIcon(); });
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq-item");
      var ans = item.querySelector(".faq-a");
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : null;
    });
  });

  /* ---------- BTL tabs ---------- */
  var tabBtns = document.querySelectorAll(".tab-btn");
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
        document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
        var panel = document.getElementById("panel-" + btn.getAttribute("data-tab"));
        if (panel) panel.classList.add("active");
      });
    });
  }

  /* ---------- Program accordion (BTL) ---------- */
  document.querySelectorAll(".prog-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".prog-item");
      var body = item.querySelector(".prog-body");
      var list = item.closest(".prog-list");
      var isOpen = item.classList.contains("open");
      if (list) list.querySelectorAll(".prog-item").forEach(function (i) {
        i.classList.remove("open");
        var b = i.querySelector(".prog-body"); if (b) b.style.maxHeight = null;
      });
      if (!isOpen) { item.classList.add("open"); body.style.maxHeight = body.scrollHeight + "px"; }
    });
  });

  /* ---------- Member portal: login gate ---------- */
  var GATE_USER = "UtahPhiGam", GATE_PASS = "Utes1848!";
  var gate = document.getElementById("gate");
  if (gate) {
    var content = document.getElementById("pageContent");
    var showSite = function () { gate.classList.add("hidden"); if (content) content.classList.add("visible"); };
    if (sessionStorage.getItem("fiji-portal-auth") === "true") showSite();
    window.handleGateLogin = function () {
      var u = (document.getElementById("gateUser").value || "").trim();
      var p = document.getElementById("gatePass").value || "";
      if (u === GATE_USER && p === GATE_PASS) {
        sessionStorage.setItem("fiji-portal-auth", "true"); showSite();
      } else {
        document.getElementById("gateError").classList.add("show");
        document.getElementById("gatePass").value = "";
        document.getElementById("gatePass").focus();
      }
    };
  }

  /* ---------- Checklist (member portal) ---------- */
  var checklist = document.getElementById("checklist");
  if (checklist) {
    var CK = "fiji-initiate-checklist";
    var load = function () { try { return JSON.parse(localStorage.getItem(CK)) || {}; } catch (e) { return {}; } };
    var save = function (s) { try { localStorage.setItem(CK, JSON.stringify(s)); } catch (e) {} };
    var items = document.querySelectorAll(".checklist li");
    var update = function () {
      var done = document.querySelectorAll(".checklist li.checked").length;
      var pct = items.length ? Math.round(done / items.length * 100) : 0;
      var bar = document.getElementById("progressBar"); if (bar) bar.style.width = pct + "%";
      var txt = document.getElementById("progressText"); if (txt) txt.textContent = done + " of " + items.length + " completed";
    };
    items.forEach(function (li) {
      li.addEventListener("click", function () {
        li.classList.toggle("checked");
        var s = load(); s[li.dataset.key] = li.classList.contains("checked"); save(s); update();
      });
    });
    var saved = load();
    items.forEach(function (li) { if (saved[li.dataset.key]) li.classList.add("checked"); });
    update();

    window.downloadChecklist = function () {
      var t = "PHI GAMMA DELTA — NEW INITIATE CHECKLIST\nUniversity of Utah Chapter\n" + Array(49).join("=") + "\n\n";
      document.querySelectorAll(".group-title").forEach(function (g) {
        t += g.textContent.trim() + "\n" + Array(37).join("-") + "\n";
        var ul = g.nextElementSibling;
        if (ul && ul.tagName === "UL") ul.querySelectorAll("li").forEach(function (li) {
          var ck = li.classList.contains("checked");
          var lbl = li.querySelector(".check-label").childNodes[0].textContent.trim();
          var sm = li.querySelector("small");
          t += (ck ? "[x] " : "[ ] ") + lbl + "\n"; if (sm) t += "    " + sm.textContent.trim() + "\n";
        });
        t += "\n";
      });
      t += Array(49).join("=") + "\nQuestions? Contact: nme@utahfiji.org\n";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" }));
      a.download = "FIJI-New-Initiate-Checklist.txt";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };
  }

  /* ---------- BTL admin console ---------- */
  var adminModal = document.getElementById("adminModal");
  if (adminModal) {
    window.openAdmin = function () { adminModal.classList.add("open"); };
    window.closeAdminModal = function () { adminModal.classList.remove("open"); };
    adminModal.addEventListener("click", function (e) { if (e.target === adminModal) adminModal.classList.remove("open"); });
    window.handleAdminLogin = function (e) {
      e.preventDefault();
      var u = (document.getElementById("adminUser").value || "").trim();
      var p = document.getElementById("adminPass").value || "";
      if (u === GATE_USER && p === GATE_PASS) {
        adminModal.classList.remove("open");
        document.getElementById("adminUser").value = "";
        document.getElementById("adminPass").value = "";
        document.getElementById("adminError").style.display = "none";
        document.getElementById("adminPanel").classList.add("open");
      } else {
        var err = document.getElementById("adminError"); err.style.display = "block";
        setTimeout(function () { err.style.display = "none"; }, 3000);
      }
    };
    window.closeAdminPanel = function () { document.getElementById("adminPanel").classList.remove("open"); };

    var SK = "fiji_btl_admin_status_v1";
    var CYCLE = ["pending", "progress", "completed"];
    var LABELS = { pending: "Pending", progress: "In Progress", completed: "Completed" };
    var flash = function () {
      var ind = document.getElementById("saveIndicator"); if (!ind) return;
      ind.style.opacity = "1"; clearTimeout(window._sf);
      window._sf = setTimeout(function () { ind.style.opacity = "0"; }, 1400);
    };
    (function () {
      try {
        var saved = JSON.parse(localStorage.getItem(SK) || "{}");
        document.querySelectorAll(".status-pill").forEach(function (pill) {
          var k = pill.getAttribute("data-key");
          if (saved[k]) { pill.setAttribute("data-state", saved[k]); pill.textContent = LABELS[saved[k]]; }
        });
      } catch (e) {}
    })();
    document.querySelectorAll(".status-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        var cur = pill.getAttribute("data-state") || "pending";
        var next = CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length];
        pill.setAttribute("data-state", next); pill.textContent = LABELS[next];
        try { var s = JSON.parse(localStorage.getItem(SK) || "{}"); s[pill.getAttribute("data-key")] = next; localStorage.setItem(SK, JSON.stringify(s)); } catch (e) {}
        flash();
      });
    });
    window.resetAllStatuses = function () {
      if (!confirm("Reset all program statuses back to Pending?")) return;
      try { localStorage.removeItem(SK); } catch (e) {}
      document.querySelectorAll(".status-pill").forEach(function (pill) { pill.setAttribute("data-state", "pending"); pill.textContent = LABELS.pending; });
      flash();
    };
  }

  /* ---------- Contact form (demo, no backend) ---------- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) status.textContent = "Thanks — your message has been noted. Connect a form endpoint to receive submissions by email.";
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
