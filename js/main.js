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
