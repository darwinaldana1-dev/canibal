/** app.js del sitio generado. Sin dependencias, sin framework. */

export function buildJs() {
  return String.raw`(function () {
'use strict';

/* ============ datos ============ */
var DATA = JSON.parse(document.getElementById('menu-data').textContent);
var ITEMS = DATA.items;
var CFG = DATA.cfg;
var KEY = 'cart:' + location.pathname;

var fmt = new Intl.NumberFormat(CFG.loc, {
  style: 'currency', currency: CFG.cur, maximumFractionDigits: 0
});
function money(n) { return fmt.format(n); }
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

/* ============ nodos fijos ============ */
var drawer = $('#drawer');
var backdrop = $('#backdrop');
var root = $('#modal-root');
var tabsBox = $('#tabs');
var catBlocks = $$('.cat-block');
var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ============ carrito ============ */
var cart = [];
try {
  var saved = JSON.parse(localStorage.getItem(KEY));
  if (Array.isArray(saved)) cart = saved;
} catch (e) { /* storage bloqueado: el carrito vive en memoria */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
}
function subtotal() {
  return cart.reduce(function (a, i) { return a + i.precio * i.cant; }, 0);
}
function count() {
  return cart.reduce(function (a, i) { return a + i.cant; }, 0);
}
function keyOf(it) {
  return [it.id, it.tam || '', (it.ops || []).map(function (o) { return o.n; }).sort().join('|'), it.nota || ''].join('::');
}
function findItem(k) {
  for (var i = 0; i < cart.length; i++) if (cart[i].k === k) return cart[i];
  return null;
}
function addToCart(it) {
  var k = keyOf(it);
  var found = findItem(k);
  if (found) found.cant += it.cant;
  else { it.k = k; cart.push(it); }
  save(); render(); openCart();
}
function setQty(k, q) {
  cart = cart.filter(function (i) { if (i.k !== k) return true; i.cant = q; return q > 0; });
  save(); render();
}

/* ============ pintado del carrito ============ */

function render() {
  var n = count(), sub = subtotal();

  var badge = $('#cart-badge');
  badge.textContent = n; badge.hidden = n === 0;
  $('#drawer-count').textContent = n + (n === 1 ? ' producto' : ' productos');

  var bar = $('#cart-bar');
  bar.hidden = n === 0;
  document.body.classList.toggle('has-cart', n > 0);
  $('#bar-count').textContent = n;
  $('#bar-total').textContent = money(sub);

  var box = $('#drawer-content');
  if (!cart.length) {
    box.innerHTML = '<div class="drawer-empty"><span aria-hidden="true">\u{1F6D2}</span>' +
      '<h3>Tu carrito está vacío</h3><p class="muted">Agrega productos del menú para empezar.</p>' +
      '<button class="btn btn-primary btn-sm" data-go-menu>Ver el menú</button></div>';
    return;
  }

  var list = cart.map(function (i) {
    var ops = (i.ops || []).length
      ? '<ul class="ci-opts">' + i.ops.map(function (o) {
          return '<li>+ ' + esc(o.n) + (o.p > 0 ? ' (' + money(o.p) + ')' : '') + '</li>';
        }).join('') + '</ul>'
      : '';
    var img = i.img
      ? '<img src="' + esc(i.img) + '" alt="" loading="lazy">'
      : esc(i.n.charAt(0));
    return '<article class="ci"><div class="ci-img">' + img + '</div><div class="ci-info">' +
      '<h3 class="ci-name">' + esc(i.n) + (i.tam ? '<em> · ' + esc(i.tam) + '</em>' : '') + '</h3>' + ops +
      (i.nota ? '<p class="ci-note">“' + esc(i.nota) + '”</p>' : '') +
      '<div class="ci-row"><div class="ci-qty">' +
      '<button data-q="' + esc(i.k) + '" data-d="-1" aria-label="Quitar uno">−</button>' +
      '<span>' + i.cant + '</span>' +
      '<button data-q="' + esc(i.k) + '" data-d="1" aria-label="Agregar uno">+</button></div>' +
      '<span class="ci-price">' + money(i.precio * i.cant) + '</span></div>' +
      '<div class="ci-acts"><button class="link-btn" data-note="' + esc(i.k) + '">' +
      (i.nota ? 'Editar nota' : 'Agregar nota') + '</button>' +
      '<button class="link-btn" data-del="' + esc(i.k) + '">Quitar</button></div>' +
      '</div></article>';
  }).join('');

  // fuera de horario el pedido no se puede enviar, pero el carrito se guarda
  var e = estado();
  box.innerHTML = '<div class="drawer-list">' + list +
    '<button class="link-btn" id="clear-cart" style="justify-self:start">Vaciar carrito</button></div>' +
    '<div class="drawer-foot"><div class="total-row"><span>Subtotal</span><b>' + money(sub) + '</b></div>' +
    (e.abierto && CFG.envio > 0 ? '<p class="hint">El domicilio se suma en el siguiente paso.</p>' : '') +
    (e.abierto ? '' : '<p class="cerrado-nota">' + esc(e.corto) + '. Tu pedido queda guardado.</p>') +
    '<button class="btn btn-primary btn-block" id="go-checkout"' + (e.abierto ? '' : ' disabled') + '>' +
    (e.abierto ? 'Continuar con el pedido' : 'Cerrado ahora') + '</button></div>';
}

function lockBody(on) { document.body.style.overflow = on ? 'hidden' : ''; }
function openCart() { drawer.classList.add('open'); backdrop.classList.add('open'); lockBody(true); }
function closeCart() {
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  if (!root.firstChild) lockBody(false);
}

$('#cart-open').addEventListener('click', openCart);
$('#cart-close').addEventListener('click', closeCart);
$('#cart-bar').addEventListener('click', openCart);
backdrop.addEventListener('click', closeCart);

drawer.addEventListener('click', function (e) {
  var t = e.target.closest('button');
  if (!t) return;
  if (t.hasAttribute('data-go-menu')) {
    closeCart();
    var m = document.getElementById('menu');
    if (m) irA(m, 'menu');
    return;
  }
  if (t.id === 'clear-cart') {
    if (window.confirm('¿Vaciar todo el carrito?')) { cart = []; save(); render(); }
    return;
  }
  if (t.id === 'go-checkout') return openCheckout();

  var k = t.getAttribute('data-q');
  if (k) {
    var it = findItem(k);
    if (it) setQty(k, it.cant + Number(t.getAttribute('data-d')));
    return;
  }
  var del = t.getAttribute('data-del');
  if (del) return setQty(del, 0);

  var nk = t.getAttribute('data-note');
  if (nk) {
    var item = findItem(nk);
    if (!item) return;
    var v = window.prompt('Nota para la cocina', item.nota || '');
    if (v !== null) { item.nota = v.trim() || undefined; save(); render(); }
  }
});

/* ============ modal generico ============
 * openModal crea el modal UNA vez (con su animacion de entrada).
 * updateModal cambia solo el contenido: conserva el scroll interno y no
 * repite la animacion. Los eventos se delegan en #modal-root, que nunca
 * se destruye, asi que no se acumulan escuchas con cada redibujo.
 */
var ctrl = null; // { click: fn, input: fn } del modal activo

function openModal(html, controller) {
  ctrl = controller || null;
  root.innerHTML = '<div class="overlay" data-overlay><div class="modal" role="dialog" aria-modal="true">' + html + '</div></div>';
  lockBody(true);
  var first = root.querySelector('[data-close]');
  if (first) first.focus({ preventScroll: true });
}
function updateModal(html) {
  var modal = root.querySelector('.modal');
  if (!modal) return;
  var body = modal.querySelector('.modal-body');
  var y = body ? body.scrollTop : 0;
  var active = document.activeElement;
  var activeKey = active && active.getAttribute ? (active.getAttribute('data-f') || active.id) : null;

  modal.innerHTML = html;

  var nb = modal.querySelector('.modal-body');
  if (nb) nb.scrollTop = y;
  // devuelve el foco al campo que se estaba editando
  if (activeKey) {
    var again = modal.querySelector('[data-f="' + activeKey + '"]') || document.getElementById(activeKey);
    if (again && again.focus) again.focus({ preventScroll: true });
  }
}
function closeModal() {
  ctrl = null;
  root.innerHTML = '';
  if (!drawer.classList.contains('open')) lockBody(false);
}

root.addEventListener('click', function (e) {
  if (e.target.hasAttribute('data-overlay') || e.target.closest('[data-close]')) return closeModal();
  if (ctrl && ctrl.click) ctrl.click(e);
});
root.addEventListener('input', function (e) {
  if (ctrl && ctrl.input) ctrl.input(e);
});
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (root.firstChild) closeModal();
  else if (drawer.classList.contains('open')) closeCart();
});

/* ============ modal de producto ============ */
function openProduct(id) {
  var p = ITEMS[id];
  if (!p) return;
  var tamIdx = 0, cant = 1, nota = '';
  var sel = {};
  (p.g || []).forEach(function (g) {
    var inc = g.o.filter(function (o) { return o.inc; });
    sel[g.id] = inc.length ? inc.slice(0, g.max) : (g.min > 0 ? [g.o[0]] : []);
  });

  function base() { return p.t ? p.t[tamIdx].p : p.p; }
  function fotoActual() { return (p.t && p.t[tamIdx].img) || p.img || ''; }
  function extras() {
    var s = 0;
    Object.keys(sel).forEach(function (k) { sel[k].forEach(function (o) { s += o.p; }); });
    return s;
  }
  function falta() {
    return (p.g || []).filter(function (g) { return (sel[g.id] || []).length < g.min; });
  }

  function html() {
    var unit = base() + extras(), total = unit * cant, f = falta();

    var tamHtml = p.t ? '<section class="group"><h4>Elige el tamaño <span class="pill pill-req">Obligatorio</span></h4>' +
      '<div class="opt-grid">' + p.t.map(function (t, i) {
        return '<button class="opt' + (i === tamIdx ? ' active' : '') + '" data-tam="' + i + '" aria-pressed="' + (i === tamIdx) + '">' +
          '<span class="opt-name">' + esc(t.n) + (t.c ? ' ' + esc(t.c) : '') +
          (t.pr ? '<em>' + t.pr + (t.pr === 1 ? ' persona' : ' personas') + '</em>' : '') + '</span>' +
          '<span class="opt-price">' + money(t.p) + '</span></button>';
      }).join('') + '</div></section>' : '';

    var gruposHtml = (p.g || []).map(function (g) {
      var cur = sel[g.id] || [], lleno = cur.length >= g.max;
      return '<section class="group"><h4>' + esc(g.t) +
        (g.min > 0 ? '<span class="pill pill-req">Obligatorio</span>'
                   : '<span class="pill pill-opt">Opcional · máx ' + g.max + '</span>') +
        (g.max > 1 && cur.length ? '<span class="pill pill-opt">' + cur.length + '/' + g.max + '</span>' : '') + '</h4>' +
        '<div class="opt-grid">' + g.o.map(function (o) {
          var on = cur.some(function (c) { return c.id === o.id; });
          var off = !on && lleno && g.max > 1;
          return '<button class="opt' + (on ? ' active' : '') + '" data-g="' + esc(g.id) +
            '" data-o="' + esc(o.id) + '" aria-pressed="' + on + '"' + (off ? ' disabled' : '') + '>' +
            '<span class="opt-name">' + esc(o.n) + '</span>' +
            '<span class="opt-price">' + (o.p > 0 ? '+' + money(o.p) : 'Incluido') + '</span></button>';
        }).join('') + '</div></section>';
    }).join('');

    // si el tamaño elegido tiene su propia foto, se muestra esa
    var foto = fotoActual();
    var img = foto
      ? '<img src="' + esc(foto) + '" alt="' + esc(p.n) + '">'
      : '<div class="ph" aria-hidden="true">' + esc(p.n.charAt(0)) + '</div>';

    return '<button class="modal-close" data-close aria-label="Cerrar">×</button>' +
      '<div class="modal-hero">' + img + '<div class="modal-grad"></div>' +
      '<div class="modal-hero-info"><h3>' + esc(p.n) + '</h3><b>' + money(base()) + '</b></div></div>' +
      '<div class="modal-body">' +
      (p.d ? '<p class="modal-desc">' + esc(p.d) + '</p>' : '') +
      // "Que lleva": texto largo del producto, si el restaurante lo cargo
      (p.ing ? '<section class="group"><h4>Qué lleva</h4><p class="modal-lleva">' + esc(p.ing).replace(/\n+/g, '</p><p class="modal-lleva">') + '</p></section>' : '') +
      tamHtml + gruposHtml +
      '<section class="group"><h4>Nota para la cocina <span class="pill pill-opt">Opcional</span></h4>' +
      '<textarea class="ta" data-f="nota" rows="2" maxlength="200" placeholder="Ej: sin cebolla, salsa aparte…">' + esc(nota) + '</textarea></section>' +
      '</div>' +
      '<div class="modal-foot"><div class="qty">' +
      '<button data-c="-1" aria-label="Quitar uno">−</button><span aria-live="polite">' + cant + '</span>' +
      '<button data-c="1" aria-label="Agregar uno">+</button></div>' +
      '<button class="btn btn-primary" id="p-add" style="flex:1"' + (f.length ? ' disabled' : '') + '>' +
      (f.length ? 'Elige ' + esc(f[0].t.toLowerCase()) : 'Agregar · ' + money(total)) + '</button></div>';
  }

  openModal(html(), {
    input: function (e) {
      if (e.target.getAttribute('data-f') === 'nota') nota = e.target.value;
    },
    click: function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;

      if (b.hasAttribute('data-tam')) { tamIdx = Number(b.getAttribute('data-tam')); return updateModal(html()); }
      if (b.hasAttribute('data-c')) { cant = Math.max(1, cant + Number(b.getAttribute('data-c'))); return updateModal(html()); }

      var gid = b.getAttribute('data-g');
      if (gid) {
        var g = p.g.filter(function (x) { return x.id === gid; })[0];
        var o = g.o.filter(function (x) { return x.id === b.getAttribute('data-o'); })[0];
        var cur = sel[gid] || [];
        var on = cur.some(function (c) { return c.id === o.id; });
        if (g.max === 1) sel[gid] = (on && g.min === 0) ? [] : [o];
        else if (on) sel[gid] = cur.filter(function (c) { return c.id !== o.id; });
        else if (cur.length < g.max) sel[gid] = cur.concat([o]);
        return updateModal(html());
      }

      if (b.id === 'p-add') {
        if (falta().length) return;
        var ops = [];
        (p.g || []).forEach(function (g) {
          (sel[g.id] || []).forEach(function (o) { ops.push({ n: o.n, p: o.p }); });
        });
        var t = p.t ? p.t[tamIdx] : null;
        closeModal();
        addToCart({
          id: id, n: p.n, img: fotoActual(), precio: base() + extras(), cant: cant,
          tam: t ? (t.n + (t.c ? ' ' + t.c : '')) : undefined,
          ops: ops, nota: nota.trim() || undefined
        });
      }
    }
  });
}

/* ============ clic en tarjetas ============ */
/*
 * Tocar la tarjeta (la foto o el texto) abre la ficha del producto.
 * El boton "+" o "Elegir" va directo a lo suyo: agregar, o pedir las
 * opciones cuando el producto tiene tamaños o adicionales.
 * Va en el documento para que sirva igual en el menu y en los destacados.
 */
function agregarDirecto(id) {
  var p = ITEMS[id];
  if (!p) return;
  if (p.t || p.g) return openProduct(id);
  addToCart({ id: id, n: p.n, img: p.img, precio: p.p, cant: 1, ops: [] });
}

document.addEventListener('click', function (e) {
  var btn = e.target.closest('.card-add');
  if (btn) return agregarDirecto(btn.getAttribute('data-id'));
  var card = e.target.closest('.card');
  if (card && ITEMS[card.getAttribute('data-id')]) openProduct(card.getAttribute('data-id'));
});

// la tarjeta se puede abrir con el teclado
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  var card = e.target.closest && e.target.closest('.card');
  if (!card || e.target.closest('.card-add')) return;
  e.preventDefault();
  if (ITEMS[card.getAttribute('data-id')]) openProduct(card.getAttribute('data-id'));
});

/* ============ busqueda ============ */
var search = $('#search');
if (search) {
  var clearBtn = $('#search-clear');
  var pending = 0;

  var run = function () {
    var q = norm(search.value.trim());
    clearBtn.hidden = !search.value;
    var visibles = 0;

    catBlocks.forEach(function (block) {
      var vis = 0;
      $$('.card', block).forEach(function (card) {
        var p = ITEMS[card.getAttribute('data-id')] || {};
        var hit = !q || norm(p.n + ' ' + (p.d || '')).indexOf(q) !== -1;
        card.hidden = !hit;
        if (hit) vis++;
      });
      block.hidden = vis === 0;
      visibles += vis;
      var tab = tabsBox.querySelector('[data-tab="' + block.id + '"]');
      if (tab) tab.hidden = vis === 0;
    });

    $('#no-results').hidden = visibles > 0;
    // las categorias cambiaron de lugar: recalcula la pestaña activa,
    // y las filas vuelven al inicio para mostrar los resultados
    catBlocks.forEach(function (bl) { var g = bl.querySelector('.grid'); if (g) g.scrollLeft = 0; });
    updateRows();
    requestFrame();
  };
  // agrupa las pulsaciones en un solo cuadro
  search.addEventListener('input', function () {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(run);
  });
  clearBtn.addEventListener('click', function () { search.value = ''; run(); search.focus(); });
  $('#clear-search-2').addEventListener('click', function () { search.value = ''; run(); });
}

/* ============ filas horizontales ============
 * Cada categoria es una fila que se desliza de lado. La clase row-overflow
 * marca las filas que tienen mas productos de los que caben: solo esas
 * muestran las flechas (escritorio) o el aviso "desliza" (celular).
 */
function updateRow(block) {
  var g = block.querySelector('.grid');
  if (!g) return;
  var max = g.scrollWidth - g.clientWidth;
  block.classList.toggle('row-overflow', max > 2);
  var prev = block.querySelector('.row-btn[data-dir="-1"]');
  var next = block.querySelector('.row-btn[data-dir="1"]');
  if (prev) prev.disabled = g.scrollLeft <= 2;
  if (next) next.disabled = g.scrollLeft >= max - 2;
}
function updateRows() { catBlocks.forEach(updateRow); }

catBlocks.forEach(function (block) {
  var g = block.querySelector('.grid');
  if (!g) return;
  var pend = false;
  g.addEventListener('scroll', function () {
    if (pend) return;
    pend = true;
    requestAnimationFrame(function () { pend = false; updateRow(block); });
  }, { passive: true });
});

$('#menu-body').addEventListener('click', function (e) {
  var b = e.target.closest('.row-btn');
  if (!b) return;
  var g = b.closest('.cat-block').querySelector('.grid');
  var card = g.querySelector('.card:not([hidden])');
  if (!card) return;
  // avanza de a tarjetas completas, asi el encaje (snap) queda limpio
  var paso = card.offsetWidth + (parseFloat(getComputedStyle(g).columnGap) || 0);
  var n = Math.max(1, Math.floor(g.clientWidth / paso) - 1);
  g.scrollBy({ left: Number(b.getAttribute('data-dir')) * paso * n, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ============ pestañas ============
 * La pestaña activa se calcula por posicion: es la ultima categoria cuyo
 * borde superior ya quedo a la altura de la barra fija de pestañas.
 *
 * Antes se usaba IntersectionObserver, pero ese API solo entrega los
 * bloques que CAMBIARON de estado, no todos los visibles. Despues de pulsar
 * una pestaña quedaba con informacion vieja y la pestaña activa podia
 * quedarse pegada en la categoria equivocada. Leer la posicion de los
 * bloques en cada cuadro es barato y siempre da la respuesta correcta.
 */
var tabsWrap = tabsBox.parentNode;
var activeId = null;
var spyLocked = false;
var unlockTimer = 0;

/*
 * Mueve SOLO la tira horizontal de pestañas, con una animacion propia.
 *
 * Dos trampas que esto evita:
 *  - tab.scrollIntoView() tambien desplaza el documento e interrumpe el
 *    scroll inercial del usuario: la pagina se "frenaba" al cruzar de una
 *    categoria a otra.
 *  - tabsBox.scrollTo({ behavior: 'smooth' }) deja una animacion nativa en
 *    curso que, en Chrome, bloquea el salto de los enlaces del menu: tocar
 *    "Contacto" justo despues de hacer scroll no movia la pagina.
 * Asignar scrollLeft cuadro a cuadro no tiene ninguno de los dos efectos.
 */
var tabTween = 0;

function centerTab(tab) {
  var target = tab.offsetLeft - (tabsBox.clientWidth - tab.offsetWidth) / 2;
  var max = tabsBox.scrollWidth - tabsBox.clientWidth;
  target = Math.max(0, Math.min(target, max));
  var start = tabsBox.scrollLeft;
  var dist = target - start;
  cancelAnimationFrame(tabTween);
  if (Math.abs(dist) < 2) return;
  if (reduceMotion) { tabsBox.scrollLeft = target; return; }

  var t0 = 0, dur = 280;
  function step(ts) {
    if (!t0) t0 = ts;
    var p = Math.min(1, (ts - t0) / dur);
    tabsBox.scrollLeft = start + dist * (1 - Math.pow(1 - p, 3)); // ease-out
    if (p < 1) tabTween = requestAnimationFrame(step);
  }
  tabTween = requestAnimationFrame(step);
}

function setActive(id) {
  if (id === activeId) return; // sin cambios: no toca el DOM
  activeId = id;
  var tabs = tabsBox.querySelectorAll('.tab');
  var activeTab = null;
  for (var i = 0; i < tabs.length; i++) {
    var on = tabs[i].getAttribute('data-tab') === id;
    tabs[i].classList.toggle('active', on);
    if (on) { tabs[i].setAttribute('aria-current', 'true'); activeTab = tabs[i]; }
    else tabs[i].removeAttribute('aria-current');
  }
  if (activeTab) centerTab(activeTab);
}

/* Solo lecturas: no modifica el DOM, asi no fuerza recalculos de diseño */
function computeActive() {
  var probe = tabsWrap.getBoundingClientRect().bottom + 48;
  var current = '';
  for (var i = 0; i < catBlocks.length; i++) {
    var b = catBlocks[i];
    if (b.hidden) continue;
    if (b.getBoundingClientRect().top <= probe) current = b.id;
    else break;
  }
  return current;
}

/*
 * Mientras el scroll lo provoca un clic en una pestaña no se recalcula,
 * asi la tira no recorre cada categoria intermedia. Se libera cuando el
 * scroll de verdad se detiene: un salto largo tarda mas de un segundo, y
 * un tiempo fijo soltaba el spy a mitad de camino. No depende de
 * "scrollend", que Safari no soporta.
 */
var lockedAt = 0;
function unlockSpy() {
  clearTimeout(unlockTimer);
  if (!spyLocked) return;
  spyLocked = false;
  requestFrame();
}
function armUnlock() {
  clearTimeout(unlockTimer);
  // tope de seguridad: nunca queda bloqueado mas de 3 segundos
  if (Date.now() - lockedAt > 3000) return unlockSpy();
  unlockTimer = setTimeout(unlockSpy, 180);
}
function lockSpy() {
  spyLocked = true;
  lockedAt = Date.now();
  armUnlock();
}
if ('onscrollend' in window) window.addEventListener('scrollend', unlockSpy);

tabsBox.addEventListener('click', function (e) {
  var t = e.target.closest('.tab');
  if (!t) return;
  var id = t.getAttribute('data-tab');
  var el = document.getElementById(id);
  if (!el) return;
  lockSpy();
  setActive(id);
  irA(el, id);
});

/* ============ enlaces internos ============
 * Todos los enlaces "#seccion" (menu superior, botones, pie, pestañas) se
 * resuelven aqui con window.scrollTo.
 *
 * El salto nativo de un enlace no sirve: Chrome lo ignora mientras hay un
 * scroll suave en curso, asi que tocar "Contacto" durante el viaje de una
 * pestaña no hacia nada. window.scrollTo, en cambio, reemplaza cualquier
 * animacion en curso y siempre llega.
 */
function irA(el, id) {
  // respeta los mismos margenes que el CSS: scroll-padding del documento
  // mas el scroll-margin propio del destino
  var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  var mar = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  var max = document.documentElement.scrollHeight - window.innerHeight;
  var top = el.getBoundingClientRect().top + window.scrollY - pad - mar;
  top = Math.max(0, Math.min(Math.round(top), max));
  window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  // actualiza la URL para poder compartir el enlace, sin llenar el historial
  if (id && history.replaceState) history.replaceState(null, '', '#' + id);
}

document.addEventListener('click', function (e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute('href').slice(1);
  var el = id && document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  irA(el, id);
});

/* ============ navbar + scroll ============
 * Un solo manejador de scroll, limitado a un cuadro por refresco de
 * pantalla. Primero lee todo, despues escribe: sin recalculos forzados.
 */
var nav = $('#nav');
var scrolled = null;
var ticking = false;

function frame() {
  ticking = false;
  var s = window.scrollY > 24;                        // lectura
  var current = spyLocked ? null : computeActive();   // lecturas
  if (s !== scrolled) { scrolled = s; nav.classList.toggle('scrolled', s); } // escritura
  if (current !== null) setActive(current);           // escritura
}
function requestFrame() {
  if (!ticking) { ticking = true; requestAnimationFrame(frame); }
}

/*
 * Altura real de la barra de pestañas. El CSS la usa para que un salto a
 * una categoria la deje justo debajo de la barra fija (ver .cat-block).
 * Se mide porque cambia con la fuente, el zoom y el tamaño de pantalla.
 */
function measureTabs() {
  document.documentElement.style.setProperty('--tabs-h', tabsWrap.offsetHeight + 'px');
}

window.addEventListener('scroll', function () {
  if (spyLocked) armUnlock(); // el salto sigue en curso: mantener el bloqueo
  requestFrame();
}, { passive: true });
window.addEventListener('resize', function () { measureTabs(); updateRows(); requestFrame(); }, { passive: true });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () { measureTabs(); updateRows(); requestFrame(); });
}
measureTabs();
updateRows();
frame();

var burger = $('#burger'), mobile = $('#mobile-menu');
function setMenu(open) {
  mobile.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', function () { setMenu(!mobile.classList.contains('open')); });
mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

/* ============ horario ============
 * Decide si el local esta recibiendo pedidos ahora.
 *
 * La hora se lee en la zona del restaurante, no en la del telefono: si el
 * cliente tiene mal el reloj o esta viajando, el horario igual se respeta.
 * Sin horario cargado, la pagina recibe pedidos siempre.
 */
var HOR = CFG.horario;
var DIAS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var DIAS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function horaLocal() {
  var d = new Date();
  try {
    var partes = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: HOR.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(d).forEach(function (p) { partes[p.type] = p.value; });
    var i = DIAS_EN.indexOf(partes.weekday);
    if (i >= 0) return { dia: i, min: Number(partes.hour) * 60 + Number(partes.minute), fecha: fechaISO(d) };
  } catch (e) { /* navegador sin zonas horarias: se usa la hora del equipo */ }
  return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes(), fecha: fechaISO(d) };
}

function fechaISO(d) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: HOR.tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  } catch (e) { return ''; }
}

function cerradoHoy(fecha) {
  return (HOR.cerradoEn || []).indexOf(fecha) !== -1;
}

function franjas(dia) { return (HOR.dias && HOR.dias[dia]) || []; }

function estaAbierto(t) {
  if (!cerradoHoy(t.fecha)) {
    var hoy = franjas(t.dia);
    for (var i = 0; i < hoy.length; i++) {
      var r = hoy[i];
      // si el cierre es menor que la apertura, la franja cruza la medianoche
      if (r[1] > r[0] ? (t.min >= r[0] && t.min < r[1]) : t.min >= r[0]) return true;
    }
  }
  // franja de ayer que sigue abierta despues de medianoche
  var ayer = franjas((t.dia + 6) % 7);
  for (var j = 0; j < ayer.length; j++) {
    if (ayer[j][1] <= ayer[j][0] && t.min < ayer[j][1]) return true;
  }
  return false;
}

function hhmm(min) {
  var h = Math.floor(min / 60) % 24, m = min % 60;
  return (h % 12 || 12) + ':' + (m < 10 ? '0' + m : m) + ' ' + (h < 12 ? 'am' : 'pm');
}

/** Cuando vuelve a abrir, en palabras: "hoy a las 6:00 pm" */
function proximaApertura(t) {
  for (var d = 0; d < 8; d++) {
    var dia = (t.dia + d) % 7;
    var lista = franjas(dia);
    for (var i = 0; i < lista.length; i++) {
      var ini = lista[i][0];
      if (d === 0 && ini <= t.min) continue;
      var cuando = d === 0 ? 'hoy' : d === 1 ? 'mañana' : 'el ' + DIAS_ES[dia];
      return cuando + ' a las ' + hhmm(ini);
    }
  }
  return '';
}

function estado() {
  if (!HOR || !HOR.dias) return { abierto: true };
  var t = horaLocal();
  if (estaAbierto(t)) return { abierto: true };
  var prox = proximaApertura(t);
  return {
    abierto: false,
    corto: prox ? 'Abrimos ' + prox : 'Cerrado por ahora',
    largo: prox
      ? 'Ahora estamos cerrados. Abrimos ' + prox + '. Puedes armar tu pedido y enviarlo cuando abramos.'
      : 'Ahora estamos cerrados.',
  };
}

var ultimoAbierto = null;
function revisarHorario(inicial) {
  var e = estado();
  var aviso = $('#cerrado');
  if (aviso) {
    aviso.hidden = e.abierto;
    if (!e.abierto) aviso.textContent = e.largo;
  }
  if (e.abierto === ultimoAbierto) return;
  ultimoAbierto = e.abierto;
  if (inicial) return;                        // al arrancar, render() ya viene
  render();                                   // el carrito cambia de mensaje
  if (root.querySelector('#send')) updateModal(checkoutHtml()); // pedido abierto
}

/* ============ checkout ============ */
var datos = {
  nombre: '', tel: '', entrega: CFG.direccion ? 'domicilio' : 'recoger',
  dir: '', barrio: '', ind: '', pago: CFG.pagos[0] || 'Efectivo', notas: ''
};

function envio() { return datos.entrega === 'domicilio' ? (CFG.envio || 0) : 0; }
function valido() {
  return estado().abierto &&
    datos.nombre.trim().length >= 3 &&
    datos.tel.replace(/\D/g, '').length >= 7 &&
    (datos.entrega === 'recoger' || (datos.dir.trim().length >= 5 && datos.barrio.trim().length >= 3));
}

function pedidoTexto() {
  var L = [];
  L.push('*NUEVO PEDIDO - ' + CFG.marca + '*', '');
  L.push('*Cliente:* ' + datos.nombre);
  L.push('*Teléfono:* ' + datos.tel);
  if (CFG.sede) L.push('*Sede:* ' + CFG.sede);
  L.push('*Entrega:* ' + (datos.entrega === 'domicilio' ? 'Domicilio' : 'Recoger en tienda'));
  if (datos.entrega === 'domicilio') {
    L.push('*Dirección:* ' + datos.dir);
    L.push('*Barrio:* ' + datos.barrio);
    if (datos.ind) L.push('*Indicaciones:* ' + datos.ind);
  }
  L.push('*Pago:* ' + datos.pago, '', '*PEDIDO*');
  cart.forEach(function (i) {
    L.push('• ' + i.cant + 'x ' + i.n + (i.tam ? ' (' + i.tam + ')' : '') + ' — ' + money(i.precio * i.cant));
    (i.ops || []).forEach(function (o) { L.push('   + ' + o.n + (o.p > 0 ? ' (' + money(o.p) + ')' : '')); });
    if (i.nota) L.push('   Nota: ' + i.nota);
  });
  L.push('', 'Subtotal: ' + money(subtotal()));
  if (envio() > 0) L.push('Domicilio: ' + money(envio()));
  L.push('*TOTAL: ' + money(subtotal() + envio()) + '*');
  if (datos.notas) L.push('', '*Notas:* ' + datos.notas);
  return L.join('\n');
}

function checkoutHtml() {
  var total = subtotal() + envio();
  var ok = valido();
  var e = estado();

  var toggle = (CFG.recoger && CFG.direccion)
    ? '<div class="toggle"><button data-e="domicilio" class="' + (datos.entrega === 'domicilio' ? 'active' : '') + '">\u{1F6F5} Domicilio</button>' +
      '<button data-e="recoger" class="' + (datos.entrega === 'recoger' ? 'active' : '') + '">\u{1F3EA} Recoger</button></div>'
    : '';

  var dirFields = datos.entrega === 'domicilio'
    ? '<label class="field"><span>Dirección *</span><input class="inp" data-f="dir" value="' + esc(datos.dir) + '" placeholder="Cra 00 # 00-00" autocomplete="street-address"></label>' +
      '<label class="field"><span>Barrio *</span><input class="inp" data-f="barrio" value="' + esc(datos.barrio) + '" placeholder="Ej: Betania" autocomplete="address-level3"></label>' +
      '<label class="field"><span>Indicaciones <em>opcional</em></span><input class="inp" data-f="ind" value="' + esc(datos.ind) + '" placeholder="Apto, torre, punto de referencia"></label>'
    : '';

  var pagos = '<div class="field"><span>Método de pago</span><div class="pay-grid">' +
    CFG.pagos.map(function (m) {
      return '<button class="pay' + (datos.pago === m ? ' active' : '') + '" data-p="' + esc(m) + '">' + esc(m) + '</button>';
    }).join('') + '</div></div>';

  var resumen = '<div class="summary"><h4>Resumen</h4>' +
    cart.map(function (i) {
      return '<div class="sum-row"><span>' + i.cant + 'x ' + esc(i.n) + (i.tam ? ' (' + esc(i.tam) + ')' : '') +
        '</span><span>' + money(i.precio * i.cant) + '</span></div>';
    }).join('') +
    '<div class="sum-div"></div>' +
    '<div class="sum-row"><span>Subtotal</span><span>' + money(subtotal()) + '</span></div>' +
    (envio() > 0 ? '<div class="sum-row"><span>Domicilio</span><span>' + money(envio()) + '</span></div>' : '') +
    '<div class="sum-row sum-total"><span>Total</span><span>' + money(total) + '</span></div></div>';

  return '<div class="drawer-head"><h2>Datos de tu pedido</h2>' +
    '<button class="x-btn" data-close aria-label="Cerrar">×</button></div>' +
    '<div class="modal-body">' + toggle +
    '<label class="field"><span>Nombre completo *</span><input class="inp" data-f="nombre" value="' + esc(datos.nombre) + '" placeholder="Tu nombre" autocomplete="name"></label>' +
    '<label class="field"><span>Teléfono *</span><input class="inp" type="tel" data-f="tel" value="' + esc(datos.tel) + '" placeholder="300 000 0000" autocomplete="tel" inputmode="tel"></label>' +
    dirFields + pagos +
    '<label class="field"><span>Notas del pedido <em>opcional</em></span><textarea class="ta" rows="2" maxlength="300" data-f="notas" placeholder="Algo más que debamos saber">' + esc(datos.notas) + '</textarea></label>' +
    resumen + '</div>' +
    '<div class="drawer-foot">' +
    (e.abierto ? '' : '<p class="cerrado-nota">' + esc(e.corto) + '. Tu pedido queda guardado.</p>') +
    '<button class="btn btn-wa btn-block" id="send"' + (ok ? '' : ' disabled') + '>' +
    (e.abierto ? 'Enviar por WhatsApp · ' + money(total) : 'Cerrado ahora') + '</button>' +
    '<p class="hint" id="send-hint"' + (ok || !e.abierto ? ' hidden' : '') + '>Completa los campos con * para continuar.</p></div>';
}

function openCheckout() {
  if (!cart.length) return;
  drawer.classList.remove('open');
  backdrop.classList.remove('open');

  openModal(checkoutHtml(), {
    // escribir en un campo solo actualiza el estado y el boton: no redibuja,
    // asi el cursor no salta y el teclado del celular no se cierra
    input: function (e) {
      var f = e.target.getAttribute('data-f');
      if (!f) return;
      datos[f] = e.target.value;
      var ok = valido();
      var btn = document.getElementById('send');
      var hint = document.getElementById('send-hint');
      if (btn) btn.disabled = !ok;
      if (hint) hint.hidden = ok;
    },
    click: function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-e')) { datos.entrega = b.getAttribute('data-e'); return updateModal(checkoutHtml()); }
      if (b.hasAttribute('data-p')) { datos.pago = b.getAttribute('data-p'); return updateModal(checkoutHtml()); }
      if (b.id === 'send') {
        if (!valido()) return;
        window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(pedidoTexto()), '_blank', 'noopener');
        cart = []; save(); render();
        ctrl = null;
        updateModal('<div class="ok-screen"><span aria-hidden="true">✅</span>' +
          '<h2>¡Pedido enviado!</h2><p class="muted">Continúa la conversación en WhatsApp para confirmarlo.</p>' +
          '<button class="btn btn-primary" data-close>Listo</button></div>');
      }
    }
  });
}

/* ============ arranque ============ */
revisarHorario(true);   // deja el aviso puesto antes del primer dibujado
render();
// si la pagina queda abierta, el estado se actualiza solo a la hora de abrir
setInterval(function () { revisarHorario(); }, 30000);
})();
`;
}
