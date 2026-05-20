// senescenciacelular.com — minimal, no-deps client JS
// Lite YouTube facade + scroll reveals + canvas cell field + SW

(function () {
  "use strict";

  /* -------- Service Worker registration (PWA) -------- */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  /* -------- Lite YouTube facade --------
     Each <div class="lite-youtube" data-id="VIDEO_ID" data-title="..." data-author="..."></div>
     On click, swaps in the real iframe. */
  function ytPoster(id) {
    return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }
  function buildLiteYT(el) {
    const id = el.dataset.id;
    if (!id) return;
    const title = el.dataset.title || "";
    const author = el.dataset.author || "";
    el.style.backgroundImage = `url(${ytPoster(id)})`;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `Reproducir video: ${title}`);
    el.innerHTML = `
      ${author ? `<span class="lite-youtube__author">${author}</span>` : ""}
      <span class="lite-youtube__play" aria-hidden="true"></span>
      ${title ? `<span class="lite-youtube__title">${title}</span>` : ""}
    `;
    const activate = () => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`);
      iframe.setAttribute("title", title || "YouTube video");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("loading", "lazy");
      el.appendChild(iframe);
      el.removeEventListener("click", activate);
      el.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } };
    el.addEventListener("click", activate, { once: false });
    el.addEventListener("keydown", onKey);
  }
  document.querySelectorAll(".lite-youtube").forEach(buildLiteYT);

  /* -------- Reveal on scroll -------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* -------- Cell field canvas (hero background) -------- */
  const canvas = document.getElementById("cellfield");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cells = [];
    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      cells = Array.from({ length: Math.min(46, Math.floor((w * h) / 26000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 8 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        hue: Math.random() < 0.55 ? 155 : (Math.random() < 0.5 ? 195 : 22),
        a: 0.04 + Math.random() * 0.18,
      }));
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });
    function frame() {
      ctx.clearRect(0, 0, w, h);
      // Soft connections
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        c.x += c.vx; c.y += c.vy;
        if (c.x < -c.r) c.x = w + c.r;
        if (c.x > w + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = h + c.r;
        if (c.y > h + c.r) c.y = -c.r;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        grad.addColorStop(0, `hsla(${c.hue}, 80%, 65%, ${c.a})`);
        grad.addColorStop(1, `hsla(${c.hue}, 80%, 65%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Thin filament lines between close pairs
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const a = cells[i], b = cells[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 22000) {
            const alpha = 0.06 * (1 - d2 / 22000);
            ctx.strokeStyle = `hsla(160, 80%, 70%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* -------- Scrollspy for two-col side TOC -------- */
  const tocLinks = document.querySelectorAll('.two-col__side a[href^="#"]');
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    tocLinks.forEach((a) => {
      const t = document.querySelector(a.getAttribute("href"));
      if (t) map.set(t, a);
    });
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const link = map.get(e.target);
          if (!link) return;
          if (e.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    map.forEach((_link, target) => io2.observe(target));
  }
})();
