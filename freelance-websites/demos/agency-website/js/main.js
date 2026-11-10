/* Marrow & Field — concept agency script.
   REUSE: set LINKS.consult (e.g. a Calendly URL) and LINKS.email (mailto:)
   to replace the demo notices with real destinations. */
(function () {
  "use strict";
  var LINKS = { consult: "", email: "" };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var header = document.querySelector("[data-header]");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Menu
  var btn = document.querySelector("[data-menu]"), nav = document.getElementById("nav");
  function setMenu(open, back) {
    btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
    if (!open && back) btn.focus();
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true); });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", function () { setMenu(false); });

  // Service tabs (vertical)
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.service-tabs [role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") n = tabs[0];
      if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  // Work filter
  var fbtns = document.querySelectorAll("[data-f]"), works = document.querySelectorAll(".work"), status = document.querySelector("[data-work-status]");
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-f"), n = 0;
      fbtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      works.forEach(function (w) {
        var show = f === "all" || w.getAttribute("data-tags").split(" ").indexOf(f) > -1;
        w.classList.toggle("is-hidden", !show); if (show) n++;
      });
      status.textContent = n + " project" + (n === 1 ? "" : "s") + " shown.";
    });
  });

  // Project dialog
  var dlg = document.querySelector("[data-dialog]"), body = dlg.querySelector("[data-pd-body]"), img = dlg.querySelector("[data-pd-img]"), opener;
  document.querySelectorAll("[data-project]").forEach(function (b) {
    b.addEventListener("click", function () {
      var tpl = document.getElementById(b.getAttribute("data-project"));
      body.innerHTML = ""; body.appendChild(tpl.content.cloneNode(true));
      var h = body.querySelector("h2"); if (h) h.id = "pd-title";
      var src = b.querySelector("img"); img.src = src.src; img.alt = src.alt;
      opener = b;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  dlg.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { if (opener) opener.focus(); });

  // Demo CTAs
  var toast = document.querySelector("[data-toast]"), tt;
  document.querySelectorAll("[data-demo]").forEach(function (a) {
    var key = a.getAttribute("data-demo");
    if (LINKS[key]) { a.href = LINKS[key]; return; }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      toast.textContent = key === "consult"
        ? "Concept demo: on a live site this opens the studio’s booking calendar."
        : "Concept demo: on a live site this opens an email to the studio.";
      toast.classList.add("is-visible");
      clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("is-visible"); }, 4000);
    });
  });

  // Reveal
  var targets = document.querySelectorAll(".sec-head, .intro-statement, .principles li, .phases li, .work, .industry-list li, .team li, .consult h2");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
