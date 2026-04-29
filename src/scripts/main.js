document.addEventListener("DOMContentLoaded", () => {
  const viewCountEl = document.getElementById("view-count");
  if (viewCountEl) {
    const hitUrl = "https://api.countapi.xyz/hit/niebla/soundbranding";
    fetch(hitUrl)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.value === "number") {
          viewCountEl.textContent = data.value.toLocaleString("es");
        }
      })
      .catch(() => {
        viewCountEl.textContent = "—";
      });
  }

  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const menuIcon = menuToggle ? menuToggle.querySelector("span") : null;
  const header = document.querySelector("header");
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const observedSections = Array.from(document.querySelectorAll("main section[id]"));
  const revealAfterViewMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;

  const setActiveLink = (hash) => {
    let foundActive = false;
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === hash;
      if (isActive) {
        foundActive = true;
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (header) {
      if (foundActive) header.classList.add("has-active-link");
      else header.classList.remove("has-active-link");
    }
  };

  if (observedSections.length > 0) {
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
        });
      },
      { threshold: 0.45, rootMargin: "-15% 0px -35% 0px" }
    );
    observedSections.forEach((section) => activeSectionObserver.observe(section));
  }

  if (header) {
    const handleHeaderState = () => {
      if (window.scrollY > 30) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    handleHeaderState();
    window.addEventListener("scroll", handleHeaderState, { passive: true });
  }

  const revealTargets = document.querySelectorAll(
    "main section, #que-hacemos .group, #clientes .grid > div, #como-trabajamos .space-y-20 > div"
  );
  revealTargets.forEach((item) => item.classList.add("reveal-item"));

  const resolveRevealDelay = (target) => {
    if (!(target instanceof HTMLElement)) return revealAfterViewMs;
    if (target.id === "quienes-somos") return 80;
    return revealAfterViewMs;
  };

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = resolveRevealDelay(entry.target);
        window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((item) => revealObserver.observe(item));

  const sonicQuoteEl = document.getElementById("sonic-quote-typewriter");
  if (sonicQuoteEl) {
    const segments = [
      { text: "\"Un gran sonido no solo se escucha: se " },
      { text: "reconoce", className: "text-primary" },
      { text: ", se recuerda y se siente.\"" },
    ];
    let hasTypedQuote = false;
    let typingTimer = 0;
    let index = 0;
    sonicQuoteEl.textContent = "";

    const renderTypedQuote = (charCount) => {
      let remaining = charCount;
      const html = [];
      for (let i = 0; i < segments.length; i += 1) {
        const segment = segments[i];
        if (remaining <= 0) break;
        const chunk = segment.text.slice(0, remaining);
        remaining -= chunk.length;
        if (!chunk) continue;
        if (segment.className) html.push(`<span class="${segment.className}">${chunk}</span>`);
        else html.push(chunk);
      }
      sonicQuoteEl.innerHTML = html.join("");
    };

    const typeQuote = () => {
      const totalLength = segments.reduce((acc, seg) => acc + seg.text.length, 0);
      index += 1;
      renderTypedQuote(index);
      if (index < totalLength) {
        typingTimer = window.setTimeout(typeQuote, 26);
      }
    };

    const startQuoteTyping = () => {
      if (hasTypedQuote) return;
      hasTypedQuote = true;
      window.clearTimeout(typingTimer);
      index = 0;
      renderTypedQuote(0);
      typeQuote();
    };

    const quoteTypeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startQuoteTyping();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.32, rootMargin: "0px 0px -12% 0px" }
    );
    quoteTypeObserver.observe(sonicQuoteEl);
  }

  const closingTypewriterHost = document.getElementById("closing-typewriter-heading");
  const closingTypewriterTarget = closingTypewriterHost
    ? closingTypewriterHost.querySelector(".closing-typewriter__target")
    : null;
  if (closingTypewriterHost && closingTypewriterTarget) {
    const closingTypewriterText = "No es audio. Es percepción que activa decisiones.";
    const closingMotionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let closingTyped = false;
    let closingTimer = 0;

    const runClosingTypewriter = () => {
      if (closingTyped) return;
      closingTyped = true;
      window.clearTimeout(closingTimer);
      if (!closingMotionOk) {
        closingTypewriterTarget.textContent = closingTypewriterText;
        return;
      }
      let index = 0;
      closingTypewriterTarget.textContent = "";
      const step = () => {
        index += 1;
        closingTypewriterTarget.textContent = closingTypewriterText.slice(0, index);
        if (index < closingTypewriterText.length) {
          closingTimer = window.setTimeout(step, 24);
        }
      };
      step();
    };

    const closingObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runClosingTypewriter();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.38, rootMargin: "0px 0px -10% 0px" }
    );
    closingObserver.observe(closingTypewriterHost);
  }

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    mobileNav.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    if (menuIcon) menuIcon.textContent = "menu";
  };

  const openMenu = () => {
    if (!menuToggle || !mobileNav) return;
    mobileNav.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú de navegación");
    if (menuIcon) menuIcon.textContent = "close";
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) closeMenu();
      else openMenu();
    });
    mobileNav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!mobileNav.contains(target) && !menuToggle.contains(target) && !mobileNav.classList.contains("hidden")) {
        closeMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;
      event.preventDefault();
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    });
  });

  const heroPremium = document.querySelector(".hero-premium");
  const heroAudioConsole = document.getElementById("hero-audio-reactive");
  const heroAudioEnableBtn = document.getElementById("hero-audio-enable");
  const heroAudioAmbientePolicy = document.getElementById("hero-audio-ambiente-policy");
  const heroAudioLiveIndicator = document.getElementById("hero-audio-live-indicator");
  const HERO_AUDIO_POLICY_IDLE =
    "Para que el analizador reaccione al sonido real de tu entorno (voz, música, ruido de la sala), el navegador necesita permiso de micrófono. Solo puede pedírtelo de forma segura tras un gesto tuyo en esta página: es una política de seguridad del propio navegador, no del sitio. El audio se analiza solo en tu dispositivo para animar estas ondas; no se graba ni se envía a ningún servidor.";
  const HERO_AUDIO_POLICY_LIVE =
    "Escuchando el ambiente solo en este dispositivo para animar el analizador. El audio no se graba ni se transmite.";
  const HERO_AUDIO_POLICY_DENIED =
    "No se pudo acceder al micrófono. Revisa el permiso del sitio en la barra del navegador o pulsa Reintentar.";
  const HERO_AUDIO_POLICY_UNSUPPORTED =
    "Tu navegador no ofrece acceso al micrófono para esta visualización (por ejemplo HTTP inseguro o API no disponible). Las ondas se muestran en modo decorativo.";
  const heroAudioRadialBars = document.getElementById("hero-audio-radial-bars");
  const heroAudioRingMain = document.getElementById("hero-audio-ring-main");
  const heroAudioRingSecondary = document.getElementById("hero-audio-ring-secondary");
  const heroAudioFloorWave = document.getElementById("hero-audio-floor-wave");
  const heroAudioMics = Array.from(document.querySelectorAll("[data-hero-mic]"));
  const quienesSonicConsole = document.getElementById("quienes-sonic-console");
  const quienesSonicWave = document.getElementById("quienes-sonic-wave");
  const quienesSonicBars = document.getElementById("quienes-sonic-bars");
  const quienesSonicWavePath = document.getElementById("quienes-sonic-wave-path");
  const quienesSonicWaveAccent = document.getElementById("quienes-sonic-wave-accent");
  const quienesSonicWaveFill = document.getElementById("quienes-sonic-wave-fill");
  const sonicQuoteWavePath = document.getElementById("sonic-quote-wave-path");
  const quienesMeter = document.querySelector("[data-q-meter]");
  const quienesKnob = document.querySelector("[data-q-knob]");
  const quienesSlider = document.querySelector("[data-q-slider]");
  if (!heroPremium || !heroAudioConsole || !heroAudioRadialBars || !heroAudioRingMain || !heroAudioRingSecondary || !heroAudioFloorWave) return;

  const heroGlowFrame = heroAudioConsole.closest(".hero-visual-sculpt__frame");

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const BAR_COUNT = 42;
  const CENTER = 180;
  const RADIUS = 132;
  const radialLines = [];
  const quienesBarEls = [];
  const frequencyData = new Uint8Array(BAR_COUNT);
  const supportsAudio = !!AudioCtx && !!navigator.mediaDevices?.getUserMedia;
  let state = "idle";
  let phase = 0;
  let hoverBoost = 0;
  let quienesHoverTarget = 0;
  let quienesHoverBlend = 0;
  let quienesPointerX = 0.5;
  let quienesPointerY = 0.5;
  let quienesAutoDrift = 0;
  let liveDecibelLevel = 0;
  /** Respuesta rápida a volumen RMS (capta mejor murmullo ambiental vs solo FFT). */
  let liveAmpRms = 0;
  let energy = 0.2;
  let rafId = 0;
  let audioContext;
  let analyser;
  let micGainNode;
  let micStream;
  let source;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const polarPoint = (angle, radius) => ({ x: CENTER + Math.cos(angle) * radius, y: CENTER + Math.sin(angle) * radius });
  const buildClosedPath = (points) => {
    if (!points.length) return "";
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} ${points.slice(1).map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")} Z`;
  };
  const syncLiveGlow = (levelNorm) => {
    const lv = clamp01(levelNorm || 0);
    heroAudioConsole.style.setProperty("--live-input", String(lv.toFixed(4)));
    if (heroGlowFrame instanceof HTMLElement) {
      heroGlowFrame.style.setProperty("--live-input", String(lv.toFixed(4)));
    }
    quienesSonicConsole?.style.setProperty("--live-input", String(lv.toFixed(4)));
  };

  const setConsoleState = (nextState) => {
    state = nextState;
    heroAudioConsole.setAttribute("data-audio-state", nextState);
    document.body.classList.toggle("mic-listening", nextState === "live");
    if (heroAudioEnableBtn) {
      if (nextState === "fallback-static") {
        if (supportsAudio) {
          heroAudioEnableBtn.textContent = "Reintentar";
          heroAudioEnableBtn.disabled = false;
          heroAudioEnableBtn.setAttribute("aria-label", "Reintentar acceso al micrófono para el analizador");
        } else {
          heroAudioEnableBtn.textContent = "No disponible";
          heroAudioEnableBtn.disabled = true;
          heroAudioEnableBtn.removeAttribute("aria-label");
        }
      } else if (nextState === "idle") {
        heroAudioEnableBtn.textContent = "Activar sonido ambiente";
        heroAudioEnableBtn.disabled = false;
        heroAudioEnableBtn.setAttribute("aria-label", "Activar micrófono para animar la consola solo en este dispositivo");
      } else if (nextState === "live") {
        heroAudioEnableBtn.textContent = "Detener";
        heroAudioEnableBtn.disabled = false;
        heroAudioEnableBtn.setAttribute("aria-label", "Detener uso del micrófono");
      }
    }
    if (heroAudioAmbientePolicy) {
      if (nextState === "fallback-static") {
        heroAudioAmbientePolicy.textContent = supportsAudio ? HERO_AUDIO_POLICY_DENIED : HERO_AUDIO_POLICY_UNSUPPORTED;
      } else if (nextState === "idle") heroAudioAmbientePolicy.textContent = HERO_AUDIO_POLICY_IDLE;
      else if (nextState === "live") heroAudioAmbientePolicy.textContent = HERO_AUDIO_POLICY_LIVE;
    }
    if (heroAudioLiveIndicator) {
      const on = nextState === "live";
      heroAudioLiveIndicator.hidden = !on;
      heroAudioLiveIndicator.setAttribute("aria-hidden", on ? "false" : "true");
    }
    if (nextState !== "live") syncLiveGlow(0);
  };

  const teardownLiveAudio = () => {
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      micStream = null;
    }
    try {
      if (source) source.disconnect();
    } catch (_) {
      /**/
    }
    source = null;
    try {
      if (micGainNode) micGainNode.disconnect();
    } catch (_) {
      /**/
    }
    micGainNode = null;
    analyser = null;
  };

  const stopLiveAudio = async () => {
    teardownLiveAudio();
    renderStatic();
    if (audioContext && audioContext.state === "running") {
      await audioContext.suspend().catch(() => {});
    }
    setConsoleState("idle");
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden") return;
    if (state === "live") void stopLiveAudio();
  });
  window.addEventListener(
    "pagehide",
    () => {
      if (state === "live") teardownLiveAudio();
    },
    { passive: true }
  );

  for (let i = 0; i < BAR_COUNT; i += 1) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(CENTER));
    line.setAttribute("y1", String(CENTER));
    line.setAttribute("x2", String(CENTER));
    line.setAttribute("y2", String(CENTER - RADIUS));
    heroAudioRadialBars.appendChild(line);
    radialLines.push(line);
  }

  const QUIENES_BAR_COUNT = 32;
  if (quienesSonicBars) {
    for (let i = 0; i < QUIENES_BAR_COUNT; i += 1) {
      const bar = document.createElement("span");
      bar.className = "quienes-sonic-bar";
      quienesSonicBars.appendChild(bar);
      quienesBarEls.push(bar);
    }
  }

  const renderStatic = () => {
    for (let i = 0; i < BAR_COUNT; i += 1) frequencyData[i] = 62 + Math.round((i % 8) * 11);
  };

  let timeDomainScratch = new Uint8Array(0);

  const getAudioEnvelope = () => {
    if (!analyser) return 0;
    const fftBins = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fftBins);
    const binLen = analyser.frequencyBinCount;
    for (let i = 0; i < BAR_COUNT; i += 1) {
      const ratio = i / BAR_COUNT;
      const idx = Math.floor(ratio * (binLen - 1));
      frequencyData[i] = fftBins[idx];
    }
    let sum = 0;
    let peak = 0;
    for (let i = 0; i < BAR_COUNT; i += 1) sum += frequencyData[i];
    for (let i = 0; i < fftBins.length; i += 1) {
      if (fftBins[i] > peak) peak = fftBins[i];
    }
    const avgNorm = clamp01(sum / (BAR_COUNT * 255));
    const peakNorm = clamp01(peak / 255);

    const tdLen = analyser.fftSize;
    if (timeDomainScratch.length !== tdLen) {
      timeDomainScratch = new Uint8Array(tdLen);
    }
    analyser.getByteTimeDomainData(timeDomainScratch);
    let sumSq = 0;
    for (let i = 0; i < tdLen; i += 1) {
      const centered = (timeDomainScratch[i] - 128) / 128;
      sumSq += centered * centered;
    }
    const rmsNorm = clamp01(Math.sqrt(sumSq / tdLen) * 3.6);
    liveAmpRms = lerp(liveAmpRms, rmsNorm, 0.38);

    const combined = clamp01(avgNorm * 0.38 + peakNorm * 0.55 + liveAmpRms * 0.62);
    liveDecibelLevel = lerp(liveDecibelLevel, combined, 0.32);
    return liveDecibelLevel;
  };

  const renderFrame = () => {
    const liveEnvelope = state === "live" ? getAudioEnvelope() : 0;
    if (state === "live") syncLiveGlow(liveDecibelLevel * 0.92 + liveEnvelope * 0.08);

    const target = state === "live" ? 0.28 + liveEnvelope * 0.92 : 0.21 + Math.sin(phase * 0.9) * 0.06 + hoverBoost * 0.22;
    energy = lerp(energy, target, 0.08);
    phase += 0.022 + energy * 0.02;
    quienesHoverBlend = lerp(quienesHoverBlend, quienesHoverTarget, 0.2);
    if (quienesHoverBlend > 0.04) phase += quienesHoverBlend * 0.016;

    const quienesVuEnvelope = 0.74 + 0.32 * Math.sin(phase * 0.36);
    const heroFloorEnvelope = 0.86 + 0.21 * Math.sin(phase * 0.41);

    const ringMain = [];
    const ringSecondary = [];
    let wavePath = `M 0 50`;
    let quienesWavePath = "M 0 110";
    let quienesWaveAccentPath = "M 0 110";
    const quienesFillBaseline = 216;
    const quienesFillPts = [];
    let quoteWavePath = "M 0 70";
    const qh = quienesHoverBlend;
    const autoXFrame = Math.sin(quienesAutoDrift * 1.3) * 0.12 * qh;
    const autoYFrame = Math.cos(quienesAutoDrift * 0.95) * 0.1 * qh;
    for (let i = 0; i < BAR_COUNT; i += 1) {
      const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
      const audioAmp = (frequencyData[i] || 0) / 255;
      const idle = 0.42 + Math.sin(phase * 1.2 + i * 0.47) * 0.38;
      const liveAmp = clamp01(audioAmp * 1.45 + liveEnvelope * 0.42 + hoverBoost * 0.08);
      const amp = clamp01(state === "live" ? liveAmp : idle * 0.65 + hoverBoost * 0.25);
      const heroEnvStretch = state === "live" ? liveEnvelope * 22 : 0;
      const innerRadius = RADIUS - 36 + amp * 12;
      const outerRadius = RADIUS + 10 + amp * (46 + heroEnvStretch * 0.35) + heroEnvStretch * 0.45 + hoverBoost * 11;
      const p1 = polarPoint(angle, innerRadius);
      const p2 = polarPoint(angle, outerRadius);
      radialLines[i].setAttribute("x1", p1.x.toFixed(2));
      radialLines[i].setAttribute("y1", p1.y.toFixed(2));
      radialLines[i].setAttribute("x2", p2.x.toFixed(2));
      radialLines[i].setAttribute("y2", p2.y.toFixed(2));
      const ringShake = state === "live" ? Math.sin(phase * 3.4 + i * 0.9) * liveAmpRms * 5.5 : 0;
      ringMain.push(polarPoint(angle, RADIUS - 9 + amp * 28 + liveEnvelope * 16 + ringShake));
      ringSecondary.push(polarPoint(angle, RADIUS - 35 + amp * 19 + liveEnvelope * 11 + ringShake * 0.65));
      const waveX = (i / (BAR_COUNT - 1)) * 520;
      const heroWaveBoost = state === "live" ? liveEnvelope * 22 + liveAmpRms * 18 : 0;
      const heroFloorPrimary =
        Math.sin(phase * 1.4 + i * 0.35) * heroFloorEnvelope * (10 + amp * 22 + heroWaveBoost * 0.95) +
        (amp - 0.5) * (12 + (state === "live" ? liveAmpRms * 15 : 0));
      const waveY = 50 + heroFloorPrimary;
      wavePath += ` L ${waveX.toFixed(2)} ${waveY.toFixed(2)}`;

      const qWaveX = (i / (BAR_COUNT - 1)) * 600;
      const autoX = autoXFrame;
      const autoY = autoYFrame;
      const pointerDriftX = (quienesPointerX + autoX - 0.5) * 22;
      const pointerDriftY = (quienesPointerY + autoY - 0.5) * 26;
      const liveWaveBoost = state === "live" ? clamp01(liveDecibelLevel * 1.08) * 38 : 0;
      const qhBoost = 1 + qh * 0.85;
      const qPrimaryAmp =
        (28 + amp * 54 + liveWaveBoost + qh * 44) *
        quienesVuEnvelope *
        qhBoost;
      const qCore = Math.sin(phase * 1.1 + i * 0.42 + pointerDriftX * 0.02);
      const qHarmonic =
        Math.sin(phase * 2.55 + i * 0.95 + pointerDriftY * 0.018) *
        (12 + amp * 12 + qh * 34 + (state === "live" ? liveDecibelLevel * 14 : 0));
      const qSeaSwell = Math.sin(phase * 0.48 + i * 0.13) * (8 + qh * 44);
      const qSeaRipple =
        Math.sin(phase * 3.75 + i * 1.08 + pointerDriftY * 0.02) * qh * 22;
      const fAxis = i / (BAR_COUNT - 1);
      const hiBandMix = clamp01((fAxis - 0.32) / 0.62);
      const hfJitRaw =
        Math.sin(phase * 17.55 + i * 12.8) +
        Math.sin(phase * 25.1 + i * 17.93) * 0.68 +
        Math.sin(phase * 33.4 + i * 8.14) * 0.42 +
        Math.sin(phase * 41.02 + i * 22.3) * 0.34;
      const hfJit =
        hfJitRaw * (0.45 + qh * 0.9 + (state === "live" ? liveAmpRms * 0.9 : 0)) * hiBandMix * (4.5 + qh * 42);
      const loSmoothLift =
        Math.sin(phase * 0.66 + i * 0.1) *
        clamp01((0.5 - fAxis) / 0.5) *
        (14 + qh * 22 + (state === "live" ? liveDecibelLevel * 12 : 0));
      let qWaveYUnc =
        110 + qCore * qPrimaryAmp + qHarmonic + qSeaSwell + qSeaRipple + pointerDriftY + hfJit + loSmoothLift;
      const qWaveY = Math.min(198, Math.max(22, qWaveYUnc));
      quienesFillPts.push({ x: qWaveX, y: qWaveY });
      quienesWavePath += ` L ${qWaveX.toFixed(2)} ${qWaveY.toFixed(2)}`;
      const qAccentUnc =
        110 +
        (qWaveYUnc - 110) * 0.8 +
        Math.sin(phase * 3.08 + i * 1.06) * (7 + qh * 20) +
        Math.sin(phase * 6.1 + i * 0.44) * qh * 14;
      const qAccentY = Math.min(200, Math.max(18, qAccentUnc));
      quienesWaveAccentPath += ` L ${qWaveX.toFixed(2)} ${qAccentY.toFixed(2)}`;

      const quoteX = (i / (BAR_COUNT - 1)) * 900;
      const quoteAmp = state === "live" ? amp : 0.18 + Math.sin(phase * 1.05 + i * 0.38) * 0.12;
      const quoteY = 70 + Math.sin(phase * 1.2 + i * 0.33) * (4 + quoteAmp * 26);
      quoteWavePath += ` L ${quoteX.toFixed(2)} ${quoteY.toFixed(2)}`;
    }

    heroAudioRingMain.setAttribute("d", buildClosedPath(ringMain));
    heroAudioRingSecondary.setAttribute("d", buildClosedPath(ringSecondary));
    heroAudioFloorWave.setAttribute("d", wavePath);
    if (quienesSonicWavePath) quienesSonicWavePath.setAttribute("d", quienesWavePath);
    if (quienesSonicWaveAccent) quienesSonicWaveAccent.setAttribute("d", quienesWaveAccentPath);
    if (quienesSonicWaveFill && quienesFillPts.length > 0) {
      let fd = `M 0 ${quienesFillBaseline}`;
      fd += ` L ${quienesFillPts[0].x.toFixed(2)} ${quienesFillPts[0].y.toFixed(2)}`;
      for (let qi = 1; qi < quienesFillPts.length; qi += 1) {
        fd += ` L ${quienesFillPts[qi].x.toFixed(2)} ${quienesFillPts[qi].y.toFixed(2)}`;
      }
      fd += ` L 600 ${quienesFillBaseline} Z`;
      quienesSonicWaveFill.setAttribute("d", fd);
    }
    if (sonicQuoteWavePath) sonicQuoteWavePath.setAttribute("d", quoteWavePath);

    if (quienesBarEls.length > 0) {
      const nBar = quienesBarEls.length;
      quienesBarEls.forEach((bar, idx) => {
        const tNorm = idx / Math.max(1, nBar - 1);
        const bell = Math.exp(-Math.pow((tNorm - 0.5) * 3.85, 2));
        const f1 = Math.sin(phase * 3.35 + idx * 1.18);
        const f2 = Math.sin(phase * 5.8 + idx * 2.42);
        const f3 = Math.sin(phase * 8.95 + idx * 0.72);
        const sparkle = Math.sin(phase * 13.2 + idx * 3.14) * (0.1 + qh * 0.26);
        let sim = clamp01(
          bell * (0.46 + 0.54 * (0.5 + 0.48 * f1)) +
            0.2 * f2 * (0.35 + qh * 0.95) +
            0.14 * f3 * (0.4 + 0.6 * bell) +
            sparkle +
            qh * 0.22 * Math.sin(phase * 4.2 + idx * 1.4)
        );
        const binT = (idx / Math.max(1, nBar - 1)) * (BAR_COUNT - 1);
        const i0 = Math.floor(binT);
        const i1 = Math.min(BAR_COUNT - 1, i0 + 1);
        const mixBin = binT - i0;
        const fAmp = lerp((frequencyData[i0] || 0) / 255, (frequencyData[i1] || 0) / 255, mixBin);
        const combined = state === "live" ? clamp01(fAmp * 0.58 + sim * 0.48) : sim;
        const gestureGain = qh * (14 + Math.abs(quienesPointerX + autoXFrame - 0.5) * 34);
        const decibelGain = state === "live" ? liveDecibelLevel * 34 : 0;
        const hNorm = Math.min(
          100,
          Math.max(
            6,
            8 + combined * (52 + qh * 58 + decibelGain * 0.35) + gestureGain
          )
        );
        bar.style.setProperty("--bar-h", `${hNorm}%`);
      });
    }

    if (quienesMeter) {
      const meterTarget = state === "live"
        ? clamp01(liveDecibelLevel * 0.92 + qh * 0.22 + quienesPointerX * 0.08)
        : clamp01(energy * 0.9 + qh * 0.35 + quienesPointerX * 0.15);
      const meterW = Math.round(meterTarget * 88 + 8);
      quienesMeter.style.width = `${meterW}%`;
    }
    if (quienesSlider) {
      const sliderTarget = state === "live"
        ? clamp01(liveDecibelLevel * 0.85 + qh * 0.22 + (1 - quienesPointerX) * 0.1)
        : clamp01(energy * 0.7 + qh * 0.45 + (1 - quienesPointerX) * 0.2);
      const sliderW = Math.round(30 + sliderTarget * 56);
      quienesSlider.style.width = `${sliderW}%`;
    }
    if (quienesKnob) {
      const baseRot = -30 + clamp01(energy) * 60;
      const pointerRot = (quienesPointerX + autoXFrame - 0.5) * 34 + (0.5 - (quienesPointerY + autoYFrame)) * 18;
      quienesKnob.style.setProperty("--knob-rot", `${(baseRot + pointerRot * qh).toFixed(2)}deg`);
    }

    if (quienesSonicConsole) {
      const tx = (quienesPointerX + autoXFrame - 0.5) * 10 * qh;
      const ty = (quienesPointerY + autoYFrame - 0.5) * 8 * qh;
      quienesSonicConsole.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    }

    quienesAutoDrift += 0.028;

    heroAudioMics.forEach((mic, idx) => {
      const pulse = Math.sin(phase * 1.7 + idx * 0.9) * (state === "live" ? 3.4 + liveAmpRms * 8 : 1.2);
      mic.style.setProperty("--mic-y", `${(-4 - energy * 5 + pulse * 0.36).toFixed(2)}px`);
      mic.style.setProperty("--mic-r", `${((idx === 0 ? -1 : 1) * (1.5 + energy * 2.8)).toFixed(2)}deg`);
    });

    rafId = window.requestAnimationFrame(() => renderFrame());
  };

  const setFallbackStatic = () => {
    setConsoleState("fallback-static");
    renderStatic();
  };

  const initLiveAudio = async () => {
    if (!supportsAudio || state === "live") return;
    teardownLiveAudio();
    liveDecibelLevel = 0;
    liveAmpRms = 0;
    try {
      if (!audioContext) audioContext = new AudioCtx();
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      await audioContext.resume().catch(() => {});
      source = audioContext.createMediaStreamSource(micStream);
      micGainNode = audioContext.createGain();
      micGainNode.gain.value = 2.25;
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.42;
      source.connect(micGainNode);
      micGainNode.connect(analyser);
      if (audioContext.state === "suspended") await audioContext.resume();
      setConsoleState("live");
    } catch (_) {
      teardownLiveAudio();
      setFallbackStatic();
    }
  };

  const applyHeroParallax = (event) => {
    const rect = heroPremium.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    heroPremium.style.setProperty("--hero-cx", x.toFixed(4));
    heroPremium.style.setProperty("--hero-cy", y.toFixed(4));
  };
  const resetHeroParallax = () => {
    heroPremium.style.setProperty("--hero-cx", "0");
    heroPremium.style.setProperty("--hero-cy", "0");
  };

  const updateQuienesPointer = (clientX, clientY) => {
    if (!quienesSonicConsole) return;
    const rect = quienesSonicConsole.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    quienesPointerX = clamp01((clientX - rect.left) / rect.width);
    quienesPointerY = clamp01((clientY - rect.top) / rect.height);
  };

  const resetQuienesInteraction = () => {
    if (!quienesSonicConsole) return;
    quienesHoverTarget = 0;
    quienesPointerX = 0.5;
    quienesPointerY = 0.5;
    quienesSonicConsole.style.transform = "translate3d(0,0,0)";
    quienesSonicConsole.classList.remove("is-hover");
  };

  heroPremium.addEventListener("mousemove", applyHeroParallax);
  heroPremium.addEventListener("mouseleave", resetHeroParallax);
  heroAudioConsole.addEventListener("mouseenter", () => {
    hoverBoost = 1;
    heroAudioConsole.classList.add("is-hover");
  });
  heroAudioConsole.addEventListener("mouseleave", () => {
    hoverBoost = 0;
    heroAudioConsole.classList.remove("is-hover");
  });

  if (heroAudioEnableBtn) {
    heroAudioEnableBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (state === "live") void stopLiveAudio();
      else void initLiveAudio();
    });
  }

  if (quienesSonicConsole && quienesSonicWave) {
    const onQuienesConsoleEnter = () => {
      quienesHoverTarget = 1;
      quienesPointerX = 0.62;
      quienesPointerY = 0.42;
      quienesSonicConsole.classList.add("is-hover");
    };
    quienesSonicConsole.addEventListener("mouseenter", onQuienesConsoleEnter);
    quienesSonicConsole.addEventListener("mousemove", (event) => {
      updateQuienesPointer(event.clientX, event.clientY);
    });
    quienesSonicConsole.addEventListener("mouseleave", resetQuienesInteraction);
    quienesSonicConsole.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches[0]) {
          onQuienesConsoleEnter();
          updateQuienesPointer(event.touches[0].clientX, event.touches[0].clientY);
        }
      },
      { passive: true }
    );
    quienesSonicConsole.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches[0]) {
          updateQuienesPointer(event.touches[0].clientX, event.touches[0].clientY);
        }
      },
      { passive: true }
    );
    quienesSonicConsole.addEventListener("touchend", resetQuienesInteraction, { passive: true });
    quienesSonicConsole.addEventListener("touchcancel", resetQuienesInteraction, { passive: true });
    quienesSonicWave.addEventListener("pointerenter", onQuienesConsoleEnter, { passive: true });
  }

  if (!supportsAudio) setFallbackStatic();
  else setConsoleState("idle");
  renderFrame();
});
