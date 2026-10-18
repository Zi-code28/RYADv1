var ICONS = {
  polo: '<path d="M30 20 L42 14 Q50 22 58 14 L70 20 L84 34 L74 44 L68 38 L68 84 L32 84 L32 38 L26 44 L16 34 Z" fill="currentColor"/>',
  zapatilla: '<path d="M8 62 L8 48 Q30 50 40 34 L52 42 Q62 50 74 50 Q92 50 94 62 L94 72 L8 72 Z" fill="currentColor"/><path d="M8 72 H94" stroke="var(--bg)" stroke-width="3"/>',
  gorra: '<path d="M18 60 Q18 28 50 28 Q82 28 82 60 Z" fill="currentColor"/><path d="M14 64 H94 V71 H14 Z" fill="currentColor"/>',
  cartera: '<path d="M26 40 H74 L80 84 H20 Z" fill="currentColor"/><path d="M38 40 V30 Q38 18 50 18 Q62 18 62 30 V40" fill="none" stroke="currentColor" stroke-width="5"/>',
  vestido: '<path d="M40 14 H60 L58 36 L76 88 H24 L42 36 Z" fill="currentColor"/>',
  lentes: '<circle cx="30" cy="52" r="17" fill="currentColor"/><circle cx="70" cy="52" r="17" fill="currentColor"/><path d="M47 50 H53" stroke="currentColor" stroke-width="5"/>',
  casaca: '<path d="M32 14 L44 12 L50 22 L56 12 L68 14 L88 34 L80 52 L72 46 L72 88 H28 V46 L20 52 L12 34 Z" fill="currentColor"/>',
  reloj: '<rect x="36" y="30" width="28" height="40" rx="8" fill="currentColor"/><path d="M40 8 H60 V30 H40 Z M40 70 H60 V92 H40 Z" fill="currentColor" opacity="0.6"/>'
};
var DATA = window.CATALOG;
var PRODUCTS = DATA.products;
var CATS = ["All", "Zapatillas", "Ropa", "Accesorios", "Sunglasses"];
var WHO = ["All", "Men's", "Women's", "Kid's"];
var WHO_KEY = { "Men's": "men", "Women's": "women", "Kid's": "kids" };
var CAT_ICON = { Zapatillas: "zapatilla", Ropa: "polo", Accesorios: "gorra", Sunglasses: "lentes" };
var state = { who: "All", cat: "All", q: "" };
var who = document.getElementById("who"), chips = document.getElementById("chips"), grid = document.getElementById("grid"), count = document.getElementById("count"), q = document.getElementById("q");

function esc(s) { return String(s).replace(/[&<>"]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); }
function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

function drawChips() {
  chips.innerHTML = WHO.map(function (c) {
    return '<button type="button" class="chip" data-who="' + c + '" aria-pressed="' + (state.who === c) + '">' + c + '</button>';
  }).join("");
}

function imgsOf(p) { return p.imgs || (p.img ? [p.img] : []); }

function render() {
  var term = norm(state.q.trim());
  chips.hidden = state.cat === "Sunglasses";
  var list = [];
  PRODUCTS.forEach(function (p, ix) {
    if ((state.who === "All" || state.cat === "Sunglasses" || p.w === WHO_KEY[state.who] || p.w === "unisex") && (state.cat === "All" || p.c === state.cat) && (!term || norm(p.n + " " + (p.d || "") + " " + (p.k || "")).indexOf(term) > -1)) list.push({ p: p, ix: ix });
  });
  count.textContent = list.length + (list.length === 1 ? " producto" : " productos");
  if (!list.length) {
    grid.innerHTML = !term
      ? '<p class="empty">Estamos preparando esta sección. Pronto verás productos aquí.</p>'
      : '<p class="empty">No hay productos con esa búsqueda. Prueba con otra palabra o elige otra categoría.</p>';
    return;
  }
  grid.innerHTML = list.map(function (o) {
    var p = o.p, im = imgsOf(p);
    var pic = im.length ? '<img class="main" src="' + im[0] + '" alt="' + esc(p.n) + '">' : '<svg viewBox="0 0 100 100" aria-hidden="true">' + (ICONS[p.i] || ICONS.polo) + '</svg><span class="pending">Foto por confirmar</span>';
    var thumbs = im.length > 1 ? '<div class="thumbs">' + im.map(function (s, i) {
      return '<button type="button" class="thumb" aria-label="Ver foto ' + (i + 1) + '" aria-pressed="' + (i === 0) + '"><img src="' + s + '" alt=""></button>';
    }).join("") + '</div>' : '';
    var rows = (p.t ? '<div><dt>Tallas</dt><dd>' + esc(p.t) + '</dd></div>' : '') + (p.k ? '<div><dt>Color</dt><dd>' + esc(p.k) + '</dd></div>' : '');
    return '<article class="card">' +
      '<div class="photo' + (im.length ? ' has-img' : '') + '" style="--h:' + (p.h || 120) + '">' + (p.tag ? '<span class="tag">' + esc(p.tag) + '</span>' : '') + pic + '</div>' + thumbs +
      '<div class="meta"><h2 class="name">' + esc(p.n) + '</h2><span class="price">' + (p.p ? 'S/ ' + p.p : 'Consultar precio') + '</span></div>' +
      (p.d ? '<p class="desc">' + esc(p.d) + '</p>' : '') +
      (rows ? '<dl class="opts">' + rows + '</dl>' : '') +
      '</article>';
  }).join("");
}

grid.addEventListener("click", function (e) {
  var b = e.target.closest(".thumb");
  if (!b) return;
  var card = b.closest(".card");
  card.querySelector(".main").src = b.querySelector("img").src;
  card.querySelectorAll(".thumb").forEach(function (t) { t.setAttribute("aria-pressed", String(t === b)); });
});

function drawWho() {
  who.innerHTML = CATS.map(function (w) {
    return '<button type="button" data-cat="' + w + '" aria-pressed="' + (state.cat === w) + '">' + w + '</button>';
  }).join("");
}

who.addEventListener("click", function (e) {
  var b = e.target.closest("button[data-cat]");
  if (!b) return;
  state.cat = b.getAttribute("data-cat");
  drawWho(); render();
});

chips.addEventListener("click", function (e) {
  var b = e.target.closest("button[data-who]");
  if (!b) return;
  state.who = b.getAttribute("data-who");
  drawChips(); render();
});

q.addEventListener("input", function () { state.q = q.value; render(); });

drawWho(); drawChips(); render();