/**
 * Imagenes del restaurante.
 *
 * - Busca los archivos en la carpeta que indica config.imagenes
 *   (relativa a la raiz del proyecto), o en restaurantes/<nombre>/.
 * - Asocia solas las fotos de productos por nombre de archivo.
 * - Publica solo las imagenes que la pagina usa, con nombres web limpios,
 *   para que el original pesado no termine en el sitio.
 */

import { readdir, readFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, sep, dirname, extname, basename } from 'node:path';

const EXT_FOTO = /\.(jpe?g|png|webp|avif)$/i;
const PESADA_KB = 350;

/** "Salchipapa Caníbal" -> "salchipapa canibal" */
export const clave = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();

const singular = (s) => s.split(' ').map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)).join(' ');

/** "Logo/logo letras.JPG" -> "img/logo/logo-letras.jpg" */
const rutaWeb = (rel) =>
  'img/' + rel.split('/').map((seg, i, arr) => {
    const ext = i === arr.length - 1 ? extname(seg).toLowerCase() : '';
    return clave(ext ? seg.slice(0, -ext.length) : seg).replace(/ /g, '-') + ext;
  }).join('/');

async function listar(dir, base = dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listar(full, base)));
    else out.push(relative(base, full).split(sep).join('/'));
  }
  return out;
}

