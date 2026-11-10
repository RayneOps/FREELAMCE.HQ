/* Oyela Botanics — concept product showcase script.
   ------------------------------------------------------------------
   REUSE FOR A REAL BRAND
   1. Set WHATSAPP_NUMBER (digits only, international format, e.g. "2348012345678").
      While it is empty, the order button shows a preview instead of sending.
   2. Edit PRODUCTS below — the id must match data-id / data-add / data-details
      in index.html. Prices are whole naira. */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "";
  var BRAND = "Oyela Botanics";

  var PRODUCTS = {
    "shea-cloud-cream": { name: "Shea Cloud Face Cream", cat: "Face · 50 ml", price: 12500, img: "assets/img/shea-cloud-cream.svg",
      desc: "A light, whipped daily moisturiser that melts into the skin without feeling greasy. Ideal for normal to dry skin, morning and night.",
      ing: "Unrefined shea butter, squalane, aloe vera, vitamin E.", use: "Massage a pea-sized amount into clean skin, morning and evening." },
    "hibiscus-serum": { name: "Hibiscus Glow Serum", cat: "Face · 30 ml", price: 15000, img: "assets/img/hibiscus-serum.svg",
      desc: "A water-light serum that helps even out tone and boosts radiance, with a gentle hibiscus extract.",
      ing: "Hibiscus flower extract, niacinamide, glycerin, hyaluronic acid.", use: "Apply 3–4 drops after cleansing, before moisturiser." },
    "baobab-cleanser": { name: "Baobab Gentle Cleanser", cat: "Face · 150 ml", price: 9500, img: "assets/img/baobab-cleanser.svg",
      desc: "A creamy, low-foam cleanser that removes the day without leaving skin tight.",
      ing: "Baobab oil, oat extract, coco glucoside, chamomile.", use: "Massage onto damp skin for 30 seconds, then rinse with warm water." },
    "whipped-body-butter": { name: "Whipped Shea Body Butter", cat: "Body · 200 g", price: 11000, img: "assets/img/whipped-body-butter.svg",
      desc: "Our signature butter: rich, airy and deeply nourishing. A little goes a long way.",
      ing: "Unrefined shea butter, coconut oil, cocoa butter, sweet almond oil.", use: "Warm between palms and apply to damp skin after bathing." },
    "black-soap": { name: "Black Soap Bar", cat: "Body · 120 g", price: 4500, img: "assets/img/black-soap.svg",
      desc: "A traditional black soap, balanced with shea for an effective but gentle everyday cleanse.",
      ing: "Plantain skin ash, palm kernel oil, shea butter, cocoa pod ash.", use: "Lather in wet hands, apply, then rinse. Keep dry between uses." },
    "moringa-body-oil": { name: "Moringa Body Oil", cat: "Body · 100 ml", price: 13500, img: "assets/img/moringa-body-oil.svg",
      desc: "A silky dry oil that absorbs quickly and leaves a soft, healthy sheen.",
      ing: "Moringa seed oil, jojoba oil, sunflower oil, vitamin E.", use: "Apply to damp skin, or add a few drops to your body butter." },
    "chebe-hair-butter": { name: "Chebe Hair Butter", cat: "Hair · 150 g", price: 10000, img: "assets/img/chebe-hair-butter.svg",
      desc: "A sealing butter for length retention and soft, defined ends.",
      ing: "Chebe powder, shea butter, mango butter, castor oil.", use: "Apply to the lengths and ends of damp hair after moisturising." },
    "rosemary-scalp-oil": { name: "Rosemary Scalp Oil", cat: "Hair · 50 ml", price: 8500, img: "assets/img/rosemary-scalp-oil.svg",
      desc: "A lightweight scalp oil with a fresh, cooling feel.",
      ing: "Rosemary leaf oil, peppermint oil, jojoba oil, grapeseed oil.", use: "Massage a few drops into the scalp 2–3 times a week." },
    "ritual-set": { name: "The Ritual Set", cat: "Gift set · 3 items", price: 38000, img: "assets/img/ritual-set.svg",
      desc: "Our full evening routine in a ribboned gift box: Baobab Gentle Cleanser, Hibiscus Glow Serum and Shea Cloud Face Cream.",
      ing: "See individual products.", use: "Cleanse, apply serum, then seal with the face cream." }
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var naira = function (n) { return "₦" + n.toLocaleString("en-NG"); };
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Toast
  var toast = document.querySelector("[data-toast]"), tt;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add("is-visible");
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("is-visible"); }, 3200);
  }

  // Header + menu
  var header = document.querySelector("[data-header]");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var menu = document.querySelector("[data-menu]"), nav = document.getElementById("nav");
  function setMenu(open, back) {
    menu.setAttribute("aria-expanded", String(open)); menu.textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open); if (!open && back) menu.focus();
  }
  menu.addEventListener("click", function () { setMenu(menu.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true); });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", function () { setMenu(false); });

  // Filtering
  var filterBtns = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-products] .product");
  var shopStatus = document.querySelector("[data-shop-status]");
  function applyFilter(f) {
    var n = 0;
    filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f)); });
    items.forEach(function (li) {
      var show = f === "all" || li.getAttribute("data-category") === f;
      li.classList.toggle("is-hidden", !show); if (show) n++;
    });
    shopStatus.textContent = n + " product" + (n === 1 ? "" : "s") + " shown.";
  }
  filterBtns.forEach(function (b) { b.addEventListener("click", function () { applyFilter(b.getAttribute("data-filter")); }); });
  document.querySelectorAll("[data-jump]").forEach(function (a) {
    a.addEventListener("click", function () { applyFilter(a.getAttribute("data-jump")); });
  });

  // Order list state (kept in memory only — nothing is stored or sent)
  var bag = {};
  var countEl = document.querySelector("[data-bag-count]");
  function bagCount() { return Object.keys(bag).reduce(function (s, k) { return s + bag[k]; }, 0); }
  function addToBag(id, qty) {
    bag[id] = (bag[id] || 0) + (qty || 1);
    renderBag();
    countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump");
    showToast(PRODUCTS[id].name + " added to your order list.");
  }
  document.querySelectorAll("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () { addToBag(b.getAttribute("data-add"), 1); });
  });

  // Product details dialog
  var pd = document.querySelector("[data-product-dialog]");
  var pdQty = 1, pdId = null, pdOpener = null;
  var qtyOut = pd.querySelector("[data-qty]");
  function openDetails(id, opener) {
    var p = PRODUCTS[id]; if (!p) return;
    pdId = id; pdQty = 1; qtyOut.textContent = "1"; pdOpener = opener;
    pd.querySelector("[data-pd-img]").src = p.img;
    pd.querySelector("[data-pd-img]").alt = "Illustration of " + p.name;
    pd.querySelector("[data-pd-cat]").textContent = p.cat;
    pd.querySelector("[data-pd-name]").textContent = p.name;
    pd.querySelector("[data-pd-price]").textContent = naira(p.price);
    pd.querySelector("[data-pd-desc]").textContent = p.desc;
    pd.querySelector("[data-pd-ingredients]").textContent = p.ing;
    pd.querySelector("[data-pd-use]").textContent = p.use;
    if (pd.showModal) pd.showModal(); else pd.setAttribute("open", "");
  }
  document.querySelectorAll("[data-details]").forEach(function (b) {
    b.addEventListener("click", function () { openDetails(b.getAttribute("data-details"), b); });
  });
  pd.querySelector("[data-qty-dec]").addEventListener("click", function () { pdQty = Math.max(1, pdQty - 1); qtyOut.textContent = pdQty; });
  pd.querySelector("[data-qty-inc]").addEventListener("click", function () { pdQty = Math.min(20, pdQty + 1); qtyOut.textContent = pdQty; });
  pd.querySelector("[data-pd-add]").addEventListener("click", function () { addToBag(pdId, pdQty); pd.close(); });
  pd.querySelector("[data-pd-close]").addEventListener("click", function () { pd.close(); });
  pd.addEventListener("click", function (e) { if (e.target === pd) pd.close(); });
  pd.addEventListener("close", function () { if (pdOpener) { var target = pdOpener.classList.contains("p-img") ? pdOpener.closest(".product").querySelector(".link") : pdOpener; if (target) target.focus(); } });

  // Bag drawer
  var bagDlg = document.querySelector("[data-bag]");
  var list = bagDlg.querySelector("[data-bag-items]");
  var empty = bagDlg.querySelector("[data-bag-empty]");
  var foot = bagDlg.querySelector("[data-bag-foot]");
  var totalEl = bagDlg.querySelector("[data-bag-total]");
  var preview = bagDlg.querySelector("[data-preview]");
  var previewText = bagDlg.querySelector("[data-preview-text]");
  var bagOpener = document.querySelector("[data-open-bag]");

  function renderBag() {
    var ids = Object.keys(bag);
    countEl.textContent = bagCount();
    list.innerHTML = "";
    var total = 0;
    ids.forEach(function (id) {
      var p = PRODUCTS[id], q = bag[id]; total += p.price * q;
      var li = document.createElement("li");
      li.innerHTML =
        '<img src="' + p.img + '" alt="" width="64" height="64">' +
        "<div><h3></h3><p class=\"line-price\"></p><button type=\"button\" class=\"remove\">Remove</button></div>" +
        '<div class="qty" role="group"><button type="button" data-d aria-label="Decrease">−</button><output aria-live="polite"></output><button type="button" data-i aria-label="Increase">+</button></div>';
      li.querySelector("h3").textContent = p.name;
      li.querySelector(".line-price").textContent = q + " × " + naira(p.price);
      li.querySelector("output").textContent = q;
      li.querySelector(".qty").setAttribute("aria-label", "Quantity of " + p.name);
      li.querySelector(".remove").setAttribute("aria-label", "Remove " + p.name);
      li.querySelector("[data-d]").addEventListener("click", function () { bag[id]--; if (bag[id] <= 0) delete bag[id]; renderBag(); focusAfterRender(id, "[data-d]"); });
      li.querySelector("[data-i]").addEventListener("click", function () { bag[id] = Math.min(20, bag[id] + 1); renderBag(); focusAfterRender(id, "[data-i]"); });
      li.querySelector(".remove").addEventListener("click", function () { delete bag[id]; renderBag(); bagDlg.querySelector("[data-bag-close]").focus(); });
      li.setAttribute("data-row", id);
      list.appendChild(li);
    });
    totalEl.textContent = naira(total);
    empty.hidden = ids.length > 0;
    foot.hidden = ids.length === 0;
    preview.hidden = true;
  }
  function focusAfterRender(id, sel) {
    var row = list.querySelector('[data-row="' + id + '"]');
    if (row) row.querySelector(sel).focus(); else bagDlg.querySelector("[data-bag-close]").focus();
  }
  function buildMessage() {
    var name = bagDlg.querySelector("[data-bag-name]").value.trim();
    var lines = ["Hello " + BRAND + "! I'd like to order:"], total = 0;
    Object.keys(bag).forEach(function (id) {
      var p = PRODUCTS[id], q = bag[id]; total += p.price * q;
      lines.push("• " + q + " × " + p.name + " (" + naira(p.price * q) + ")");
    });
    lines.push("", "Estimated total: " + naira(total), "Please confirm availability and delivery cost.");
    if (name) lines.push("", "Name: " + name);
    return lines.join("\n");
  }
  bagOpener.addEventListener("click", function () { renderBag(); if (bagDlg.showModal) bagDlg.showModal(); else bagDlg.setAttribute("open", ""); });
  bagDlg.querySelector("[data-bag-close]").addEventListener("click", function () { bagDlg.close(); });
  bagDlg.addEventListener("click", function (e) { if (e.target === bagDlg) bagDlg.close(); });
  bagDlg.addEventListener("close", function () { bagOpener.focus(); });

  bagDlg.querySelector("[data-send]").addEventListener("click", function () {
    var msg = buildMessage();
    if (WHATSAPP_NUMBER) {
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
      return;
    }
    previewText.textContent = msg;
    preview.hidden = false;
    preview.querySelector(".bag-demo").focus && preview.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  });
  bagDlg.querySelector("[data-copy]").addEventListener("click", function () {
    var text = previewText.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast("Message copied to clipboard."); }, function () { showToast("Copy failed — select the text manually."); });
    } else {
      showToast("Copy isn’t supported here — select the text manually.");
    }
  });

  // General chat CTA
  document.querySelectorAll("[data-chat]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (WHATSAPP_NUMBER) window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hello " + BRAND + ", I have a question about your products."), "_blank", "noopener");
      else showToast("Concept demo: on a live site this opens a WhatsApp chat with the brand.");
    });
  });

  // Reveal
  var targets = document.querySelectorAll(".product, .categories li, .order-steps li, .head, .featured-grid");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
