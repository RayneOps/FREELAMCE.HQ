/* Ivory & Oak — concept salon website script.
   ------------------------------------------------------------------
   REUSING FOR A REAL BUSINESS: fill in BUSINESS below. With a WhatsApp
   number set, booking requests open WhatsApp with the details filled in.
   With a phone number set, "Call" links dial it directly. */
(function () {
  "use strict";

  var BUSINESS = {
    phone: "",            // e.g. "+2348012345678"  (shown + dialled)
    phoneDisplay: "",     // e.g. "+234 801 234 5678"
    whatsapp: "",         // digits only, e.g. "2348012345678"
    mapsUrl: "",          // e.g. a Google Maps share link
    timeZone: "Africa/Lagos",
    // Opening hours: 0 = Sunday … 6 = Saturday, [open, close] in 24h, null = closed
    hours: { 0: [12, 17], 1: null, 2: [9, 18], 3: [9, 18], 4: [9, 20], 5: [9, 20], 6: [8, 18] }
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Toast
  var toast = document.querySelector("[data-toast]"), tt;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add("is-visible");
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("is-visible"); }, 4200);
  }

  // Header + menu
  var header = document.querySelector("[data-header]");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var menuBtn = document.querySelector("[data-menu]"), nav = document.getElementById("nav");
  function setMenu(open, back) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".sr-only").textContent = open ? "Close menu" : "Menu";
    nav.classList.toggle("is-open", open);
    if (!open && back) menuBtn.focus();
  }
  menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true); });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", function () { setMenu(false); });

  // Phone links: real number if configured, otherwise explain the sample
  document.querySelectorAll("[data-sample-call]").forEach(function (a) {
    if (BUSINESS.phone) {
      a.href = "tel:" + BUSINESS.phone.replace(/[^\d+]/g, "");
      if (/^\+?[\d\s]+$/.test(a.textContent.trim())) a.textContent = BUSINESS.phoneDisplay || BUSINESS.phone;
      return;
    }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Sample number — on a live site this button calls the studio directly.");
    });
  });
  document.querySelectorAll("[data-demo-directions]").forEach(function (a) {
    if (BUSINESS.mapsUrl) { a.href = BUSINESS.mapsUrl; a.target = "_blank"; a.rel = "noopener"; return; }
    a.addEventListener("click", function (e) { e.preventDefault(); showToast("Sample address — a live site links to the studio on Google Maps."); });
  });

  // Opening hours: highlight today + open/closed status in the studio's time zone
  function studioNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: BUSINESS.timeZone, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
      var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], mins: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date(); return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function fmt(h) { return (h < 10 ? "0" : "") + h + ":00"; }
  function updateHours() {
    var now = studioNow();
    var today = BUSINESS.hours[now.day];
    document.querySelectorAll("[data-hours] tr").forEach(function (tr) {
      tr.classList.toggle("is-today", Number(tr.getAttribute("data-day")) === now.day);
    });
    var chip = document.querySelector("[data-open-status]");
    var todayEl = document.querySelector("[data-today-hours]");
    var open = today && now.mins >= today[0] * 60 && now.mins < today[1] * 60;
    if (todayEl) todayEl.textContent = today ? fmt(today[0]) + " – " + fmt(today[1]) : "Closed today";
    if (!chip) return;
    chip.classList.toggle("is-open", !!open);
    chip.classList.toggle("is-closed", !open);
    if (open) {
      chip.textContent = "Open now · until " + fmt(today[1]);
    } else {
      // find next opening
      for (var i = 0; i < 8; i++) {
        var d = (now.day + i) % 7, h = BUSINESS.hours[d];
        if (h && (i > 0 || now.mins < h[0] * 60)) {
          var label = i === 0 ? "today" : i === 1 ? "tomorrow" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];
          chip.textContent = "Closed now · opens " + label + " at " + fmt(h[0]);
          break;
        }
      }
    }
  }
  updateHours();
  setInterval(updateHours, 60000);

  // Gallery lightbox
  var lb = document.querySelector("[data-lightbox]");
  var lbImg = lb.querySelector("[data-lb-img]"), lbCap = lb.querySelector("[data-lb-caption]");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery] button"));
  var current = 0, opener = null;
  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = img.alt + " (" + (current + 1) + " of " + items.length + ")";
  }
  items.forEach(function (btn, i) {
    btn.setAttribute("aria-label", "Open image " + (i + 1) + ": " + btn.querySelector("img").alt);
    btn.addEventListener("click", function () {
      opener = btn; show(i);
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    });
  });
  lb.querySelector("[data-lb-close]").addEventListener("click", function () { lb.close(); });
  lb.querySelector("[data-lb-prev]").addEventListener("click", function () { show(current - 1); });
  lb.querySelector("[data-lb-next]").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener("close", function () { if (opener) opener.focus(); });

  // Booking request
  var form = document.querySelector("[data-booking]");
  var result = document.querySelector("[data-booking-result]");
  var dateInput = document.getElementById("b-date");
  var t = new Date(); dateInput.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  if (BUSINESS.whatsapp) {
    var modeNote = document.querySelector("[data-booking-mode]");
    if (modeNote) modeNote.textContent = "Your request opens in WhatsApp, ready to send to the studio.";
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var required = form.querySelectorAll("[required]"), firstBad = null;
    required.forEach(function (f) {
      var ok = f.value.trim() !== "" && f.checkValidity();
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstBad) firstBad = f;
    });
    if (firstBad) {
      result.innerHTML = '<p class="err">Please complete the highlighted fields.</p>';
      firstBad.focus();
      return;
    }
    var data = new FormData(form);
    var dateStr = new Date(data.get("date") + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    var lines = [
      "Booking request — Ivory & Oak",
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone"),
      "Service: " + data.get("service"),
      "Preferred: " + dateStr + ", " + data.get("time")
    ];
    if (data.get("notes")) lines.push("Notes: " + data.get("notes"));

    if (BUSINESS.whatsapp) {
      window.open("https://wa.me/" + BUSINESS.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      result.innerHTML = '<div class="summary"><h3>Almost done</h3><p>WhatsApp has opened with your request. Press send and the studio will confirm your appointment.</p></div>';
      return;
    }
    result.innerHTML =
      '<div class="summary"><h3>Request preview</h3><dl>' +
      "<dt>Service</dt><dd>" + esc(data.get("service")) + "</dd>" +
      "<dt>When</dt><dd>" + esc(dateStr) + ", " + esc(data.get("time")) + "</dd>" +
      "<dt>Name</dt><dd>" + esc(data.get("name")) + "</dd></dl>" +
      "<p><strong>Concept demo:</strong> nothing has been sent or stored. On a live site this request would go to the studio’s WhatsApp or email for confirmation.</p></div>";
  });
  form.querySelectorAll("[required]").forEach(function (f) {
    f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true" && f.value.trim()) f.setAttribute("aria-invalid", "false"); });
    f.addEventListener("change", function () { if (f.getAttribute("aria-invalid") === "true" && f.value.trim()) f.setAttribute("aria-invalid", "false"); });
  });

  // Reveal
  var targets = document.querySelectorAll(".section-head, .menu-col, .gallery li, .why li, .team li, .hours-card, .map-card, .about-copy");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
