(() => {
  const header = document.querySelector("[data-elevate]");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const year = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const hint = document.getElementById("form-hint");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setMenu = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("is-open", open);
  };

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!expanded);
  });

  document.addEventListener("click", (event) => {
    if (!navToggle || !navMenu) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (navToggle.contains(target) || navMenu.contains(target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  navMenu?.addEventListener("click", (event) => {
    const link = event.target?.closest?.("a");
    if (link) setMenu(false);
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const setHint = (text) => {
    if (!hint) return;
    hint.textContent = text;
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(form instanceof HTMLFormElement)) return;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setHint("Please fill in all fields.");
      return;
    }

    const recipient = form.dataset.recipient?.trim() ?? "";
    const subject = encodeURIComponent(`Portfolio inquiry - ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;

    setHint("Opening your email app...");
    window.location.href = mailto;
  });

  form?.addEventListener("reset", () => {
    setHint("");
  });
})();
