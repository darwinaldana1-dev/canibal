#!/usr/bin/env node
/**
 * Copia un sitio generado a docs/, que es la carpeta que publica GitHub Pages.
 *
 *   npm run publicar canibal-xpress
 *
 * sites/ se regenera y por eso no va al repositorio; docs/ si va, porque es
 * lo que GitHub sirve. Este paso deja las dos en sincronia.
 */

import { rm, mkdir, cp, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const nombre = process.argv[2];

if (!nombre || !/^[a-z0-9][a-z0-9-]*$/i.test(nombre)) {
  console.error('\n  Uso: npm run publicar <restaurante>\n');
  process.exit(1);
}

const origen = join(RAIZ, 'sites', nombre);
if (!existsSync(origen)) {
  console.error(`\n  No existe sites/${nombre}. Genéralo primero:  npm run build ${nombre}\n`);
  process.exit(1);
}

const docs = join(RAIZ, 'docs');
await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });
await cp(origen, docs, { recursive: true });
// .nojekyll: le dice a GitHub que sirva los archivos tal cual
await writeFile(join(docs, '.nojekyll'), '');

const cuenta = async (dir) => {
  let n = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? await cuenta(join(dir, e.name)) : 1;
  }
  return n;
};

console.log(`\n  sites/${nombre}/  ->  docs/   (${await cuenta(docs)} archivos)`);
console.log('  Ahora: git add docs && git commit && git push\n');
