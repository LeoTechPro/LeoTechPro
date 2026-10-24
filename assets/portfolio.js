(() => {
  const nav = document.querySelector("[data-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobile = window.matchMedia("(max-width: 760px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const contact = document.querySelector(".mobile-contact");
  const hero = document.querySelector(".hero");

  const syncMenu = () => {
    const open = document.body.classList.contains("menu-open");
    if (!nav || !toggle) return;
    toggle.setAttribute("aria-expanded", String(mobile.matches && open));
    if (mobile.matches) nav.setAttribute("aria-hidden", String(!open));
    else nav.removeAttribute("aria-hidden");
  };
  const close = () => {
    document.body.classList.remove("menu-open");
    syncMenu();
  };
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
      syncMenu();
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        close();
        toggle.focus();
      }
    });
    mobile.addEventListener("change", close);
    syncMenu();
    document.documentElement.classList.add("has-js");
  }

  const syncContact = () => {
    if (!contact || !hero) return;
    const visible = mobile.matches && hero.getBoundingClientRect().bottom < 80;
    contact.classList.toggle("is-visible", visible);
    contact.setAttribute("aria-hidden", String(!visible));
    contact.tabIndex = visible ? 0 : -1;
  };
  window.addEventListener("scroll", syncContact, { passive: true });
  window.addEventListener("resize", syncContact);
  syncContact();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reduce.matches) entry.target.animate(
          [{ opacity: .75, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
          { duration: 650, easing: "cubic-bezier(.2,.6,.2,1)" }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: .15 });
    document.querySelectorAll(".project, .experience-item, .collaboration-grid article").forEach(node => observer.observe(node));
  }
  reduce.addEventListener("change", () => {
    if (reduce.matches) document.getAnimations().forEach(animation => animation.cancel());
  });
  document.querySelectorAll("[data-year]").forEach(node => { node.textContent = String(new Date().getFullYear()); });
  document.querySelectorAll(".tool-card img").forEach(image => {
    image.addEventListener("error", () => { image.hidden = true; });
  });
})();
