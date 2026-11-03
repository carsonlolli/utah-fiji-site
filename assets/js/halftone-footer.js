/* =============================================================
   Halftone wordmark footer
   A plain-JS port of the React "halftone-wordmark-footer" component.
   The wordmark is set huge, cropped by the bottom edge and printed as
   halftone dots. Dots part around the pointer on springs and warm in
   colour as they're pushed; a click sends a shock ring through the word.

   Usage: <footer class="hwf-root" data-hwf-word="fiji"> … </footer>
   Optional data attributes: data-hwf-ink, data-hwf-warm, data-hwf-bg,
   data-hwf-gap, data-hwf-radius, data-hwf-crop, data-hwf-grain,
   data-hwf-font, data-hwf-weight.
   ============================================================= */
(function () {
  "use strict";

  function hex(h) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((h || "").trim());
    if (!m) return null;
    var s = m[1].length === 3 ? m[1].split("").map(function (c) { return c + c; }).join("") : m[1];
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }

  // Area-true dot radius for a cell coverage in [0, 1], so tone stays even.
  function dotRadius(coverage, gap) {
    var c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
    return Math.sqrt(c) * gap * 0.56;
  }

  function mount(root) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    root.insertBefore(canvas, root.firstChild);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var d = root.dataset;
    var css = getComputedStyle(root);
    var o = {
      word: d.hwfWord || "fiji",
      bg: d.hwfBg || css.getPropertyValue("--hwf-bg").trim() || "#08070b",
      ink: d.hwfInk || css.getPropertyValue("--hwf-ink").trim() || "#f3eff9",
      warm: d.hwfWarm || css.getPropertyValue("--hwf-warm").trim() || "#e4c36b",
      gap: Math.max(3, parseFloat(d.hwfGap) || 6),
      radius: parseFloat(d.hwfRadius) || 80,
      crop: Math.max(0, Math.min(0.6, d.hwfCrop ? parseFloat(d.hwfCrop) : 0.2)),
      grain: d.hwfGrain ? parseFloat(d.hwfGrain) : 0.5,
      font: d.hwfFont || "'Oswald', 'Arial Narrow', sans-serif",
      weight: d.hwfWeight || "700",
    };
    // Height taken by the links and rule above the word, in CSS px.
    function measureReserve() {
      var rule = root.querySelector(".hwf-rule");
      if (!rule) return 0;
      return rule.getBoundingClientRect().bottom - root.getBoundingClientRect().top + 16;
    }
    o.reserve = measureReserve();
    var ink = hex(o.ink) || [243, 239, 249];
    var warm = hex(o.warm) || [228, 195, 107];

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var w = 0, h = 0, dpr = 1;
    var px = -1e5, py = -1e5;
    var raf = 0, visible = true, awake = true;
    var ring = { x: 0, y: 0, t: -1 };
    var dots = new Float32Array(0); // x, y, vx, vy, hx, hy, r per dot
    var count = 0;
    var grainPattern = null;

    function layout() {
      o.reserve = measureReserve();
      var rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Set the word once on a 1x mask, sized to fill the width.
      var mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      var m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      m.font = o.weight + " 100px " + o.font;
      var measured = m.measureText(o.word).width;
      var fit = measured > 0 ? ((w * 1.02) / measured) * 100 : 0;
      m.font = o.weight + " " + fit + "px " + o.font;
      var box = m.measureText(o.word);
      var cap = box.actualBoundingBoxAscent || fit * 0.72;
      // Condensed faces get very tall at full width. Keep the visible word
      // inside the space under the links, shrinking it (centred) if needed.
      var room = h - o.reserve;
      var shown = cap * (1 - o.crop);
      if (room > 0 && shown > room) {
        fit *= room / shown;
        m.font = o.weight + " " + fit + "px " + o.font;
        box = m.measureText(o.word);
        cap = box.actualBoundingBoxAscent || fit * 0.72;
      }
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(o.word, (w - box.width) / 2, h + cap * o.crop);
      var img = m.getImageData(0, 0, w, h).data;

      var gap = o.gap;
      var cols = Math.ceil(w / gap);
      var rows = Math.ceil(h / gap);
      var tmp = [];
      for (var gy = 0; gy < rows; gy++) {
        for (var gx = 0; gx < cols; gx++) {
          // Coverage: average alpha over a 3×3 sample of the cell.
          var sum = 0;
          for (var sy = 0; sy < 3; sy++) {
            for (var sx = 0; sx < 3; sx++) {
              var x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              var y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          var cov = sum / (9 * 255);
          if (cov < 0.06) continue;
          var hx = gx * gap + gap / 2;
          var hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, dotRadius(cov, gap));
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;

      // One tile of print grain, laid over every frame.
      var tile = document.createElement("canvas");
      tile.width = tile.height = 256;
      var g = tile.getContext("2d");
      if (g) {
        var id = g.createImageData(256, 256);
        for (var i = 0; i < id.data.length; i += 4) {
          var v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
        grainPattern = ctx.createPattern(tile, "repeat");
      }
      awake = true;
    }

    function draw(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.bg;
      ctx.fillRect(0, 0, w, h);

      var r = reduced ? 0 : o.radius;
      var ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      var ringR = ringAge * 0.9;
      var moving = false;

      for (var i = 0; i < count; i++) {
        var j = i * 7;
        var x = dots[j], y = dots[j + 1], vx = dots[j + 2], vy = dots[j + 3];
        var hx = dots[j + 4], hy = dots[j + 5];
        if (!reduced) {
          if (ringAge < 900) {
            var rx = hx - ring.x, ry = hy - ring.y;
            var rd = Math.sqrt(rx * rx + ry * ry) + 0.001;
            var band = 1 - Math.min(1, Math.abs(rd - ringR) / 26);
            if (band > 0) {
              var rf = band * 3.2 * (1 - ringAge / 900);
              vx += (rx / rd) * rf;
              vy += (ry / rd) * rf;
            }
          }
          // Push away from the pointer, then spring home with damping.
          var dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
          if (r > 0 && d2 < r * r) {
            var dd = Math.sqrt(d2) + 0.001;
            var f = (1 - dd / r) * 2.6;
            vx += (dx / dd) * f;
            vy += (dy / dd) * f;
          }
          vx = (vx + (hx - x) * 0.05) * 0.84;
          vy = (vy + (hy - y) * 0.05) * 0.84;
          x += vx;
          y += vy;
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true;
          else { x = hx; y = hy; vx = 0; vy = 0; }
          dots[j] = x; dots[j + 1] = y; dots[j + 2] = vx; dots[j + 3] = vy;
        }
        var k = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        ctx.fillStyle = k > 0.02
          ? "rgb(" + Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
            Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
            Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
          : o.ink;
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }

      if (grainPattern && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09;
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      // Sleep once every dot is home and nothing is pushing.
      awake = moving || ringAge < 900 || px > -1e4;
    }

    function loop(now) {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    }
    function wake() {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    }
    function local(e) {
      var b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    }

    root.addEventListener("pointermove", function (e) {
      var p = local(e);
      px = p[0]; py = p[1];
      wake();
    });
    root.addEventListener("pointerleave", function () {
      px = py = -1e5;
      wake();
    });
    root.addEventListener("pointerdown", function (e) {
      if (reduced || e.target.closest("a,button")) return;
      var p = local(e);
      ring = { x: p[0], y: p[1], t: performance.now() };
      wake();
    });

    layout();
    draw(performance.now());
    wake();

    new ResizeObserver(function () { layout(); wake(); }).observe(root);
    new IntersectionObserver(function (entries) {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    }).observe(root);
    // A web font that lands late re-sets the word in its real face.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); wake(); });

    var up = root.querySelector("[data-hwf-top]");
    if (up) up.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });
  }

  document.querySelectorAll(".hwf-root").forEach(mount);
})();
