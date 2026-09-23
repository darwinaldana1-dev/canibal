#!/usr/bin/env node
/**
 * Publica la pagina con las fotos y los datos que haya ahora mismo.
 *
 *   npm run actualizar canibal-xpress
 *   npm run actualizar canibal-xpress "Foto nueva de la pizza"
 *
 * Hace, en orden, lo mismo que se haria a mano:
 *   1. optimiza las imagenes de Imagenes/ (las nuevas o cambiadas)
 *   2. genera el sitio en sites/<restaurante>
 *   3. lo copia a docs/, que es lo que publica GitHub Pages
 *   4. guarda el cambio en el repositorio y lo sube
 *
 * Si no hay nada nuevo, avisa y no sube nada.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const nombre = process.argv[2];
const mensaje = process.argv[3] || 'Actualiza fotos y datos del menu';

if (!nombre || !/^[a-z0-9][a-z0-9-]*$/i.test(nombre)) {
  console.error('\n  Uso: npm run actualizar <restaurante> ["mensaje"]\n');
  process.exit(1);
}
if (!existsSync(join(RAIZ, 'restaurantes', `${nombre}.mjs`))) {
  console.error(`\n  No existe restaurantes/${nombre}.mjs\n`);
  process.exit(1);
}

const correr = (cmd, args, { silencioso = false } = {}) => {
  const r = spawnSync(cmd, args, {
    cwd: RAIZ,
    stdio: silencioso ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
  });
  if (!silencioso && r.status !== 0) {
    console.error(`\n  Se detuvo: fallo "${cmd} ${args.join(' ')}"\n`);
    process.exit(1);
  }
  return r;
};

const paso = (n, texto) => console.log(`\n[${n}/4] ${texto}`);

paso(1, 'Optimizando las imagenes nuevas…');
if (process.platform === 'win32') {
  correr('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'builder/optimizar.ps1']);
} else {
  console.log('  (el optimizador solo corre en Windows; se usan las imagenes tal cual)');
}

paso(2, 'Generando la pagina…');
correr(process.execPath, ['builder/build.mjs', nombre]);

paso(3, 'Copiando a docs/ …');
correr(process.execPath, ['builder/publicar.mjs', nombre]);

paso(4, 'Subiendo los cambios a GitHub…');
const estado = correr('git', ['status', '--porcelain'], { silencioso: true });
if (!estado.stdout.trim()) {
  console.log('\n  No habia nada nuevo que subir: la pagina ya estaba al dia.\n');
  process.exit(0);
}

// la identidad va en el propio comando: asi no hace falta configurar git
const QUIEN = ['-c', 'user.name=darwinaldana1-dev', '-c', 'user.email=darwinaldana1@gmail.com'];
correr('git', ['add', '-A']);
correr('git', [...QUIEN, 'commit', '-q', '-m', mensaje]);
const push = correr('git', ['push', 'origin', 'HEAD'], { silencioso: true });
if (push.status !== 0) {
  console.error('\n  El cambio quedo guardado, pero no se pudo subir a GitHub:');
  console.error('  ' + (push.stderr || '').trim().split('\n').slice(-3).join('\n  '));
  console.error('\n  Revisa la conexion a internet y vuelve a correr el comando.\n');
  process.exit(1);
}

console.log(`
  Listo. La pagina se actualizo.

  https://darwinaldana1-dev.github.io/canibal/

  GitHub tarda entre 1 y 3 minutos en mostrarla. Si ves la foto vieja,
  recarga la pagina de nuevo o abrela en una pestaña nueva.
`);
