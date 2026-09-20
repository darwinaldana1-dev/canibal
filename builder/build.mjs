#!/usr/bin/env node
/**
 * GENERADOR DE SITIOS
 *
 *   node builder/build.mjs <restaurante>
 *   node builder/build.mjs --todos
 *
 * Lee restaurantes/<nombre>.mjs y escribe sites/<nombre>/ con
 * index.html, styles.css y app.js. Nada mas.
 */

import { readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildHtml } from './templates/html.mjs';
import { buildCss } from './templates/css.mjs';
import { buildJs } from './templates/js.mjs';
import { prepararImagenes } from './imagenes.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR_REST = join(RAIZ, 'restaurantes');
const DIR_OUT = join(RAIZ, 'sites');

const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + ' KB';

async function listar() {
  const files = await readdir(DIR_REST);
  return files.filter((f) => f.endsWith('.mjs')).map((f) => f.replace(/\.mjs$/, ''));
}

/** Avisa de datos sin completar antes de publicar */
function revisar(cfg, img) {
  const avisos = [];
  const sede = cfg.sedes.find((s) => s.activa);

  if (!sede) avisos.push('no hay ninguna sede activa');
  if (sede && !sede.ciudad) avisos.push('falta la ciudad de la sede');
  if (sede && !sede.horario) avisos.push('falta el horario de atención');
  if (sede && !sede.mapsUrl) avisos.push('falta el enlace de Google Maps');
  if (sede && !sede.tarifaDomicilio) avisos.push('la tarifa de domicilio está en cero');
  if (!cfg.contact.whatsapp) avisos.push('falta el número de WhatsApp');
  if (cfg.seo.siteUrl.includes('ejemplo')) avisos.push('el dominio sigue siendo de ejemplo');

  // imagenes declaradas en el config que todavia no existen
  const faltan = [
    ['foto del inicio', cfg.home.hero.image],
    ['foto de nosotros', cfg.home.about.image],
    ['favicon', cfg.brand.favicon],
    ['imagen para redes', cfg.brand.ogImage],
  ].filter(([, p]) => p && !img.url(p)).map(([n]) => n);
  if (faltan.length) avisos.push(`sin imagen todavía: ${faltan.join(', ')} (se muestra un recuadro con la inicial)`);

  return avisos;
}

async function generar(nombre) {
  // El nombre termina en una ruta que se borra y se recrea: solo se aceptan
  // nombres simples, sin barras ni "..", para no salir nunca de sites/
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(nombre)) {
    throw new Error(`Nombre no válido: "${nombre}". Usa letras, números y guiones, como canibal-xpress`);
  }
  const archivo = join(DIR_REST, `${nombre}.mjs`);
  if (!existsSync(archivo)) {
    throw new Error(`No existe restaurantes/${nombre}.mjs`);
  }

  const mod = await import(pathToFileURL(archivo).href);
  if (!mod.config || !mod.menu) {
    throw new Error(`${nombre}.mjs debe exportar "config" y "menu"`);
  }
  const config = mod.config;
  // copia: asociar fotos no debe tocar los datos originales
  const menu = structuredClone(mod.menu);

  const imagenes = await prepararImagenes({ raiz: RAIZ, dirRestaurante: join(DIR_REST, nombre), config, menu });

  const html = buildHtml(config, menu, imagenes.resolvedor);
  const css = buildCss(config);
  const js = buildJs();

  // La salida se regenera completa: asi no quedan archivos viejos
  const salida = join(DIR_OUT, nombre);
  await rm(salida, { recursive: true, force: true });
  await mkdir(salida, { recursive: true });
  await imagenes.copiar(salida);
  await writeFile(join(salida, 'index.html'), html, 'utf8');
  await writeFile(join(salida, 'styles.css'), css, 'utf8');
  await writeFile(join(salida, 'app.js'), js, 'utf8');

  const productos = menu.categorias.reduce((a, c) => a + c.items.length, 0);
  const total = [html, css, js].reduce((a, s) => a + Buffer.byteLength(s, 'utf8'), 0);
  const r = imagenes.reporte;

  console.log(`\n  ${config.brand.name}  ->  sites/${nombre}/`);
  console.log(`  ${menu.categorias.length} categorías · ${productos} productos`);
  console.log(`    index.html   ${kb(html)}`);
  console.log(`    styles.css   ${kb(css)}`);
  console.log(`    app.js       ${kb(js)}`);
  console.log(`    total        ${(total / 1024).toFixed(1)} KB  (sin contar imágenes)`);

  console.log(`\n  Imágenes: ${r.publicadas} publicadas · fotos de productos ${r.asociadas.length}/${productos}`);
  r.asociadas.forEach((a) => console.log(`    ok  ${a}`));
  if (r.ambiguas.length) {
    console.log('  Fotos con nombre repetido, ponlas en una subcarpeta con la categoría (Productos/Pizzas/...):');
    r.ambiguas.forEach((a) => console.log(`    ?   ${a}`));
  }
  if (r.sinProducto.length) {
    console.log('  Fotos que no coinciden con ningún producto, revisa el nombre del archivo:');
    r.sinProducto.forEach((a) => console.log(`    x   ${a}`));
  }
  if (r.repetidas.length) {
    console.log('  Fotos sobrantes, el producto ya tenía una:');
    r.repetidas.forEach((a) => console.log(`    =   ${a}`));
  }
  if (r.pesadas.length) {
    console.log('  Imágenes pesadas, conviene reducirlas para que la página cargue rápido:');
    r.pesadas.forEach((a) => console.log(`    !   ${a}`));
  }

  const avisos = revisar(config, imagenes.resolvedor);
  if (avisos.length) {
    console.log(`\n  Antes de publicar, revisa:`);
    avisos.forEach((a) => console.log(`    - ${a}`));
  }
  return { nombre, total };
}

async function main() {
  const arg = process.argv[2];

  if (!arg || arg === '--ayuda' || arg === '-h') {
    const disponibles = await listar();
    console.log('\n  Uso:  node builder/build.mjs <restaurante>');
    console.log('        node builder/build.mjs --todos\n');
    console.log('  Restaurantes disponibles:');
    disponibles.forEach((d) => console.log(`    - ${d}`));
    console.log('');
    return;
  }

  const objetivos = arg === '--todos' ? await listar() : [arg];
  if (!objetivos.length) {
    console.log('  No hay restaurantes en restaurantes/');
    return;
  }

  for (const nombre of objetivos) await generar(nombre);
  console.log('');
}

main().catch((err) => {
  console.error(`\n  Error: ${err.message}\n`);
  process.exit(1);
});
