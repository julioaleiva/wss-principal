(() => {
  "use strict";

  const { CATEGORIES, SYSTEMS } = window.WSS || { CATEGORIES: {}, SYSTEMS: [] };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Header / nav ---------- */
  const header = $("#header");
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 12);
    toTop?.classList.toggle("is-visible", y > 500);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  $$(".nav__link", nav).forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Systems catalog ---------- */
  const filtersEl = $("#filters");
  const gridEl = $("#systemsGrid");
  const emptyEl = $("#systemsEmpty");
  const systemCountEl = $("#systemCount");

  if (systemCountEl) {
    systemCountEl.textContent = String(SYSTEMS.length);
  }

  const statusLabel = {
    live: "En vivo",
    beta: "Beta",
    soon: "Próximamente",
  };

  function buildFilters() {
    if (!filtersEl) return;

    Object.values(CATEGORIES).forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter";
      btn.type = "button";
      btn.dataset.filter = cat.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", "false");
      btn.textContent = cat.label;
      filtersEl.appendChild(btn);
    });

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;
      $$(".filter", filtersEl).forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderSystems(btn.dataset.filter);
    });
  }

  function cardHTML(system) {
    const cat = CATEGORIES[system.category];
    const isLive = Boolean(system.url) && system.status !== "soon";
    const badgeClass = isLive ? "is-live" : "is-soon";
    const badgeText = statusLabel[system.status] || (isLive ? "En vivo" : "Próximamente");
    const tags = (system.tags || [])
      .slice(0, 3)
      .map((t) => `<span>${escapeHTML(t)}</span>`)
      .join("");

    const link = isLive
      ? `<a class="system-card__link" href="${escapeAttr(system.url)}" target="_blank" rel="noopener noreferrer">
           Abrir
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
         </a>`
      : `<span class="system-card__link">En desarrollo</span>`;

    return `
      <article class="system-card ${isLive ? "" : "is-disabled"}" data-category="${escapeAttr(system.category)}">
        <div class="system-card__top">
          <div class="system-card__icon" aria-hidden="true">${system.icon || "◆"}</div>
          <span class="system-card__badge ${badgeClass}">${escapeHTML(badgeText)}</span>
        </div>
        <h3>${escapeHTML(system.name)}</h3>
        <p>${escapeHTML(system.description)}</p>
        <div class="system-card__footer">
          <div class="system-card__tags">
            <span>${escapeHTML(cat?.label || system.category)}</span>
            ${tags}
          </div>
          ${link}
        </div>
      </article>
    `;
  }

  function renderSystems(filter = "all") {
    if (!gridEl) return;
    const list =
      filter === "all"
        ? SYSTEMS
        : SYSTEMS.filter((s) => s.category === filter);

    if (!list.length) {
      gridEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    gridEl.innerHTML = list.map(cardHTML).join("");
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/'/g, "&#39;");
  }

  buildFilters();
  renderSystems("all");

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const formNote = $("#formNote");
  const submitBtn = $("#submitBtn");

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formNote.textContent = "";
    formNote.className = "form-note";

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const rubro = String(data.get("rubro") || "").trim();
    const message = String(data.get("message") || "").trim();
    const honey = String(data.get("_honey") || "");

    // honeypot
    if (honey) return;

    let valid = true;
    const fields = {
      name: $("#name"),
      email: $("#email"),
      rubro: $("#rubro"),
      message: $("#message"),
    };

    Object.values(fields).forEach((el) => el?.classList.remove("is-invalid"));

    if (!name) {
      fields.name?.classList.add("is-invalid");
      valid = false;
    }
    if (!emailOk(email)) {
      fields.email?.classList.add("is-invalid");
      valid = false;
    }
    if (!rubro) {
      fields.rubro?.classList.add("is-invalid");
      valid = false;
    }
    if (!message || message.length < 8) {
      fields.message?.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      formNote.textContent = "Revisá los campos marcados e intentá de nuevo.";
      formNote.classList.add("is-error");
      return;
    }

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";

    try {
      // FormSubmit AJAX endpoint
      const res = await fetch("https://formsubmit.co/ajax/wssarg@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          rubro,
          message,
          _subject: "WSS — Nuevo contacto desde la web",
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!res.ok) throw new Error("send_failed");

      form.reset();
      formNote.textContent = "Mensaje enviado. Te respondo a la brevedad.";
      formNote.classList.add("is-success");
    } catch {
      // Fallback: mailto si el servicio falla o no está activado
      const subject = encodeURIComponent(`WSS — Contacto (${rubro})`);
      const body = encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\nRubro: ${rubro}\n\n${message}`
      );
      window.location.href = `mailto:wssarg@gmail.com?subject=${subject}&body=${body}`;
      formNote.textContent =
        "Abriendo tu cliente de correo como alternativa...";
      formNote.classList.add("is-success");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
})();
