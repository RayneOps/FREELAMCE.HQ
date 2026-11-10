/* LATTICE 2027 — concept event script.
   REUSE: set REGISTRATION_URL to the organiser's ticketing page and the
   countdown target in index.html (data-target) to the real start time. */
(function () {
  "use strict";
  var REGISTRATION_URL = "";
  var PARTNER_PACK_URL = "";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var header = document.querySelector("[data-header]");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Menu
  var btn = document.querySelector("[data-menu]"), nav = document.getElementById("nav");
  function setMenu(open, back) {
    btn.setAttribute("aria-expanded", String(open)); btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open); if (!open && back) btn.focus();
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true); });
  window.matchMedia("(min-width: 1061px)").addEventListener("change", function () { setMenu(false); });

  // Countdown
  var cd = document.querySelector("[data-countdown]");
  if (cd) {
    var target = new Date(cd.getAttribute("data-target")).getTime();
    var units = {};
    cd.querySelectorAll("[data-unit]").forEach(function (el) { units[el.getAttribute("data-unit")] = el; });
    var label = document.getElementById("cd-label");
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
      units.days.textContent = d;
      units.hours.textContent = String(h).padStart(2, "0");
      units.minutes.textContent = String(m).padStart(2, "0");
      units.seconds.textContent = String(s).padStart(2, "0");
      cd.setAttribute("aria-label", d + " days, " + h + " hours and " + m + " minutes until doors open");
      if (diff === 0) { label.textContent = "The event has started"; clearInterval(timer); }
    };
    tick();
    var timer = setInterval(tick, 1000);
  }

  // Schedule: day tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.day-tabs [role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
    applyTrack();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  // Schedule: track filter
  var currentTrack = "all";
  var trackBtns = document.querySelectorAll("[data-track]:not(li)");
  var status = document.querySelector("[data-sched-status]");
  function applyTrack() {
    var shown = 0;
    document.querySelectorAll('[role="tabpanel"]:not([hidden]) .agenda li').forEach(function (li) {
      var t = li.getAttribute("data-track");
      var show = currentTrack === "all" || t === "all" || t === currentTrack;
      li.classList.toggle("is-dim", !show);
      if (show) shown++;
    });
    if (status) status.textContent = shown + " sessions shown.";
  }
  trackBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      currentTrack = b.getAttribute("data-track");
      trackBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      applyTrack();
    });
  });

  // Registration (demo dialog unless a URL is configured)
  var dlg = document.querySelector("[data-reg-dialog]"), typeEl = dlg.querySelector("[data-reg-type]"), opener;
  document.querySelectorAll("[data-register]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (REGISTRATION_URL) { window.location.href = REGISTRATION_URL; return; }
      opener = b; typeEl.textContent = b.getAttribute("data-register");
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  dlg.querySelector("[data-reg-close]").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { if (opener) opener.focus(); });

  // Partner pack link
  var toast = document.querySelector("[data-toast]"), tt;
  var pp = document.querySelector("[data-demo-partner]");
  if (pp) {
    if (PARTNER_PACK_URL) pp.href = PARTNER_PACK_URL;
    else pp.addEventListener("click", function (e) {
      e.preventDefault();
      toast.textContent = "Concept demo: on a live site this downloads the partner pack (PDF).";
      toast.classList.add("is-visible"); clearTimeout(tt);
      tt = setTimeout(function () { toast.classList.remove("is-visible"); }, 4000);
    });
  }

  // Reveal
  var targets = document.querySelectorAll(".highlights li, .speaker, .ticket, .sec-head, .about-copy, .venue-art");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
