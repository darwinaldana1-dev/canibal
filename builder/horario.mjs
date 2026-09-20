/**
 * Horario de atencion.
 *
 * Convierte las franjas del archivo del restaurante en dos cosas:
 *  - los datos que usa la pagina para saber si esta abierta ahora
 *  - el texto que lee el cliente, armado solo, para que nunca se
 *    contradiga con el horario real
 *
 * El indice de los dias sigue la convencion de JavaScript: 0 = domingo.
 */

const CLAVES = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
const CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** "18:00" -> 1080 minutos desde medianoche */
function aMinutos(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
  if (!m) throw new Error(`Hora no valida: "${hhmm}". Usa formato 24 horas, como 18:00`);
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 24 || min > 59) throw new Error(`Hora fuera de rango: "${hhmm}"`);
  return h * 60 + min;
}

/** 1080 -> "6:00 pm" */
export function aTexto(min) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const suf = h < 12 ? 'am' : 'pm';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suf}`;
}

/** Los siete dias como franjas en minutos. Devuelve null si no hay horario. */
export function aDatos(horarios) {
  if (!horarios) return null;
  return CLAVES.map((clave) => (horarios[clave] || []).map(([ini, fin]) => {
    const a = aMinutos(ini), b = aMinutos(fin);
    if (a === b) throw new Error(`La franja ${ini}-${fin} no dura nada`);
    return [a, b]; // si b < a, la franja cruza la medianoche
  }));
}

/**
 * Texto para el cliente, agrupando dias seguidos con el mismo horario.
 * Empieza en lunes, que es como se lee un horario en el aviso de un local.
 *   "Lun 6:00 pm a 10:30 pm · Mar cerrado · Mié y Jue ... · Vie a Dom ..."
 */
export function aResumen(dias) {
  if (!dias) return '';
  const orden = [1, 2, 3, 4, 5, 6, 0]; // lunes primero
  const firma = (i) => (dias[i].length
    ? dias[i].map(([a, b]) => `${aTexto(a)} a ${aTexto(b)}`).join(' y ')
    : 'cerrado');

  const grupos = [];
  for (const i of orden) {
    const f = firma(i);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.firma === f) ultimo.dias.push(i);
    else grupos.push({ firma: f, dias: [i] });
  }

  return grupos.map(({ firma: f, dias: ds }) => {
    const etiqueta = ds.length === 1 ? CORTOS[ds[0]]
      : ds.length === 2 ? `${CORTOS[ds[0]]} y ${CORTOS[ds[1]]}`
        : `${CORTOS[ds[0]]} a ${CORTOS[ds[ds.length - 1]]}`;
    return f === 'cerrado' ? `${etiqueta} cerrado` : `${etiqueta} ${f}`;
  }).join(' · ');
}

/** Formato que entiende Google para los datos estructurados de la sede */
export function aSchema(dias) {
  if (!dias) return [];
  const iso = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const out = [];
  dias.forEach((franjas, i) => {
    for (const [a, b] of franjas) {
      const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      out.push(`${iso[i]} ${hhmm(a)}-${hhmm(b)}`);
    }
  });
  return out;
}
