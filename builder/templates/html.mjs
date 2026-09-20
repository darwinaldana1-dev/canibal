/** Genera el index.html completo, con el menu ya renderizado. */

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const slug = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

const money = (n, cfg) =>
  new Intl.NumberFormat(cfg.menu.locale, {
    style: 'currency', currency: cfg.menu.currency, maximumFractionDigits: 0,
  }).format(n);

const waLink = (cfg, msg, num) =>
  `https://wa.me/${num || cfg.contact.whatsapp}?text=${encodeURIComponent(msg || cfg.contact.whatsappMessage)}`;

/**
 * El sitio es de una sola pagina. Traduce rutas tipo /menu a anclas,
 * para que un config heredado de una version multipagina no deje enlaces rotos.
 */
const RUTAS = {
  '/': '#inicio', '/menu': '#menu', '/sedes': '#contacto',
  '/contacto': '#contacto', '/nosotros': '#nosotros', '/domicilios': '#domicilios',
};

function href(h) {
  if (!h) return '#';
  if (/^(https?:|mailto:|tel:|wa\.me|#)/i.test(h)) return h;
  if (RUTAS[h]) return RUTAS[h];
  if (h.startsWith('/#')) return h.slice(1);
  return h;
}

/**
 * Imagenes por defecto cuando no hay generador de por medio: solo acepta
 * URLs externas. El generador pasa su propio resolvedor, que devuelve la
 * ruta publicada solo si el archivo existe, para no dejar imagenes rotas.
 */
const SIN_IMAGENES = {
  url: (u) => (/^(https?:)?\/\//.test(u || '') || String(u || '').startsWith('data:') ? u : null),
  size: () => null,
};

/* ---------- piezas ---------- */

function media(img, url, alt, phChar) {
  const src = img(url);
  return src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`
    : `<div class="ph" aria-hidden="true">${esc(phChar)}</div>`;
}

function navbar(cfg) {
  const links = cfg.nav.map((l) => `<li><a class="nav-link" href="${esc(href(l.href))}">${esc(l.label)}</a></li>`).join('');
  const mob = cfg.nav.map((l) => `<li><a class="mobile-link" href="${esc(href(l.href))}">${esc(l.label)}</a></li>`).join('');
  return `<nav class="nav" id="nav">
<div class="nav-inner container">
<a class="logo" href="#inicio" aria-label="${esc(cfg.brand.name)}"><b>${esc(cfg.brand.logoPrimary)}</b><i>${esc(cfg.brand.logoAccent)}</i></a>
<ul class="nav-links">${links}</ul>
<div class="nav-actions">
<button class="cart-btn" id="cart-open" aria-label="Abrir carrito">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
<span class="cart-badge" id="cart-badge" hidden>0</span></button>
<a class="btn btn-primary btn-sm nav-cta" href="${esc(href(cfg.navCta.href))}">${esc(cfg.navCta.label)}</a>
<button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
</div></div></nav>
<div class="mobile-menu" id="mobile-menu"><ul class="mobile-links">${mob}
<li><a class="btn btn-primary btn-block" href="${esc(href(cfg.navCta.href))}">${esc(cfg.navCta.label)}</a></li></ul></div>`;
}

function hero(cfg, img) {
  const h = cfg.home.hero;
  const lines = h.titleLines.map((l) => `<span>${esc(l)}</span>`).join('');
  // las cifras son opcionales: con la lista vacia, el bloque no se dibuja
  const stats = (h.stats || []).length
    ? `<dl class="hero-stats">${h.stats.map((s) => `<div class="stat"><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join('')}</dl>`
    : '';
  // el boton secundario es opcional: sin etiqueta, no se dibuja
  const sec = h.secondaryCta?.href === 'whatsapp' ? waLink(cfg) : href(h.secondaryCta?.href);
  const target = h.secondaryCta?.href === 'whatsapp' ? ' target="_blank" rel="noopener"' : '';
  const secBtn = h.secondaryCta?.label
    ? `<a class="btn btn-ghost" href="${esc(sec)}"${target}>${esc(h.secondaryCta.label)}</a>`
    : '';
  return `<section class="hero" id="inicio">
<div class="hero-glow" aria-hidden="true"></div>
<div class="hero-inner container">
<div class="hero-text">
<span class="eyebrow">${esc(h.eyebrow)}</span>
<h1 class="hero-title display">${lines}</h1>
<p class="hero-desc">${esc(h.description)}</p>
<div class="hero-actions">
<a class="btn btn-primary" href="${esc(href(h.primaryCta.href))}">${esc(h.primaryCta.label)}</a>
${secBtn}
</div>
${stats}
</div>
${heroImagen(cfg, img)}
</div></section>`;
}

/**
 * Imagen del inicio. Dos modos, segun home.hero.imageFit:
 *  - 'foto' (defecto): recuadro cuadrado con borde, solo en escritorio.
 *  - 'logo': el logo suelto, sin marco, tambien visible en celular.
 * Carga con prioridad porque es lo primero que se ve.
 */
function heroImagen(cfg, img) {
  const h = cfg.home.hero;
  const logo = h.imageFit === 'logo';
  const src = img(h.image);
  const dims = src ? img.size(src) : null;
  const tag = src
    ? `<img src="${esc(src)}" alt="${esc(cfg.brand.name)}"${dims ? ` width="${dims.w}" height="${dims.h}"` : ''} fetchpriority="high" decoding="async">`
    : `<div class="ph" aria-hidden="true">${esc(cfg.brand.logoPrimary.charAt(0))}</div>`;
  return `<div class="hero-img-col${logo && src ? ' is-logo' : ''}"><div class="hero-img">${tag}</div></div>`;
}

function perks(cfg) {
  // igual que las cifras: sin entradas, la franja no aparece
  if (!(cfg.home.perks || []).length) return '';
  const items = cfg.home.perks.map((p) =>
    `<article class="perk"><span class="perk-icon" aria-hidden="true">${esc(p.icon)}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></article>`).join('');
  return `<section class="perks section"><div class="perks-grid container">${items}</div></section>`;
}

/**
 * Tarjeta de producto. La misma en el menu y en los destacados, para que
 * en los dos lados se comporte igual: tocarla abre la ficha del producto
 * y el boton la agrega al carrito.
 */
function tarjeta(p, cfg, img) {
  const desde = p.tamanios?.length ? Math.min(...p.tamanios.map((t) => t.precio)) : p.precio;
  const elegir = Boolean(p.tamanios?.length || p.grupos?.length);
  const tags = (p.etiquetas || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  return `<article class="card" data-id="${esc(p.id)}" tabindex="0" role="button" aria-label="Ver ${esc(p.nombre)}">
<div class="card-img">${media(img, p.imagenUrl, p.nombre, p.nombre.charAt(0))}${tags ? `<div class="card-tags">${tags}</div>` : ''}</div>
<div class="card-body"><h4 class="card-name">${esc(p.nombre)}</h4>
${p.descripcion ? `<p class="card-desc">${esc(p.descripcion)}</p>` : ''}
<div class="card-foot"><span class="card-price">${p.tamanios?.length ? '<em>Desde </em>' : ''}${money(desde, cfg)}</span>
<button class="card-add${elegir ? '' : ' card-add-plus'}" data-id="${esc(p.id)}" aria-label="${elegir ? 'Elegir opciones de' : 'Agregar'} ${esc(p.nombre)}">${elegir ? 'Elegir' : '+'}</button></div>
</div></article>`;
}

function featured(cfg, productos, img) {
  if (!productos.length) return '';
  const cards = productos.map((p) => tarjeta(p, cfg, img)).join('');
  return `<section class="section" id="destacados"><div class="container">
<header class="sec-head"><span class="eyebrow">Los favoritos</span>
<h2 class="sec-title">Lo más <span class="accent">pedido</span></h2>
<p class="sec-lead">Los platos que la gente repite. Si es tu primera vez, empieza por aquí.</p></header>
<div class="feat-grid" id="destacados-grid">${cards}</div>
<div class="feat-cta"><a class="btn btn-primary" href="#menu">Ver menú completo</a></div>
</div></section>`;
}

function about(cfg, img) {
  const a = cfg.home.about;
  const ps = a.body.map((p) => `<p>${esc(p)}</p>`).join('');
  return `<section class="about section" id="nosotros"><div class="about-grid container">
<div class="about-img-col">
<div class="about-img${a.imageFit === 'logo' && img(a.image) ? ' is-logo' : ''}">${media(img, a.image, a.title, cfg.brand.logoPrimary.charAt(0))}</div>
<div class="float-card"><b>${esc(a.floatCard.value)}</b><span>${esc(a.floatCard.label)}</span></div>
</div>
<div class="about-text"><span class="eyebrow">${esc(a.eyebrow)}</span>
<h2 class="sec-title">${esc(a.title)}</h2>${ps}
<a class="btn btn-ghost" href="#menu">Conoce el menú</a></div>
</div></section>`;
}

function delivery(cfg) {
  const d = cfg.home.delivery;
  const cards = d.cards.map((c) => `<article class="info-card"><span class="info-icon" aria-hidden="true">${esc(c.icon)}</span>
<div><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p></div></article>`).join('');
  return `<section class="delivery section" id="domicilios"><div class="delivery-inner container">
<div class="delivery-text"><span class="eyebrow">${esc(d.eyebrow)}</span>
<h2 class="sec-title">${esc(d.title)} <span class="accent">${esc(d.titleAccent)}</span></h2>
${d.cta?.label ? `<a class="btn btn-primary" href="${esc(href(d.cta.href))}">${esc(d.cta.label)}</a>` : ''}</div>
<div class="info-cards">${cards}</div></div></section>`;
}

/** Seccion de contacto y ubicacion, destino del enlace "Contacto" */
function contacto(cfg) {
  const sedes = cfg.sedes.filter((s) => s.activa);
  if (!sedes.length) return '';

  const cards = sedes.map((s) => {
    // cada fila ya viene como HTML seguro: el texto se escapa aqui,
    // el telefono lleva un enlace construido con valores escapados
    const filas = [
      ['📍', esc([s.direccion, s.ciudad].filter(Boolean).join(', '))],
      s.horario ? ['🕒', esc(s.horario)] : null,
      s.telefono ? ['📞', `<a href="tel:${esc(s.telefono)}">${esc(s.telefono)}</a>`] : null,
    ].filter(Boolean);

    return `<article class="sede-card">
<h3>${esc(s.nombre)}</h3>
<dl class="sede-info">${filas.map(([i, v]) =>
      `<div class="sede-row"><dt aria-hidden="true">${i}</dt><dd>${v}</dd></div>`).join('')}</dl>
<div class="sede-acts">
<a class="btn btn-wa btn-sm" href="${waLink(cfg, null, s.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>
${s.mapsUrl ? `<a class="btn btn-ghost btn-sm" href="${esc(s.mapsUrl)}" target="_blank" rel="noopener">Cómo llegar</a>` : ''}
<a class="btn btn-ghost btn-sm" href="#menu">Ver menú</a>
</div></article>`;
  }).join('');

  return `<section class="contacto section" id="contacto"><div class="container">
<header class="sec-head"><span class="eyebrow">Encuéntranos</span>
<h2 class="sec-title">${sedes.length > 1 ? 'Nuestras sedes' : 'Dónde estamos'}</h2>
<p class="sec-lead">Pide a domicilio o pasa por el local a recoger tu pedido.</p></header>
<div class="sede-grid">${cards}</div>
</div></section>`;
}

function menuSection(cfg, menu, img) {
  const sede = cfg.sedes.find((s) => s.activa);

  const tabs = menu.categorias.map((b) =>
    `<button class="tab" data-tab="${slug(b.categoria.nombre)}">${b.categoria.emoji ? esc(b.categoria.emoji) + ' ' : ''}${esc(b.categoria.nombre)}</button>`).join('');

  const bloques = menu.categorias.map((b) => {
    const cards = b.items.map((p) => tarjeta(p, cfg, img)).join('');

    return `<section class="cat-block" id="${slug(b.categoria.nombre)}">
<div class="cat-head"><h3>${b.categoria.emoji ? esc(b.categoria.emoji) + ' ' : ''}${esc(b.categoria.nombre)}</h3>
<div class="cat-meta"><span class="cat-count">${b.items.length} ${b.items.length === 1 ? 'producto' : 'productos'}</span>
<div class="row-nav"><button class="row-btn row-prev" data-dir="-1" aria-label="Ver anteriores de ${esc(b.categoria.nombre)}" disabled></button><button class="row-btn row-next" data-dir="1" aria-label="Ver más de ${esc(b.categoria.nombre)}"></button></div></div></div>
${b.categoria.descripcion ? `<p class="cat-desc">${esc(b.categoria.descripcion)}</p>` : ''}
<div class="grid">${cards}</div></section>`;
  }).join('');

  return `<section class="menu-sec" id="menu"><div class="container">
<header class="menu-head"><span class="eyebrow">Nuestra carta</span><h2 class="display">Menú</h2>
${sede ? `<p class="menu-sede">${esc(sede.nombre)} · ${esc(sede.direccion)}${sede.horario ? ' · ' + esc(sede.horario) : ''}</p>` : ''}</header>
${cfg.menu.enableSearch ? `<div class="search-wrap">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
<input class="search" id="search" type="search" placeholder="Buscar en el menú…" aria-label="Buscar en el menú">
<button class="search-clear" id="search-clear" aria-label="Limpiar búsqueda" hidden>×</button></div>` : ''}
</div>
<div class="tabs-wrap"><div class="tabs scroll-x container" id="tabs" aria-label="Categorías del menú">${tabs}</div></div>
<div class="container" id="menu-body">${bloques}
<div class="empty" id="no-results" hidden><span aria-hidden="true">🔍</span><h3>Sin resultados</h3>
<p class="muted">No encontramos nada con esa palabra.</p>
<button class="btn btn-ghost btn-sm" id="clear-search-2">Ver todo el menú</button></div>
</div></section>`;
}

function footer(cfg) {
  const year = new Date().getFullYear();
  const sedes = cfg.sedes.filter((s) => s.activa);
  const c = cfg.contact;

  const redes = [
    c.instagram && ['Instagram', c.instagram, '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>', true],
    c.facebook && ['Facebook', c.facebook, '<path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/>', false],
    c.tiktok && ['TikTok', c.tiktok, '<path d="M16 3v3.2a5.8 5.8 0 0 0 4 1.6v3a8.6 8.6 0 0 1-4-1.1v5.9a6.6 6.6 0 1 1-6.6-6.6c.3 0 .7 0 1 .1v3.1a3.5 3.5 0 1 0 2.5 3.4V3z"/>', false],
  ].filter(Boolean).map(([nombre, url, path, stroke]) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${nombre}"><svg width="18" height="18" viewBox="0 0 24 24" ${stroke ? 'fill="none" stroke="currentColor" stroke-width="2"' : 'fill="currentColor"'}>${path}</svg></a>`).join('');

  const legales = (cfg.footer.legalLinks || [])
    .filter((l) => /^(https?:|#)/i.test(l.href))
    .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('');

  return `<footer class="footer"><div class="foot-top container">
<div class="foot-brand"><span class="logo"><b>${esc(cfg.brand.logoPrimary)}</b><i>${esc(cfg.brand.logoAccent)}</i></span>
<p class="foot-tagline">${esc(cfg.brand.tagline)}</p>${redes ? `<div class="social">${redes}</div>` : ''}</div>
<div class="foot-group"><h3>Navegación</h3><ul class="foot-list">
${cfg.nav.map((l) => `<li><a href="${esc(href(l.href))}">${esc(l.label)}</a></li>`).join('')}</ul></div>
<div class="foot-group"><h3>${sedes.length > 1 ? 'Sedes' : 'Dónde estamos'}</h3><ul class="foot-list">
${sedes.map((s) => `<li><span class="foot-txt">${esc(s.direccion)}</span>${s.horario ? `<span class="foot-txt">${esc(s.horario)}</span>` : ''}</li>`).join('')}</ul></div>
<div class="foot-group"><h3>Contacto</h3><ul class="foot-list">
<li><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></li>
${c.email ? `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : ''}
<li><a href="${waLink(cfg)}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></li></ul></div>
</div>
<div class="foot-bottom container"><p>© ${year} ${esc(cfg.brand.name)}. Todos los derechos reservados.</p>
${legales ? `<div class="foot-legal">${legales}</div>` : ''}
${cfg.footer.credit?.label ? `<a href="${esc(cfg.footer.credit.href)}" target="_blank" rel="noopener">Hecho por ${esc(cfg.footer.credit.label)}</a>` : ''}
</div></footer>`;
}

function shells(cfg) {
  /*
   * Boton flotante de WhatsApp. Apagado por defecto: es un atajo para
   * escribir sin pasar por el carrito, y el pedido llega sin detalle.
   * Se enciende con contact.botonFlotante = true.
   */
  const fab = cfg.contact.botonFlotante === true
    ? `<a class="wa-fab" id="wa-fab" href="${waLink(cfg)}" target="_blank" rel="noopener" aria-label="WhatsApp">
<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 13 13 0 0 0 5 4.4c1.9.7 2.6.8 3.5.7.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg></a>`
    : '';
  return `<div class="backdrop" id="backdrop"></div>
<aside class="drawer" id="drawer" aria-label="Carrito"><div class="drawer-head">
<div><h2>Tu pedido</h2><p id="drawer-count">0 productos</p></div>
<button class="x-btn" id="cart-close" aria-label="Cerrar carrito">×</button></div>
<div id="drawer-content"></div></aside>
<div id="modal-root"></div>
${fab}
<button class="cart-bar" id="cart-bar" hidden><b id="bar-count">0</b><span>Ver pedido</span><i id="bar-total"></i></button>`;
}

function jsonLd(cfg, img) {
  const sede = cfg.sedes.find((s) => s.activa);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: cfg.brand.name,
    description: cfg.brand.description,
    telephone: cfg.contact.phone,
    url: cfg.seo.siteUrl,
    servesCuisine: cfg.seo.keywords[0],
  };
  const og = img(cfg.brand.ogImage);
  if (og) data.image = `${cfg.seo.siteUrl.replace(/\/$/, '')}/${og}`;
  if (sede) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: sede.direccion,
      addressLocality: sede.ciudad || sede.barrio,
      addressCountry: 'CO',
    };
    if (sede.horario) data.openingHours = sede.horario;
    if (sede.lat && sede.lng) data.geo = { '@type': 'GeoCoordinates', latitude: sede.lat, longitude: sede.lng };
  }
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/** Datos minimos que el JS necesita para modales y carrito */
function menuPayload(cfg, menu, img) {
  const items = {};
  for (const b of menu.categorias) {
    for (const p of b.items) {
      const o = { n: p.nombre, p: p.precio };
      const src = img(p.imagenUrl);
      if (src) o.img = src;
      if (p.descripcion) o.d = p.descripcion;
      if (p.ingredientes) o.ing = p.ingredientes; // texto largo: "Qué lleva"
      if (p.tamanios?.length) o.t = p.tamanios.map((t) => {
        const st = { n: t.nombre, c: t.codigo || '', p: t.precio, pr: t.porciones || 0 };
        const si = img(t.imagenUrl);      // cada tamaño puede tener su propia foto
        if (si) st.img = si;
        return st;
      });
      if (p.grupos?.length) o.g = p.grupos.map((g) => ({
        id: g.id, t: g.titulo, min: g.min, max: g.max,
        o: g.opciones.map((x) => ({ id: x.id, n: x.nombre, p: x.precio, inc: x.incluida ? 1 : 0 })),
      }));
      items[p.id] = o;
    }
  }
  const sede = cfg.sedes.find((s) => s.activa) || {};
  return {
    items,
    cfg: {
      loc: cfg.menu.locale,
      cur: cfg.menu.currency,
      wa: sede.whatsapp || cfg.contact.whatsapp,
      pagos: cfg.checkout.metodosPago,
      recoger: cfg.checkout.permiteRecoger,
      direccion: cfg.checkout.pideDireccion,
      envio: sede.tarifaDomicilio || 0,
      marca: cfg.brand.name,
      sede: sede.nombre || '',
    },
  };
}

export function buildHtml(cfg, menu, imagenes = SIN_IMAGENES) {
  const img = (u) => (u ? imagenes.url(u) : null);
  img.size = (src) => imagenes.size(src);

  // Destacados: los marcados con destacado:true, o los primeros del menu.
  // Entre ellos van primero los que tienen foto, porque esta seccion entra
  // por los ojos y una tarjeta sin foto desaprovecha el lugar.
  const todos = menu.categorias.flatMap((c) => c.items);
  const marcados = todos.filter((p) => p.destacado);
  const destacados = (marcados.length ? marcados : todos)
    .slice()
    .sort((a, b) => Number(Boolean(img(b.imagenUrl))) - Number(Boolean(img(a.imagenUrl))))
    .slice(0, 3);

  const favicon = img(cfg.brand.favicon);
  const og = img(cfg.brand.ogImage);
  const base = cfg.seo.siteUrl.replace(/\/$/, '');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(cfg.seo.defaultTitle)}</title>
<meta name="description" content="${esc(cfg.brand.description)}">
<meta name="keywords" content="${esc(cfg.seo.keywords.join(', '))}">
<meta name="theme-color" content="${esc(cfg.theme.background)}">
<link rel="canonical" href="${esc(base)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(cfg.seo.defaultTitle)}">
<meta property="og:description" content="${esc(cfg.brand.description)}">
<meta property="og:url" content="${esc(base)}">
${og ? `<meta property="og:image" content="${esc(base)}/${esc(og)}">` : ''}
<meta name="twitter:card" content="${og ? 'summary_large_image' : 'summary'}">
${favicon ? `<link rel="icon" href="${esc(favicon)}">` : '<link rel="icon" href="data:,">'}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(cfg.theme.fontsUrl)}">
<link rel="stylesheet" href="styles.css">
${jsonLd(cfg, img)}
</head>
<body>
${navbar(cfg)}
<main>
${hero(cfg, img)}
${perks(cfg)}
${featured(cfg, destacados, img)}
${menuSection(cfg, menu, img)}
${about(cfg, img)}
${delivery(cfg)}
${contacto(cfg)}
</main>
${footer(cfg)}
${shells(cfg)}
<script id="menu-data" type="application/json">${JSON.stringify(menuPayload(cfg, menu, img))}</script>
<script src="app.js" defer></script>
</body>
</html>
`;
}
