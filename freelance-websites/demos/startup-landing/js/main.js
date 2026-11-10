/* Tidewell — concept landing page script.
   SIGNUP_ENDPOINT: when reusing for a real product, set this to your email
   platform / form endpoint (must accept POST and return 2xx). While empty,
   the form validates input but sends nothing and says so clearly. */
(function () {
  "use strict";
  var SIGNUP_ENDPOINT = "";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Header
  var header = document.querySelector("[data-header]");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 4); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Mobile nav
  var burger = document.querySelector("[data-burger]");
  var nav = document.getElementById("nav");
  function setNav(open, focusBack) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    if (!open && focusBack) burger.focus();
  }
  burger.addEventListener("click", function () { setNav(burger.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false, true); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function () { setNav(false); });

  // Product preview tabs (WAI-ARIA tabs pattern)
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") n = tabs[0];
      if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  // Pricing toggle
  var billingBtns = document.querySelectorAll("[data-billing]");
  var note = document.querySelector("[data-billing-note]");
  billingBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.getAttribute("data-billing");
      billingBtns.forEach(function (b) { var on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
      document.querySelectorAll("[data-monthly]").forEach(function (el) { el.textContent = el.getAttribute("data-" + mode); });
      if (note) note.textContent = mode === "annual" ? "Billed annually ($76.80 per member / year)" : "Billed monthly";
    });
  });

  // Toast + demo links
  var toast = document.querySelector("[data-toast]"), tt;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add("is-visible");
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("is-visible"); }, 4200);
  }
  document.querySelectorAll("[data-demo]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Concept demo: “" + a.getAttribute("data-demo") + "” would open a real page in a live product site.");
    });
  });

  // Signup forms
  document.querySelectorAll("[data-signup]").forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var msg = form.querySelector(".signup-msg");
    input.addEventListener("input", function () { input.removeAttribute("aria-invalid"); msg.textContent = ""; msg.className = "signup-msg"; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!input.value.trim() || !input.checkValidity()) {
        input.setAttribute("aria-invalid", "true");
        msg.className = "signup-msg is-error";
        msg.textContent = "Please enter a valid work email address.";
        input.focus();
        return;
      }
      if (SIGNUP_ENDPOINT) {
        var btn = form.querySelector("button");
        btn.disabled = true;
        fetch(SIGNUP_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw 0; form.reset(); msg.className = "signup-msg is-ok"; msg.textContent = "Thanks — you’re on the list. We’ll be in touch soon."; })
          .catch(function () { msg.className = "signup-msg is-error"; msg.textContent = "Something went wrong. Please try again."; })
          .finally(function () { btn.disabled = false; });
        return;
      }
      msg.className = "signup-msg is-ok";
      msg.textContent = "Concept demo: your email was not sent or stored. On a live site this connects to the product’s sign-up list.";
      input.value = "";
    });
  });

  // Reveal on scroll
  var targets = document.querySelectorAll(".problems article, .feature, .steps li, .use, .plan, .head-center, .head-split");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
