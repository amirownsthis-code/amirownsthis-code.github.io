(() => {
  "use strict";
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const categoryNames = { all: "All projects", web: "Frontend Development", data: "Data Science" };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.classList.add("js-enabled");
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const link = (href, text, className, external = false) => {
    const node = el("a", className, text);
    node.href = href;
    if (external) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    return node;
  };
  document.querySelectorAll("[data-year]").forEach(node => { node.textContent = new Date().getFullYear(); });
  const nav = document.querySelector("#site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  const topButton = document.querySelector(".back-to-top-button");
  let scrollFrame = 0;
  let scrollToken = 0;
  function cancelScroll() {
    scrollToken++;
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    document.documentElement.classList.remove("is-scrolling");
  }
  function smoothScrollTo(destination, focusTarget) {
    cancelScroll();
    const start = window.scrollY;
    const end = Math.max(0, destination);
    const distance = end - start;
    const finish = () => {
      scrollFrame = 0;
      document.documentElement.classList.remove("is-scrolling");
      if (focusTarget) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    };
    if (reducedMotion.matches || Math.abs(distance) < 2) {
      document.documentElement.classList.add("is-scrolling");
      window.scrollTo(0, end); finish(); return;
    }
    const token = scrollToken;
    const duration = Math.min(1400, Math.max(700, Math.abs(distance) * .4));
    let started;
    document.documentElement.classList.add("is-scrolling");
    const step = now => {
      if (token !== scrollToken) return;
      if (started === undefined) started = now;
      const progress = Math.min(1, (now - started) / duration);
      const easing = progress < .5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + distance * easing);
      if (progress < 1) scrollFrame = window.requestAnimationFrame(step);
      else finish();
    };
    scrollFrame = window.requestAnimationFrame(step);
  }
  function scrollToSection(target) {
    const offset = header ? (window.innerWidth <= 760 ? 70 : 76) : 0;
    smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - offset - 18, target);
  }
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(anchor.getAttribute("href").slice(1));
      if (!target) return;
      event.preventDefault();
      try { const url = new URL(window.location.href); url.hash = target.id; window.history.pushState({}, "", url); } catch (_) {}
      if (target.id === "main" || target.id === "home") smoothScrollTo(0, target);
      else scrollToSection(target);
    });
  });
  topButton?.addEventListener("click", () => smoothScrollTo(0, document.querySelector("#main")));
  window.addEventListener("wheel", cancelScroll, { passive: true });
  window.addEventListener("touchstart", cancelScroll, { passive: true });
  window.addEventListener("keydown", event => { if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) cancelScroll(); });
  const trackedSections = Array.from(document.querySelectorAll("main > section[id]"));
  const trackedLinks = Array.from(document.querySelectorAll('#site-nav a[href^="#"]'));
  function updateScrollState() {
    const scrolled = window.scrollY > 12;
    header?.classList.toggle("is-scrolled", scrolled);
    if (topButton) topButton.hidden = window.scrollY < 250;
    if (!trackedSections.length) return;
    let active = trackedSections[0].id;
    if (window.scrollY > 10) {
      trackedSections.forEach(section => { if (section.getBoundingClientRect().top <= 160) active = section.id; });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) active = trackedSections[trackedSections.length - 1].id;
    }
    trackedLinks.forEach(anchor => {
      const selected = anchor.getAttribute("href") === "#" + active;
      anchor.classList.toggle("active", selected);
      if (selected) anchor.setAttribute("aria-current", "location");
      else anchor.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);
  updateScrollState();
  if (nav && toggle) {
    document.documentElement.classList.add("js-enabled");
    const closeNav = () => {
      nav.classList.remove("is-open");
      header?.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", open);
      header?.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
    document.addEventListener("click", event => { if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav(); });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { closeNav(); toggle.focus(); }
    });
    window.matchMedia("(min-width: 761px)").addEventListener("change", closeNav);
  }
  let revealObserver;
  function observeReveals() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const delay = Number.parseInt(entry.target.style.getPropertyValue("--reveal-delay"), 10) || 0;
            window.setTimeout(() => entry.target.classList.add("settled"), 950 + delay);
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
      document.documentElement.classList.add("motion-ready");
    }
    [".project-grid > .reveal", ".services-grid > .reveal", ".toolkit-grid > .reveal"].forEach(selector => {
      document.querySelectorAll(selector).forEach((node, index) => node.style.setProperty("--reveal-delay", (index % 3) * 140 + "ms"));
    });
    document.querySelectorAll(".section-heading.reveal").forEach(node => { node.dataset.reveal = "zoom"; });
    document.querySelectorAll(".reveal:not(.visible)").forEach(node => revealObserver.observe(node));
  }
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) document.documentElement.classList.remove("motion-ready");
    else observeReveals();
    cancelScroll();
  });
  const typedRole = document.querySelector("#typed-role");
  if (typedRole) {
    const roles = ["Frontend Developer", "Data Science Student"];
    let timer = 0, roleIndex = 0, length = 0, deleting = false;
    const schedule = delay => { timer = window.setTimeout(typeNext, delay); };
    function typeNext() {
      if (reducedMotion.matches) return;
      if (document.hidden) { schedule(300); return; }
      const role = roles[roleIndex];
      length += deleting ? -1 : 1;
      typedRole.textContent = role.slice(0, length);
      if (!deleting && length === role.length) { deleting = true; schedule(1900); }
      else if (deleting && length === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; schedule(350); }
      else schedule(deleting ? 35 : 75);
    }
    const startTyping = () => {
      window.clearTimeout(timer);
      if (reducedMotion.matches) { typedRole.textContent = roles[0]; return; }
      roleIndex = 0; length = 0; deleting = false; typedRole.textContent = ""; schedule(200);
    };
    reducedMotion.addEventListener("change", startTyping);
    window.addEventListener("pagehide", () => window.clearTimeout(timer));
    window.addEventListener("pageshow", event => { if (event.persisted) startTyping(); });
    startTyping();
  }
  function projectCard(project) {
    const article = el("article", "project-card reveal");
    article.dataset.category = project.category;
    const detailUrl = "project.html?id=" + encodeURIComponent(project.id);
    const imageLink = link(detailUrl, undefined, "project-image-link");
    imageLink.setAttribute("aria-label", "View " + project.title + " project");
    const image = el("img", "project-image");
    image.src = project.image; image.alt = project.alt; image.loading = "lazy";
    image.width = 1440; image.height = 900;
    imageLink.append(image);
    const body = el("div", "project-body");
    body.append(el("p", "project-kind", project.type));
    const heading = el("div", "project-title-row");
    const title = el("h3");
    title.append(link(detailUrl, project.title));
    const arrow = el("span", "", "↗"); arrow.setAttribute("aria-hidden", "true");
    heading.append(title, arrow);
    body.append(heading, el("p", "project-summary", project.summary));
    const tags = el("div", "project-tags");
    project.tags.forEach(tag => tags.append(el("span", "", tag)));
    body.append(tags);
    const actions = el("div", "project-actions");
    const detailLink = link(detailUrl, "View project ↗");
    detailLink.setAttribute("aria-label", "View " + project.title + " project details");
    const repoLink = link(project.repository, "GitHub ↗", "", true);
    repoLink.setAttribute("aria-label", project.title + " source on GitHub (opens in a new tab)");
    actions.append(detailLink, repoLink);
    body.append(actions); article.append(imageLink, body);
    return article;
  }
  const grid = document.querySelector("#project-grid");
  if (grid) {
    projects.forEach(project => grid.append(projectCard(project)));
    const filters = Array.from(document.querySelectorAll("[data-category].filter-button"));
    const empty = document.querySelector("#empty-projects");
    const count = document.querySelector("#project-count");
    const applyFilter = category => {
      const selected = Object.hasOwn(categoryNames, category) ? category : "all";
      let visible = 0;
      Array.from(grid.children).forEach(card => {
        card.hidden = selected !== "all" && card.dataset.category !== selected;
        if (!card.hidden) visible++;
      });
      filters.forEach(button => {
        const active = button.dataset.category === selected;
        button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active));
      });
      empty.hidden = visible > 0;
      count.textContent = visible + (visible === 1 ? " project" : " projects");
      observeReveals();
    };
    const selectFilter = category => {
      applyFilter(category);
      const url = new URL(window.location.href);
      if (category === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", category);
      url.hash = "projects";
      try { window.history.pushState({}, "", url); } catch (_) { /* Local file preview can restrict history. */ }
    };
    filters.forEach(button => button.addEventListener("click", () => selectFilter(button.dataset.category)));
    document.querySelector("[data-reset-filter]")?.addEventListener("click", () => {
      selectFilter("web"); filters.find(button => button.dataset.category === "web")?.focus();
    });
    applyFilter(new URL(window.location.href).searchParams.get("category") || "all");
    window.addEventListener("popstate", () => applyFilter(new URL(window.location.href).searchParams.get("category") || "all"));
    document.querySelectorAll('a[href="?category=web#projects"]').forEach(a => {
      a.addEventListener("click", event => {
        event.preventDefault(); selectFilter("web");
        scrollToSection(document.querySelector("#projects"));
      });
    });
  }
  const detail = document.querySelector("#project-detail");
  if (detail) {
    const id = new URL(window.location.href).searchParams.get("id");
    const project = projects.find(item => item.id === id);
    if (!project) {
      detail.append(el("h1", "", "Project not found."), el("p", "detail-subtitle", "Choose a project from the portfolio to explore its details."), link("index.html#projects", "Explore projects ↗", "button button-dark"));
    } else {
      document.title = project.title + " | Muhammad Amir";
      document.querySelector('meta[name="description"]').content = project.summary;
      document.querySelector(".project-back").href = "index.html?category=" + encodeURIComponent(project.category) + "#projects";
      const heading = el("div", "detail-heading");
      const title = el("div");
      title.append(el("p", "eyebrow", categoryNames[project.category].toUpperCase() + " / " + project.type.toUpperCase()), el("h1", "", project.title), el("p", "detail-subtitle", project.summary));
      heading.append(title, link(project.repository, "View source on GitHub ↗", "button button-dark", true));
      const figure = el("figure", "detail-screenshot");
      const screenshot = el("img"); screenshot.src = project.image; screenshot.alt = project.alt;
      figure.append(screenshot, el("figcaption", "", project.title + " — " + project.label + ". Screenshot from the project repository."));
      const body = el("div", "detail-body");
      const story = el("div", "detail-story");
      [["The brief", project.problem], ["My contribution", project.contribution]].forEach(([label, copy]) => {
        const section = el("section"); section.append(el("h2", "", label), el("p", "", copy)); story.append(section);
      });
      const features = el("section"); features.append(el("h2", "", "Inside the interface"));
      const list = el("ul"); project.features.forEach(item => list.append(el("li", "", item))); features.append(list); story.append(features);
      const aside = el("aside", "detail-aside"); aside.setAttribute("aria-label", "Project information");
      const info = el("dl");
      [["ROLE", project.role], ["CONTEXT", project.context], ["TOOLS & TECHNOLOGIES", project.stack.join(" · ")]].forEach(([term, value]) => { info.append(el("dt", "", term), el("dd", "", value)); });
      aside.append(info); body.append(story, aside);
      const note = el("div", "detail-note"); note.append(el("strong", "", "Project context"), document.createTextNode(project.note));
      const next = el("div", "detail-next"); next.append(el("p", "", "Have a related website or interface in mind?"), link("index.html#contact", "Let's talk about it ↗", "button button-dark"));
      detail.append(heading, figure, body, note, next);
    }
  }
  const copyButton = document.querySelector("#copy-email");
  copyButton?.addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText("amirownsthis@gmail.com");
      status.textContent = "Email address copied.";
    } catch (_) { status.textContent = "Copy this address: amirownsthis@gmail.com"; }
  });
  observeReveals();
})();
