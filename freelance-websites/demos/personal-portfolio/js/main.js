/* Tolu Martins — concept portfolio script
   To reuse for a real client: put real links in LINKS below. Any link left
   empty shows a short "demo" notice instead of navigating. */
(function () {
  "use strict";

  var LINKS = {
    email: "",      // e.g. "mailto:hello@example.com"
    cv: "",         // e.g. "assets/cv.pdf"
    GitHub: "",     // e.g. "https://github.com/username"
    LinkedIn: "",
    Dribbble: ""
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Header border on scroll
  var header = document.querySelector("[data-header]");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.querySelector("[data-menu]");
  var nav = document.getElementById("nav");
  function setMenu(open, focusBack) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
    if (!open && focusBack) menuBtn.focus();
  }
  menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function () { setMenu(false); });

  // Active nav link
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }

  // Project filtering
  var filters = document.querySelectorAll("[data-filter]");
  var projects = document.querySelectorAll("[data-projects] .project");
  var filterStatus = document.querySelector("[data-filter-status]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      var shown = 0;
      projects.forEach(function (p) {
        var cats = p.getAttribute("data-category").split(" ");
        var show = f === "all" || cats.indexOf(f) !== -1;
        p.classList.toggle("is-hidden", !show);
        if (show) shown++;
      });
      filterStatus.textContent = "Showing " + shown + " project" + (shown === 1 ? "" : "s") + ".";
    });
  });

  // Case summary dialog
  var dialog = document.querySelector("[data-case-dialog]");
  var body = dialog.querySelector("[data-case-body]");
  var lastTrigger = null;
  document.querySelectorAll("[data-case]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tpl = document.getElementById(btn.getAttribute("data-case"));
      if (!tpl) return;
      body.innerHTML = "";
      body.appendChild(tpl.content.cloneNode(true));
      var h = body.querySelector("h2");
      if (h) h.id = "case-dialog-title";
      lastTrigger = btn;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  });
  function closeDialog() { if (dialog.open) dialog.close(); }
  dialog.querySelector("[data-close]").addEventListener("click", closeDialog);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
  dialog.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });

  // Demo links → toast
  var toast = document.querySelector("[data-toast]");
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 3800);
  }
  document.querySelectorAll("[data-demo-link]").forEach(function (a) {
    var key = a.getAttribute("data-demo-link");
    if (LINKS[key]) { a.setAttribute("href", LINKS[key]); return; }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Concept demo: in a live portfolio this " + (key === "email" ? "opens an email to the owner." : key === "cv" ? "downloads the CV." : "opens the " + key + " profile."));
    });
  });

  // Reveal on scroll
  var revealTargets = document.querySelectorAll(".section h2, .project, .timeline li, .plain-list li, .skill-col");
  if (!reduce && "IntersectionObserver" in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); rio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    revealTargets.forEach(function (el) { el.classList.add("reveal"); rio.observe(el); });
  }
})();