/** Ancho y alto de un PNG o JPEG, leyendo solo la cabecera */
function medidas(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null;
      const m = buf[i + 1];
      if (m === 0xff) { i++; continue; }
      const sof = m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc;
      if (sof) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

/**
 * Prepara las imagenes de un restaurante.
 * Devuelve el resolvedor para la plantilla, el menu con las fotos asociadas,
 * la lista de copias y un reporte para la consola.
 */
export async function prepararImagenes({ raiz, dirRestaurante, config, menu }) {
  const dir = config.imagenes ? join(raiz, config.imagenes) : dirRestaurante;
  const archivos = await listar(dir);
  const porClave = new Map(archivos.map((f) => [f.toLowerCase(), f])); // rutas sin importar mayusculas

  const publicadas = new Map(); // ruta fuente -> ruta web
  const tamanos = new Map();    // ruta web -> {w,h}
  const fuentes = new Map();    // ruta original -> archivo que se copia
  const pesadas = [];

  const buscar = (u) => porClave.get(String(u).replace(/^\.?\//, '').toLowerCase());

  /* ---- version optimizada: web/<misma ruta>.jpg tiene prioridad ---- */
  function fuenteDe(rel) {
    const sinExt = rel.slice(0, rel.length - extname(rel).length);
    for (const cand of [`web/${sinExt}.jpg`, `web/${sinExt}.png`]) {
      const hit = porClave.get(cand.toLowerCase());
      if (hit) return hit;
    }
    return rel;
  }

  async function registrar(rel) {
    if (publicadas.has(rel)) return publicadas.get(rel);
    const src = fuenteDe(rel);
    // la ruta publicada usa el nombre original con la extension de la fuente
    const web = rutaWeb(rel.slice(0, rel.length - extname(rel).length) + extname(src));
    publicadas.set(rel, web);
    fuentes.set(rel, src);
    const buf = await readFile(join(dir, src));
    const m = medidas(buf);
    if (m) tamanos.set(web, m);
    if (buf.length / 1024 > PESADA_KB) pesadas.push(`${rel} pesa ${Math.round(buf.length / 1024)} KB`);
    return web;
  }

  /* ---- fotos de productos ----
   * Se comparan por palabras, no por texto exacto: "Burrito pollo.png"
   * encuentra "Burrito de pollo", y "Sandwichs pollo.png" encuentra
   * "Sándwich de pollo". Las palabras sobrantes pueden indicar el tamaño
   * ("Salchipapa Canibal 2P" = la de 2 personas).
   */
  const STOP = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'con', 'y', 'a', 'al', 'en', 'para']);
  const raiz1 = (t) => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t);
  const palabras = (s) => clave(s).split(' ').filter((t) => t && !STOP.has(t)).map(raiz1);

  const productos = menu.categorias.flatMap((b) => b.items.map((p) => ({ p, cat: b.categoria.nombre })));
  const porId = new Map(productos.map((x) => [clave(x.p.id), x.p]));

  /** El tamaño al que apuntan las palabras sobrantes, si alguna lo indica */
  function buscarTamanio(prod, sobran) {
    if (!prod.tamanios || !prod.tamanios.length || !sobran.length) return null;
    const num = sobran.map((t) => /^(\d+)p$/.exec(t)).find(Boolean);
    if (num) {
      const porPorciones = prod.tamanios.find((t) => Number(t.porciones) === Number(num[1]));
      if (porPorciones) return porPorciones;
    }
    for (const t of prod.tamanios) {
      const suyas = palabras(`${t.nombre} ${t.codigo || ''}`);
      if (suyas.length && suyas.every((w) => sobran.includes(w))) return t;
    }
    return null;
  }

  const fotos = archivos.filter((f) => /(^|\/)productos\//i.test(f) && !/^web\//i.test(f) && EXT_FOTO.test(f));
  const asociadas = [], ambiguas = [], sinProducto = [], repetidas = [];
  const yaTiene = new Map();
  const overrides = new Map(Object.entries(config.fotos || {}).map(([k, v]) => [clave(k), v]));

  for (const f of fotos) {
    const partes = f.split('/');
    const idx = partes.findIndex((s) => s.toLowerCase() === 'productos');
    const sub = partes.slice(idx + 1, -1).join(' ');   // subcarpeta = categoria
    const nombre = basename(f, extname(f));
    const tokens = palabras(`${sub} ${nombre}`);

    let prod = null, tam = null, dudosos = null;

    // 1. excepciones declaradas en el config
    const fijo = overrides.get(clave(nombre));
    if (fijo) {
      const ref = typeof fijo === 'string' ? { producto: fijo } : fijo;
      prod = porId.get(clave(ref.producto)) || productos.find((x) => clave(x.p.nombre) === clave(ref.producto))?.p || null;
      if (prod && ref.tamanio) tam = (prod.tamanios || []).find((t) => clave(`${t.nombre} ${t.codigo || ''}`).includes(clave(ref.tamanio))) || null;
    }

    // 2. por id exacto
    if (!prod) prod = porId.get(clave(nombre)) || null;

    // 3. por palabras: gana el producto cuyo nombre aporte mas palabras
    if (!prod) {
      let mejor = [], puntos = 0;
      for (const x of productos) {
        const suyas = palabras(x.p.nombre);
        if (!suyas.length || !suyas.every((w) => tokens.includes(w))) continue;
        if (suyas.length > puntos) { puntos = suyas.length; mejor = [x.p]; }
        else if (suyas.length === puntos) mejor.push(x.p);
      }
      if (mejor.length === 1) prod = mejor[0];
      else if (mejor.length > 1) dudosos = mejor;
    }

    if (!prod) {
      if (dudosos) ambiguas.push(`${f}: podria ser ${dudosos.map((p) => p.nombre).join(' o ')}`);
      else sinProducto.push(f);
      continue;
    }

    // tamaño: el declarado en el config o el que digan las palabras sobrantes
    if (!tam) {
      const suyas = palabras(prod.nombre);
      tam = buscarTamanio(prod, tokens.filter((t) => !suyas.includes(t)));
    }

    const llave = tam ? `${prod.id}@${tam.nombre}${tam.codigo || ''}` : prod.id;
    if (yaTiene.has(llave)) { repetidas.push(`${f} (ya tenia ${yaTiene.get(llave)})`); continue; }
    yaTiene.set(llave, f);

    if (tam) {
      if (!tam.imagenUrl) tam.imagenUrl = await registrar(f);
      asociadas.push(`${prod.nombre} · ${tam.nombre}${tam.codigo ? ' ' + tam.codigo : ''} <- ${f}`);
    } else {
      if (!prod.imagenUrl) prod.imagenUrl = await registrar(f);
      asociadas.push(`${prod.nombre} <- ${f}`);
    }
  }

  // un producto sin foto propia usa la del primer tamaño que si tenga
  for (const { p } of productos) {
    if (p.imagenUrl || !p.tamanios) continue;
    const conFoto = p.tamanios.find((t) => t.imagenUrl);
    if (conFoto) p.imagenUrl = conFoto.imagenUrl;
  }

  /* ---- imagenes del config (inicio, nosotros, favicon...) ---- */
  const delConfig = [config.home?.hero?.image, config.home?.about?.image, config.brand?.favicon, config.brand?.ogImage, config.brand?.logoImage];
  for (const u of delConfig) {
    if (!u || /^(https?:)?\/\//.test(u)) continue;
    const rel = buscar(u);
    if (rel) await registrar(rel);
  }

  const resolvedor = {
    url(u) {
      if (!u) return null;
      if (/^(https?:)?\/\//.test(u) || String(u).startsWith('data:')) return u;
      if (String(u).startsWith('img/')) return u;           // ya publicada (fotos asociadas)
      const rel = buscar(u);
      return rel ? publicadas.get(rel) || null : null;
    },
    size: (web) => tamanos.get(web) || null,
  };

  async function copiar(salida) {
    for (const [rel, web] of publicadas) {
      const destino = join(salida, web);
      await mkdir(dirname(destino), { recursive: true });
      await copyFile(join(dir, fuentes.get(rel) || rel), destino);
    }
  }

  return {
    dir, resolvedor, copiar,
    reporte: { fotos: fotos.length, asociadas, ambiguas, sinProducto, repetidas, pesadas, publicadas: publicadas.size },
  };
}
