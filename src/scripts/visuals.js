/**
 * Capa visual del rediseño (reveals, canvas decorativos, línea de proceso, riel de scroll,
 * curva del EQ y pasos de la agenda). Solo lee el estado que ya publica main.js; no reemplaza su lógica.
 */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RED = [176, 20, 31];
  const GRY = [140, 143, 148];
  const WHT = [244, 243, 241];

  const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const mixRgb = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",");

  const fitCanvas = (canvas) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W: rect.width, H: rect.height };
  };

  /** Nivel del micrófono que main.js escribe en `--live-input` (0–1). */
  const heroConsole = document.getElementById("hero-audio-reactive");
  const readLiveInput = () => {
    if (!heroConsole) return 0;
    const v = Number.parseFloat(heroConsole.style.getPropertyValue("--live-input") || "0");
    return Number.isFinite(v) ? v : 0;
  };

  const runWhenVisible = (canvas, draw) => {
    let visible = true;
    let rafId = 0;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }
    const loop = (t) => {
      if (visible && document.visibilityState === "visible") draw(t);
      rafId = window.requestAnimationFrame(loop);
    };
    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  };

  function initReveal() {
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (reduceMotion || !("IntersectionObserver" in window) || items.length === 0) return;
    const vh = window.innerHeight;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.classList.remove("is-reveal-pending");
          const delay = Number.parseInt(el.style.getPropertyValue("--reveal-delay"), 10) || 0;
          window.setTimeout(() => el.classList.remove("is-reveal-armed"), 560 + delay);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
    );
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) return;
      const step = Number(el.dataset.reveal) || 0;
      el.style.setProperty("--reveal-delay", `${Math.min(step, 5) * 60}ms`);
      el.classList.add("is-reveal-armed", "is-reveal-pending");
      observer.observe(el);
    });
  }

  function initHeroCanvas() {
    const canvas = document.querySelector("[data-hero-canvas]");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    let g = fitCanvas(canvas);
    let mx = 0.5;
    let my = 0.5;
    let tmx = 0.5;
    let tmy = 0.5;
    let ins = 0;
    let tin = 0;
    let live = 0;

    const draw = (t) => {
      mx += (tmx - mx) * 0.09;
      my += (tmy - my) * 0.09;
      ins += (tin - ins) * 0.06;
      live += (readLiveInput() - live) * 0.25;
      const { ctx, W, H } = g;
      ctx.clearRect(0, 0, W, H);
      const N = W < 520 ? 20 : 28;
      const px0 = W * 0.1;
      const step = (W * 0.8) / (N - 1);
      const cy = H * 0.47;
      const cf = ins * Math.max(0, 1 - Math.hypot(mx - 0.5, my - 0.47) / 0.5);
      const lw = Math.max(3, Math.min(9, step * 0.3));
      const rg = lw * 2.3;
      const rows = 9;
      ctx.lineCap = "round";
      ctx.lineWidth = lw;
      for (let i = 0; i < N; i += 1) {
        const x = i / (N - 1);
        const px = px0 + i * step;
        const m = smoothstep(0.34, 0.72, x);
        const env = Math.sin(Math.PI * (0.1 + x * 0.8));
        const prox = ins * Math.exp(-((x - mx) ** 2) / 0.012);
        const wave = 0.5 + 0.5 * Math.sin(x * 8.5 - t * 0.0015 * (1 + live) + mx * 3.4);
        const jitter = live * (0.5 + 0.5 * Math.sin(i * 1.7 + t * 0.02));
        const span =
          H * 0.56 * env * (0.35 + 0.65 * wave) * (1 + 0.55 * prox) * (1 + 0.3 * cf) * (1 + 0.9 * jitter) + H * 0.04;
        const half = Math.min(span, H * 0.86) / 2;
        if (m < 1) {
          ctx.strokeStyle = `rgba(${mixRgb(RED, GRY, smoothstep(0.22, 0.52, x))},${1 - m})`;
          ctx.beginPath();
          ctx.moveTo(px, cy - half);
          ctx.lineTo(px, cy + half);
          ctx.stroke();
        }
        if (m > 0) {
          for (let k = 0; k < rows; k += 1) {
            const y = cy + (k - (rows - 1) / 2) * rg;
            const dy = Math.abs(y - cy);
            if (dy > half + 1) continue;
            const drift = Math.sin(t * 0.0009 + k * 1.7 + x * 5) * step * 0.4 * (1 + prox + live);
            const len = step * (0.3 + 0.55 * (0.5 + 0.5 * Math.sin(k * 2.3 + i * 1.1 + t * 0.0011)));
            ctx.strokeStyle = `rgba(${mixRgb(GRY, WHT, smoothstep(0.5, 0.88, x))},${m * (0.35 + 0.65 * (1 - dy / (half + 1)))})`;
            ctx.beginPath();
            ctx.moveTo(px - len / 2 + drift, y);
            ctx.lineTo(px + len / 2 + drift, y);
            ctx.stroke();
          }
        }
      }
    };

    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width;
      tmy = (e.clientY - r.top) / r.height;
      tin = 1;
      if (reduceMotion) {
        mx = tmx;
        my = tmy;
        ins = 1;
        draw(0);
      }
    });
    canvas.addEventListener("pointerleave", () => {
      tin = 0;
      if (reduceMotion) {
        ins = 0;
        draw(0);
      }
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        g = fitCanvas(canvas);
        if (reduceMotion) draw(0);
      }).observe(canvas);
    }

    if (reduceMotion) draw(0);
    else runWhenVisible(canvas, draw);
  }

  function initWaveCanvas() {
    const canvas = document.querySelector("[data-wave-canvas]");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const freqInput = document.querySelector("[data-wave-freq]");
    const mistInput = document.querySelector("[data-wave-mist]");
    let g = fitCanvas(canvas);
    let mx = 0.5;
    let tmx = 0.5;
    let ins = 0;
    let tin = 0;
    let live = 0;
    const readRange = (input, fallback) =>
      input instanceof HTMLInputElement ? Number(input.value) / 100 : fallback;

    const draw = (t) => {
      mx += (tmx - mx) * 0.1;
      ins += (tin - ins) * 0.07;
      live += (readLiveInput() - live) * 0.25;
      const { ctx, W, H } = g;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(244,243,241,.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      const f = readRange(freqInput, 0.46);
      const mist = readRange(mistInput, 0.45);
      const cy = H / 2;
      const yAt = (x, ph) => {
        const u = x / W;
        const loc = 1 + 1.2 * ins * Math.exp(-((u - mx) ** 2) / 0.01) + live * 1.1;
        return (
          cy +
          H *
            0.17 *
            loc *
            (Math.sin(u * (6 + f * 22) - t * 0.0016 + ph) * 0.7 + Math.sin(u * (13 + f * 30) + t * 0.001 + ph) * 0.3) *
            Math.sin(Math.PI * u)
        );
      };
      const layers = Math.round(mist * 7);
      for (let k = layers; k >= 1; k -= 1) {
        ctx.strokeStyle = `rgba(244,243,241,${0.16 * (1 - k / (layers + 1))})`;
        ctx.lineWidth = 1 + k * 0.6;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y = yAt(x, k * 0.18) + k * 5 * Math.sin(x * 0.01 + k + t * 0.0005);
          if (x) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = "#B0141F";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = yAt(x, -0.25) + 3;
        if (x) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "#F4F3F1";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = yAt(x, 0);
        if (x) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    };

    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width;
      tin = 1;
    });
    canvas.addEventListener("pointerleave", () => {
      tin = 0;
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        g = fitCanvas(canvas);
        if (reduceMotion) draw(0);
      }).observe(canvas);
    }

    if (reduceMotion) {
      draw(0);
      [freqInput, mistInput].forEach((input) => input?.addEventListener("input", () => draw(0)));
    } else {
      runWhenVisible(canvas, draw);
    }
  }

  function initProcessLine() {
    const process = document.querySelector("[data-process]");
    if (!process) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      process.classList.add("is-drawn");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        process.classList.add("is-drawn");
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(process);
  }

  function initScrollRail() {
    const fill = document.querySelector("[data-scroll-progress]");
    if (!(fill instanceof HTMLElement)) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = `scaleY(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  function initEqCurve() {
    const root = document.getElementById("niebla-eq-demo");
    if (!root) return;
    const rails = Array.from(root.querySelectorAll("[data-eq-rail]"));
    const line = root.querySelector("[data-eq-curve]");
    const fill = root.querySelector("[data-eq-curve-fill]");
    if (rails.length === 0 || !line || !fill) return;

    const ratioOf = (rail) => {
      const lo = Number.parseInt(rail.getAttribute("aria-valuemin") ?? "-5", 10);
      const hi = Number.parseInt(rail.getAttribute("aria-valuemax") ?? "5", 10);
      const v = Number.parseInt(rail.getAttribute("aria-valuenow") ?? "0", 10);
      return hi > lo ? (v - lo) / (hi - lo) : 0.5;
    };

    const render = () => {
      const step = 500 / rails.length;
      const pts = rails.map((rail, i) => [step / 2 + i * step, 100 - ratioOf(rail) * 100]);
      let d = `M0 ${pts[0][1]} L${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i += 1) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const midX = (x0 + x1) / 2;
        d += ` C${midX} ${y0} ${midX} ${y1} ${x1} ${y1}`;
      }
      d += ` L500 ${pts[pts.length - 1][1]}`;
      line.setAttribute("d", d);
      fill.setAttribute("d", `${d} L500 100 L0 100 Z`);
    };

    const observer = new MutationObserver(render);
    rails.forEach((rail) => observer.observe(rail, { attributes: true, attributeFilter: ["aria-valuenow"] }));
    render();

    const resetBtn = document.querySelector("[data-eq-reset]");
    resetBtn?.addEventListener("click", () => {
      rails.forEach((rail) => {
        const lo = Number.parseInt(rail.getAttribute("aria-valuemin") ?? "-5", 10);
        const init = Number.parseInt(rail.dataset.eqInit ?? "0", 10);
        const press = (key) =>
          rail.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
        press("Home");
        for (let i = lo; i < init; i += 1) press("ArrowUp");
      });
    });
  }

  function initScheduleSteps() {
    const steps = Array.from(document.querySelectorAll("[data-schedule-steps] > li"));
    const widget = document.getElementById("schedule-widget");
    const timesPanel = document.getElementById("schedule-times-panel");
    const continueBtn = document.getElementById("schedule-continue-btn");
    const details = document.getElementById("schedule-main-details");
    if (steps.length === 0 || !widget) return;

    const sync = () => {
      let stage = 0;
      if (details && !details.hidden) stage = 2;
      else if (continueBtn && !continueBtn.hidden) stage = 2;
      else if (timesPanel && !timesPanel.hidden) stage = 1;
      steps.forEach((li, i) => {
        li.classList.toggle("is-done", i < stage);
        li.classList.toggle("is-active", i === stage);
      });
    };

    new MutationObserver(sync).observe(widget, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
    sync();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initHeroCanvas();
    initWaveCanvas();
    initProcessLine();
    initScrollRail();
    initEqCurve();
    initScheduleSteps();
  });
})();
