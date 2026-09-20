# Generador de páginas para restaurantes

Un archivo de datos entra, una carpeta con tres archivos sale. Sin framework,
sin dependencias en el sitio final, sin Node en el servidor.

```
restaurantes/canibal-xpress.mjs   ->   sites/canibal-xpress/
                                         index.html
                                         styles.css
                                         app.js
```

---

## El proceso completo

### 1. Crea el archivo del restaurante

Copia uno que ya exista y cámbiale el nombre. El nombre del archivo define la
carpeta de salida.

```bash
cp restaurantes/canibal-xpress.mjs restaurantes/mi-restaurante.mjs
```

Ese archivo exporta dos cosas:

- `config` con marca, colores, sedes, contacto y los textos de la landing.
- `menu` con las categorías y los productos.

Es lo único que editas. Cambiar `theme.accent` reprograma toda la paleta,
porque el color viaja como variable CSS a botones, precios, bordes y halos.

### 2. Genera el sitio

```bash
npm run build mi-restaurante
```

Te dice cuánto pesa cada archivo y qué datos quedaron sin completar antes de
publicar.

### 3. Míralo

```bash
npm run serve mi-restaurante
```

Abre `http://localhost:4000`. Para otro puerto, agrégalo al final.

### 4. Publícalo

Sube el contenido de `sites/mi-restaurante/` a donde sea. Netlify, Vercel,
GitHub Pages, un hosting compartido con cPanel, un bucket de S3. Son archivos
estáticos, así que funciona en cualquier parte y no hay nada que mantener
corriendo.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run build <nombre>` | Genera un sitio |
| `npm run build:todos` | Genera todos los de `restaurantes/` |
| `npm run serve <nombre> [puerto]` | Previsualiza un sitio generado |

---

## Peso

Lo que realmente descarga el visitante, ya comprimido:

| Archivo | Sin comprimir | Comprimido |
|---|---|---|
| index.html | 70.5 KB | 9.3 KB |
| styles.css | 28.1 KB | 6.1 KB |
| app.js | 19.8 KB | 6.1 KB |
| **Total** | **118.4 KB** | **21.2 KB** |

Eso con 86 productos en 14 categorías ya escritos dentro del HTML. Una página
con menos platos pesa menos.

---

## Imágenes

El campo `imagenes` del archivo del restaurante dice en qué carpeta están sus
imágenes, relativa a la raíz del proyecto. Si no se indica, se usa
`restaurantes/<nombre>/`.

```
Imagenes/
  Logo/logo-web.png          el logo, referenciado desde el config
  Productos/Hawaiana.jpg     una foto por producto
  Productos/Pizzas/Ranchera.jpg
```

**Fotos de productos.** Nómbralas igual que el producto y el generador las
asocia solo. La comparación es por palabras, sin tildes ni mayúsculas, así que
`burrito pollo.jpg` encuentra "Burrito de pollo". Si dos categorías tienen un
producto con el mismo nombre, pon la foto en una subcarpeta con la categoría.
Al generar, la consola lista qué fotos se asociaron y cuáles no.

**Fotos por tamaño.** Si el producto tiene tamaños, agrega el tamaño al nombre
del archivo: `Salchipapa Canibal 2P.jpg` es la de dos personas. En el menú se
muestra la foto del tamaño que el cliente elija.

**Cuando el nombre no alcanza**, declara la excepción en el campo `fotos` del
archivo del restaurante, apuntando al id del producto y al tamaño.

**Optimiza siempre antes de publicar.** Las fotos de celular pesan varios megas
y harían la página lentísima:

```bash
npm run optimizar          # Imagenes/ -> Imagenes/web/, máximo 900px
npm run build canibal-xpress
```

Los originales no se tocan. El generador publica la versión de `web/` cuando
existe, y conserva el original si la versión reducida no pesa menos. En este
proyecto, 17 fotos pasaron de 35,7 MB a 2,8 MB.

Solo se publican las imágenes que la página usa, con nombres limpios para la
web, dentro de `img/`. Los originales pesados se quedan en tu carpeta.

Las fotos también pueden ir por URL en el campo `imagenUrl` de cada ítem, útil
cuando ya están en un CDN. Una URL explícita gana sobre la foto de la carpeta.

Sin imagen, cada tarjeta muestra un recuadro con la inicial del producto. La
página se ve terminada desde el primer día.

---

## Horario de atención

Cada sede lleva sus franjas por día en el campo `horarios`, en formato de 24
horas. Un día con la lista vacía está cerrado. Se pueden poner dos franjas si
algún día cierran al mediodía.

Fuera de horario, la página muestra un aviso con la hora de apertura y bloquea
el envío del pedido. El cliente puede seguir viendo la carta y armando el
carrito, que queda guardado para cuando abran.

La hora se lee en la zona del restaurante, no en la del teléfono del cliente,
así que un reloj mal puesto o un visitante en otro país no rompen el horario.
Si la página queda abierta, el estado se actualiza solo a la hora de apertura.

El texto del horario que ve el cliente se arma con esas mismas franjas, igual
que los datos que lee Google, así que no pueden contradecirse.

Para festivos o cierres puntuales, agrega la fecha a `cerradoEn` sin tocar el
horario normal.

Es un freno, no un candado: la página no tiene servidor, así que alguien con
conocimientos técnicos podría saltárselo.

---

## Cómo se comporta el menú

- Un producto con `tamanios` abre el selector de tamaño.
- Un producto con `grupos` abre el modal de personalización, con mínimos y
  máximos por grupo.
- Un producto sin ninguno de los dos entra al carrito de un clic.

El carrito guarda el pedido en el navegador, así que sobrevive a un refresco.
El checkout arma el pedido como texto y abre WhatsApp con el mensaje listo.

Todo el menú se escribe dentro del HTML al generar, así que Google y WhatsApp
ven los platos y los precios sin ejecutar JavaScript. El JSON al final del HTML
solo alimenta los modales y el carrito.

---

## Estructura del proyecto

```
restaurantes/          un archivo .mjs por restaurante     <- EDITAS AQUÍ
builder/
  build.mjs            el generador
  serve.mjs            servidor de previsualización
  templates/
    html.mjs           estructura y contenido
    css.mjs            todo el diseño
    js.mjs             carrito, modales, búsqueda, checkout
sites/                 salida generada, no se edita a mano
```

Para cambiar el diseño de todos los restaurantes a la vez, tocas
`builder/templates/`. Para cambiar uno solo, tocas su archivo en
`restaurantes/`.

---

## Sin instalación

El proyecto no tiene dependencias. No hay `npm install`, no hay
`node_modules/`, no hay nada que actualizar. Solo necesitas Node 18 o superior
para correr el generador, y ni siquiera eso para el sitio publicado.

La carpeta `sites/` está en el `.gitignore` porque se reconstruye con
`npm run build`. Lo que se versiona es el archivo de datos del restaurante y
las plantillas.
