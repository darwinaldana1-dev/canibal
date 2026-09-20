#!/usr/bin/env node
/**
 * Servidor de previsualizacion de los sitios generados.
 *   node builder/serve.mjs <restaurante> [puerto]
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const nombre = process.argv[2];
const puerto = Number(process.argv[3]) || 4000;

if (!nombre) {
  console.error('\n  Uso: node builder/serve.mjs <restaurante> [puerto]\n');
  process.exit(1);
}

const base = join(RAIZ, 'sites', nombre);
if (!existsSync(base)) {
  console.error(`\n  No existe sites/${nombre}. Genéralo primero:`);
  console.error(`  node builder/build.mjs ${nombre}\n`);
  process.exit(1);
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.avif': 'image/avif',
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  // normalize evita salir de la carpeta del sitio
  const rel = normalize(url === '/' ? '/index.html' : url).replace(/^(\.\.[/\\])+/, '');
  const file = join(base, rel);

  if (!file.startsWith(base)) {
    res.writeHead(403).end('Prohibido');
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
  }
}).listen(puerto, () => {
  console.log(`\n  ${nombre}  ->  http://localhost:${puerto}\n`);
});
