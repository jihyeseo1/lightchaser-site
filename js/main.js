// js/main.js (전체 교체본 / 중복 제거 + 안정화)

/* =========================
   Mobile menu toggle
========================= */
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-menu")) {
    const btn = document.querySelector(".btn-menu");
    const gnb = document.querySelector(".gnb");
    if (!btn || !gnb) return;

    btn.classList.toggle("active");
    gnb.classList.toggle("active");

    if (gnb.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }
});

/* =========================
   Phase nav: active state (scroll)
   - requestAnimationFrame 기반
========================= */
(() => {
  const navs = document.querySelectorAll(".phase-nav");
  if (!navs.length) return;

  navs.forEach((nav) => {
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const targets = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    if (!targets.length) return;

    const linkById = new Map(
      links.map((a) => [a.getAttribute("href").slice(1), a])
    );

    const setActive = (id) => {
      links.forEach((a) => a.classList.remove("is-active"));
      const active = linkById.get(id);
      if (active) active.classList.add("is-active");
    };

    let ticking = false;

    const update = () => {
      ticking = false;

      const header = document.querySelector("header");
      const offset = (header ? header.offsetHeight : 0) + 24;

      let current = targets[0];

      for (const t of targets) {
        const top = t.getBoundingClientRect().top;
        if (top - offset <= 0) current = t;
        else break;
      }

      setActive(current.id);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  });
})();

/* =========================
   Video Bleed (YouTube + Local MP4 unified)
========================= */
document.querySelectorAll(".video-bleed").forEach((wrap) => {
  const btn = wrap.querySelector(".yt-lite");
  if (!btn) return;

  const ytId = wrap.dataset.yt;
  const mp4 = wrap.dataset.video;
  const poster = wrap.dataset.poster;

  // poster 처리 (YouTube 썸네일 or 지정 poster)
  if (poster) {
    btn.style.backgroundImage = `url('${poster}')`;
  } else if (ytId) {
    const maxres = `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
    const hq = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;

    const img = new Image();
    img.onload = () => (btn.style.backgroundImage = `url('${maxres}')`);
    img.onerror = () => (btn.style.backgroundImage = `url('${hq}')`);
    img.src = maxres;
  }

  btn.addEventListener("click", () => {
    wrap.innerHTML = "";

    // ▶ YouTube
    if (ytId) {
      const iframe = document.createElement("iframe");
      iframe.title = "Installation Video";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

      Object.assign(iframe.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        border: "0",
      });

      wrap.appendChild(iframe);
      return;
    }

    // ▶ Local MP4
    if (mp4) {
      const video = document.createElement("video");
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "metadata";
      if (poster) video.poster = poster;

      Object.assign(video.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      });

      const source = document.createElement("source");
      source.src = mp4;
      source.type = "video/mp4";
      video.appendChild(source);

      wrap.appendChild(video);
    }
  });
});

/* =========================
   Video cards: click overlay -> play, show controls on play
   (중복 로직 제거)
========================= */
document.querySelectorAll(".video-card").forEach((card) => {
  const video = card.querySelector("video");
  const overlay = card.querySelector(".video-overlay");
  if (!video || !overlay) return;

  // 초기: controls 제거
  video.removeAttribute("controls");

  const hideOverlay = () => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  };

  const showOverlay = () => {
    overlay.style.opacity = "";
    overlay.style.pointerEvents = "";
  };

  overlay.addEventListener("click", async () => {
    video.setAttribute("controls", "controls");
    try {
      await video.play();
      hideOverlay();
    } catch (e) {
      // 재생이 막히면 controls만 유지
    }
  });

  video.addEventListener("play", hideOverlay);
  video.addEventListener("pause", showOverlay);
  video.addEventListener("ended", showOverlay);
});
// ===== Scroll Compact Header (wait until header exists) =====
(function () {
  const THRESHOLD = 80;

  function init(header) {
    if (header.__scrollCompactInited) return; // 중복 방지
    header.__scrollCompactInited = true;

    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastY;

      if (y > THRESHOLD && goingDown) {
        header.classList.add("nav-compact");
      }

      if (!goingDown || y < THRESHOLD) {
        header.classList.remove("nav-compact");
      }

      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 초기 1회 반영
  }

  // 1) 이미 있으면 바로 init
  const headerNow = document.querySelector("header");
  if (headerNow) init(headerNow);

  // 2) include로 나중에 들어오면 감지해서 init
  const mo = new MutationObserver(() => {
    const header = document.querySelector("header");
    if (header) {
      init(header);
      mo.disconnect();
    }
  });

  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector(".global-light-canvas");

  const bottomGlow = document.querySelector(".global-bottom-glow");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let mouseX = 0;
  let mouseY = 0;

  let smoothX = 0;
  let smoothY = 0;

  let initialized = false;

  const trail = [];

  /* 잔광 지속시간 */
  const TRAIL_LIFE = 1200;

  /* =========================================
     CANVAS SIZE
     ========================================= */

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;

    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;

    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  /* =========================================
     MOUSE
     ========================================= */

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!initialized) {
      smoothX = mouseX;
      smoothY = mouseY;

      initialized = true;
    }
  });

  /* =========================================
     ADD TRAIL
     ========================================= */

  function addTrailPoint(now) {
    if (!initialized) return;

    /*
      커서에 약간의 부드러운 지연
    */

    smoothX += (mouseX - smoothX) * 0.26;

    smoothY += (mouseY - smoothY) * 0.26;

    const last = trail[trail.length - 1];

    /*
      실제 이동했을 때만 기록
      → 멈춘 자리에 점 생기는 것 방지
    */

    if (!last || Math.hypot(smoothX - last.x, smoothY - last.y) > 1) {
      trail.push({
        x: smoothX,
        y: smoothY,
        born: now,
      });
    }
  }

  /* =========================================
     REMOVE OLD TRAIL
     ========================================= */

  function removeOldTrail(now) {
    while (trail.length && now - trail[0].born > TRAIL_LIFE) {
      trail.shift();
    }
  }

  /* =========================================
     DRAW
     ========================================= */

  function drawTrail(now) {
    if (trail.length < 3) return;

    /*
      선 조각 사이의 틈이 안 보이도록
      round cap 사용
    */

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 1; i < trail.length; i++) {
      const p1 = trail[i - 1];
      const p2 = trail[i];

      /*
        시간 기준 fade
      */

      const age = Math.min(1, (now - p2.born) / TRAIL_LIFE);

      const life = 1 - age;

      /*
        꼬리 위치

        0 = 가장 오래된 끝
        1 = 현재 마우스 근처
      */

      const position = i / (trail.length - 1);

      /*
        핵심:
        끝으로 갈수록 매우 가늘어짐
      */

      const taper = Math.pow(position, 2.7);

      /*
        시간 fade까지 결합
      */

      const strength = Math.pow(life, 1.6) * taper;

      /*
        중심선

        끝: 약 0.1px
        머리: 약 3px
      */

      const coreWidth = 0.1 + 2.9 * strength;

      /* -------------------------
         아주 넓은 바깥 glow
         ------------------------- */

      ctx.beginPath();

      ctx.moveTo(p1.x, p1.y);

      ctx.lineTo(p2.x, p2.y);

      ctx.lineWidth = coreWidth * 8;

      ctx.strokeStyle = `rgba(
          190,
          230,
          255,
          ${0.05 * strength}
        )`;

      ctx.stroke();

      /* -------------------------
         중간 glow
         ------------------------- */

      ctx.beginPath();

      ctx.moveTo(p1.x, p1.y);

      ctx.lineTo(p2.x, p2.y);

      ctx.lineWidth = coreWidth * 4;

      ctx.strokeStyle = `rgba(
          200,
          238,
          255,
          ${0.5 * strength}
        )`;

      ctx.stroke();

      /* -------------------------
         중심선
         ------------------------- */

      ctx.beginPath();

      ctx.moveTo(p1.x, p1.y);

      ctx.lineTo(p2.x, p2.y);

      ctx.lineWidth = coreWidth;

      ctx.strokeStyle = `rgba(
          240,
          245,
          255,
          ${0.5 * strength}
        )`;

      ctx.stroke();
    }
  }

  /* =========================================
     ANIMATION
     ========================================= */

  function animate(now) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    addTrailPoint(now);

    /*
      마우스를 가만히 두더라도
      시간은 계속 지나기 때문에
      자동으로 없어짐
    */

    removeOldTrail(now);

    drawTrail(now);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  /* =========================================
     BOTTOM SCROLL GLOW
     ========================================= */

  function updateBottomGlow() {
    if (!bottomGlow) return;

    const scrollBottom = window.scrollY + window.innerHeight;

    const documentHeight = document.documentElement.scrollHeight;

    /*
      페이지 맨 아래에서
      약 8px 이내면 빛 제거
    */

    const atBottom = scrollBottom >= documentHeight - 8;

    bottomGlow.classList.toggle("is-hidden", atBottom);
  }

  window.addEventListener("scroll", updateBottomGlow, { passive: true });

  window.addEventListener("resize", updateBottomGlow);

  updateBottomGlow();
});
