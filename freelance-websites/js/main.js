/* Usman — Web Design & Development · main script
   Small, dependency-free enhancements. The page is fully readable without JS. */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  var mobileQuery = window.matchMedia("(max-width: 980px)");

  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
    nav.classList.toggle("is-open", open);
    if (open) {
      var first = nav.querySelector("a");
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && mobileQuery.matches) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true);
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    mobileQuery.addEventListener("change", function () { setMenu(false); });
  }

  /* ---------- Highlight current section in nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ("IntersectionObserver" in window && navLinks.length) {
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contact links from config ---------- */
  function clean(v) { return typeof v === "string" ? v.trim() : ""; }
  var email = clean(config.email);
  var whatsapp = clean(config.whatsapp).replace(/\D/g, "");
  var links = {
    email: email ? "mailto:" + email : "",
    whatsapp: whatsapp ? "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent("Hi Usman, I'd like to talk about a website.") : "",
    linkedin: clean(config.linkedin),
    github: clean(config.github)
  };
  document.querySelectorAll("[data-contact]").forEach(function (a) {
    var key = a.getAttribute("data-contact");
    var href = links[key];
    var item = a.closest("[data-contact-item]");
    if (!href) return;
    a.setAttribute("href", href);
    a.hidden = false;
    if (item) item.hidden = false;
    var label = a.querySelector("[data-contact-label]");
    if (label && key === "email") label.textContent = email;
  });

  /* ---------- "Request a quote" pre-selects website type ---------- */
  var typeSelect = document.getElementById("f-type");
  document.querySelectorAll("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!typeSelect) return;
      var wanted = a.getAttribute("data-service");
      Array.prototype.forEach.call(typeSelect.options, function (opt) {
        if (opt.value === wanted || opt.text === wanted) typeSelect.value = opt.value || opt.text;
      });
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;
  var status = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector('[type="submit"]');

  function setStatus(html, kind) {
    status.className = "form-status" + (kind ? " is-" + kind : "");
    status.innerHTML = html;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var requiredFields = ["f-name", "f-email", "f-type", "f-message"];
  function validateField(input) {
    var err = document.getElementById(input.id + "-err");
    var ok = input.checkValidity() && input.value.trim() !== "";
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) {
      err.hidden = ok;
      if (!ok) input.setAttribute("aria-describedby", err.id);
      else input.removeAttribute("aria-describedby");
    }
    return ok;
  }
  requiredFields.forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("blur", function () { if (input.value) validateField(input); });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
    input.addEventListener("change", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
  });

  function buildMessage(data) {
    return [
      "Name: " + data.name,
      "Email: " + data.email,
      "Website type: " + data.website_type,
      "Budget: " + (data.budget || "Not specified"),
      "Timeline: " + (data.timeline || "Not specified"),
      "",
      "Project description:",
      data.message
    ].join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstInvalid = null;
    requiredFields.forEach(function (id) {
      var input = document.getElementById(id);
      if (input && !validateField(input) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      setStatus("Please complete the highlighted fields.", "error");
      firstInvalid.focus();
      return;
    }

    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = String(v).trim(); });
    var body = buildMessage(data);
    var endpoint = clean(config.formEndpoint);

    // 1) Configured form endpoint (e.g. Formspree)
    if (endpoint) {
      submitBtn.disabled = true;
      setStatus("Sending your enquiry…");
      fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          form.reset();
          setStatus("Thank you — your enquiry has been sent. I’ll reply by email as soon as I can.", "success");
        })
        .catch(function () {
          var alt = email ? ' Please email me directly at <a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + "</a>." : "";
          setStatus("Sorry, your enquiry couldn’t be sent just now." + alt, "error");
        })
        .finally(function () { submitBtn.disabled = false; });
      return;
    }

    // 2) Email fallback — opens the visitor's own email app
    if (email) {
      var subject = (clean(config.emailSubject) || "Website enquiry") + " — " + data.website_type;
      var href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      window.location.href = href;
      setStatus(
        "Your email app should now open with your enquiry filled in — just press send. " +
        'If nothing opened, email me directly at <a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + "</a>.",
        "success"
      );
      return;
    }

    // 3) WhatsApp fallback
    if (whatsapp) {
      window.open("https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(body), "_blank", "noopener");
      setStatus("WhatsApp should open in a new tab with your enquiry ready to send.", "success");
      return;
    }

    // 4) Nothing configured — never pretend the message was sent
    setStatus("Sorry — this form isn’t connected yet, so your message has not been sent. Please try again later.", "error");
    if (window.console) console.warn("[contact form] Set email, whatsapp or formEndpoint in js/config.js.");
  });
})();
