/**
 * ============================================================
 *  CANIBAL XPRESS  --  datos del restaurante
 * ============================================================
 *  Este archivo es todo lo que cambia entre un restaurante y otro.
 *
 *  Para crear uno nuevo:
 *    1. Copia este archivo con el nombre del restaurante:
 *         restaurantes/mi-restaurante.mjs
 *    2. Edita "config" (marca, colores, sedes, textos) y "menu" (la carta)
 *    3. Opcional: pon sus imagenes en restaurantes/mi-restaurante/
 *       con las mismas rutas que declares aqui (ej. images/hero.jpg)
 *    4. Genera:  npm run build mi-restaurante
 *
 *  PENDIENTES DE CONFIRMAR CON EL CLIENTE (marcados con REVISAR):
 *    - Ciudad de la sede
 *    - Horario de atencion
 *    - Enlace de Google Maps y coordenadas
 *    - Costo del domicilio
 *    - Dominio definitivo
 *    - Facebook (si tienen)
 */

export const config = {
  // ---------- IMAGENES ----------
  // Carpeta con las imagenes, relativa a la raiz del proyecto.
  //   Logo/        el logo
  //   Productos/   una foto por producto, nombrada como el producto
  //                (ej. "Hawaiana.jpg", "Salchipapa Caníbal.png").
  //                Si un nombre se repite entre categorias, usa una
  //                subcarpeta: Productos/Pizzas/Ranchera.jpg
  imagenes: 'Imagenes',

  // Fotos cuyo nombre de archivo no alcanza para saber a que producto van.
  // La clave es el nombre del archivo, sin extension.
  // REVISAR: estas dos muestran el mismo pan largo en dos tamaños. Por la
  // carta corresponden al Perro Caníbal (35 cm y 75 cm). Si en realidad son
  // el Sándwich Caníbal, cambia 'pr8' por 'sw4'.
  fotos: {
    'Medio canibal': { producto: 'pr8', tamanio: 'Medio' },
    'Canibal grande': { producto: 'pr8', tamanio: 'Grande' },
    // el producto pasó a llamarse "Agua saborizada 280 ml"
    'agua saborizada personal': { producto: 'bd2' },
  },

  // ---------- IDENTIDAD ----------
  brand: {
    name: 'Caníbal Xpress',
    // El logo se arma con dos partes para el efecto bicolor del navbar
    logoPrimary: 'CANIBAL',
    logoAccent: 'Xpress',
    tagline: 'Más que un deleite, una verdadera sensación',
    claim: 'Pizzas · Picadas · Parrilla',
    description:
      'Pizzas de 30 cm, picadas para compartir, perros, hamburguesas y todo a la parrilla. Activos desde 2009 en Betania.',
    logoImage: 'Logo/logo-web.png',
    favicon: '/brand/favicon.ico',
    ogImage: '/brand/og.jpg',
  },

  // ---------- TEMA VISUAL ----------
  // Tomado de las piezas graficas: negro, verde lima y dorado.
  theme: {
    mode: 'dark',
    accent: '#8cc63f', // verde lima del logo
    accentDark: '#6b9e2a',
    accentSecondary: '#f2b705', // dorado de los marcos del menu
    accentSecondaryLight: '#ffd24a',
    background: '#0a0a0a',
    surface1: '#121212',
    surface2: '#191919',
    surface3: '#232323',
    surface4: '#2e2e2e',
    textPrimary: '#f7f7f5',
    textSecondary: '#b5b5ae',
    textMuted: '#6f6f68',
    fontDisplay: '"Bebas Neue", sans-serif',
    fontHeading: '"Montserrat", sans-serif',
    fontBody: '"Inter", sans-serif',
    // URL de Google Fonts acorde a las 3 familias de arriba
    fontsUrl:
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap',
  },

  // ---------- CONTACTO Y CONVERSION ----------
  contact: {
    whatsapp: '573023024133', // formato internacional sin + ni espacios
    whatsappMessage: 'Hola Caníbal Xpress! Quiero hacer un pedido',
    phone: '3023024133',
    email: '',
    instagram: 'https://instagram.com/canibalxpress',
    facebook: '', // REVISAR: confirmar si tienen Facebook
    tiktok: '',
    // Boton flotante de WhatsApp. Apagado a proposito: es un atajo para
    // escribir sin armar el pedido, y asi llega sin productos ni total.
    // El cliente pasa por el carrito y llega a WhatsApp con todo listo.
    botonFlotante: false,
  },

  // ---------- SEDES ----------
  sedes: [
    {
      id: 'sede_betania',
      slug: 'betania',
      nombre: 'Caníbal Xpress Betania',
      direccion: 'Cra 16B # 6-33, Betania',
      ciudad: '', // REVISAR: confirmar ciudad
      barrio: 'Betania',
      telefono: '3023024133',
      whatsapp: '573023024133',
      // Horario de atencion. Cada dia lleva sus franjas en formato 24 horas.
      // Lista vacia = cerrado ese dia. Se pueden poner dos franjas si algun
      // dia cierran al mediodia: mie: [['12:00','15:00'], ['18:00','22:30']]
      // El texto que ve el cliente se arma solo con estos datos.
      horarios: {
        dom: [['18:00', '23:30']],
        lun: [['18:00', '23:30']],
        mar: [], // cerrado
        mie: [['18:00', '23:30']],
        jue: [['18:00', '23:30']],
        vie: [['18:00', '23:30']],
        sab: [['18:00', '23:30']],
      },
      // Dias sueltos cerrados, para festivos o cierres puntuales (AAAA-MM-DD)
      cerradoEn: [],
      lat: 0, // REVISAR: coordenadas para el mapa
      lng: 0,
      mapsUrl: '', // REVISAR: enlace de Google Maps del local
      tarifaDomicilio: 0, // REVISAR: costo del domicilio
      activa: true,
    },
  ],

  // ---------- NAVEGACION ----------
  // El sitio es de una sola pagina: los enlaces son anclas a las secciones.
  // Secciones disponibles: #inicio #destacados #menu #nosotros #domicilios #contacto
  nav: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Menú', href: '#menu' },
    { label: 'Destacados', href: '#destacados' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ],
  navCta: { label: 'Pedir Ahora', href: '#menu' },

  // ---------- CONTENIDO DE LA LANDING ----------
  home: {
    hero: {
      eyebrow: 'Activos desde 2009',
      titleLines: ['Más que', 'un deleite', 'una sensación'],
      description:
        'Pizzas de 30 cm, picadas hasta para cinco, perros de 75 centímetros y todo lo que sale de la parrilla. Pide a domicilio en Betania.',
      // logo-web.png es el logo original con el fondo negro quitado y recortado
      image: 'Logo/logo-web.png',
      imageFit: 'logo', // 'logo' = sin marco | 'foto' = recuadro con borde
      primaryCta: { label: 'Ver Menú', href: '#menu' },
      // Boton secundario. Sin etiqueta no aparece, para dejar un solo
      // camino: ver el menu y armar el pedido en el carrito.
      secondaryCta: { label: '', href: '' },
      // Cifras bajo el titulo. Con la lista vacia no se muestran.
      // Para volver a activarlas: { value: '2009', label: 'Activos desde' }
      stats: [],
    },
    // Franja de tres ventajas con icono. Con la lista vacia no aparece.
    // Para volver a activarla: { icon: '', title: '', desc: '' }
    perks: [],
    // Seccion de recomendados. Los productos que salen aqui son los que
    // llevan "destacado: true" en la carta, en el orden de la carta.
    // No sale de ventas reales: la pagina no registra pedidos.
    destacados: {
      eyebrow: 'La casa recomienda',
      title: 'Nuestros',
      titleAccent: 'recomendados',
      lead: 'Si es tu primera vez, empieza por aquí.',
      cta: { label: 'Ver menú completo', href: '#menu' },
    },
    about: {
      eyebrow: 'Nuestra historia',
      title: 'Más que un deleite, una verdadera sensación',
      body: [
        'Llevamos desde 2009 en Betania cocinando lo que a la gente del barrio le gusta: parrilla al carbón, picadas para la mesa entera y pizza que alcanza para dos.',
        'Nada sale de la cocina hasta que queda como lo pediríamos nosotros. Esa es toda la fórmula.',
      ],
      image: 'Logo/logo-web.png',
      imageFit: 'logo', // 'logo' = logo centrado | 'foto' = foto que llena el recuadro
      floatCard: { value: '2009', label: 'Activos desde' },
    },
    delivery: {
      eyebrow: 'Domicilios',
      title: 'Te lo llevamos',
      titleAccent: 'caliente',
      // Lleva al menu, no a WhatsApp: el pedido se arma en el carrito
      cta: { label: 'Hacer mi pedido', href: '#menu' },
      cards: [
        {
          icon: '🛵',
          title: 'Domicilios disponibles',
          desc: 'Arma tu pedido en el menú y te lo despachamos desde Betania.',
        },
        {
          icon: '💳',
          title: 'Cualquier método de pago',
          desc: 'Efectivo, tarjeta o transferencia.',
        },
        {
          icon: '📞',
          title: 'Atención directa',
          desc: 'Llámanos al 302 302 4133 y armamos tu pedido.',
        },
      ],
    },
  },

  // ---------- COMPORTAMIENTO DEL MENU ----------
  menu: {
    // Nombre de la categoria que usa el flujo especial de tamaños
    // (Pizzas, Hamburguesas dobles, etc). null = sin tamaños.
    sizedCategory: null,
    // Permite armar producto mitad y mitad (tipico de pizzas)
    enableHalfAndHalf: false,
    enableSearch: true,
    enableSedeTabs: true,
    currency: 'COP',
    locale: 'es-CO',
  },

  // ---------- CARRITO ----------
  carrito: {
    // Sugerencias dentro del carrito: productos de esta categoria que el
    // cliente todavia no lleva. Deja categoria en null para no sugerir nada.
    sugerir: { categoria: 'Bebidas', titulo: '¿Algo para tomar?', max: 8 },
  },

  // ---------- CHECKOUT ----------
  checkout: {
    // 'whatsapp' abre WhatsApp con el pedido armado | 'api' envia a /api/pedido
    mode: 'whatsapp',
    // Sin nombres de bancos: solo el medio. El primero queda preseleccionado.
    metodosPago: ['Efectivo', 'Tarjeta', 'Transferencia'],
    pideDireccion: true,
    permiteRecoger: true,
  },

  // ---------- SEO ----------
  seo: {
    siteUrl: 'https://canibalxpress.com', // REVISAR: dominio definitivo
    titleTemplate: '%s | Caníbal Xpress',
    defaultTitle: 'Caníbal Xpress | Más que un deleite, una verdadera sensación',
    keywords: [
      'comida rápida Betania',
      'pizza a domicilio',
      'picadas para compartir',
      'salchipapa',
      'perros calientes',
      'hamburguesas',
      'Caníbal Xpress',
    ],
  },

  footer: {
    legalLinks: [
      { label: 'Política de privacidad', href: '/legal/privacidad' },
      { label: 'Términos y condiciones', href: '/legal/terminos' },
    ],
    credit: { label: '', href: '' },
  },
};

/**
 * CARTA DE CANIBAL XPRESS
 *
 * Transcrita de las piezas graficas del restaurante.
 * Precios en enteros, sin puntos: 21000 = $21.000
 *
 * Reglas del template:
 *  - `tamanios` -> el producto abre el selector de tamaño
 *  - `grupos`   -> el producto abre el modal de personalizacion
 *  - el boton "+" agrega de una; tocar la tarjeta abre la ficha
 *
 * QUE LLEVA CADA PRODUCTO
 * Agrega `ingredientes` al producto y en la ficha aparece un bloque
 * titulado "Qué lleva". Si el campo no esta, el bloque no se muestra.
 *
 *   ingredientes: 'Carne de res 150g, queso cheddar, lechuga y tomate.',
 *
 * Para varios parrafos, separa con un salto de linea:
 *
 *   ingredientes: 'Primer parrafo.\n\nSegundo parrafo.',
 *
 * `descripcion` es la linea corta que se ve en la tarjeta;
 * `ingredientes` es el texto largo que solo se ve al abrir la ficha.
 */


const CAT = {
  pizzas: 'cat_pizzas',
  hamburguesas: 'cat_hamburguesas',
  salchipapas: 'cat_salchipapas',
  perros: 'cat_perros',
  picadas: 'cat_picadas',
  burritos: 'cat_burritos',
  chuzoDesgranado: 'cat_chuzo_desgranado',
  mazorca: 'cat_mazorca',
  chuzoPan: 'cat_chuzo_pan',
  arepaPicada: 'cat_arepa_picada',
  sandwichs: 'cat_sandwichs',
  pinchos: 'cat_pinchos',
  asados: 'cat_asados',
  bebidas: 'cat_bebidas',
};

/** Adicionales de pizza, tal como aparecen en la carta */
const adicionalesPizza = {
  id: 'grp_adic_pizza',
  titulo: 'Adicionales',
  min: 0,
  max: 6,
  opciones: [
    { id: 'ad_pimenton', nombre: 'Pimentón 100g', precio: 1000 },
    { id: 'ad_cebolla', nombre: 'Cebolla 100g', precio: 1000 },
    { id: 'ad_chongo', nombre: 'Chongo 100g', precio: 1000 },
    { id: 'ad_chorizo', nombre: 'Chorizo (unidad)', precio: 1500 },
    { id: 'ad_costeno', nombre: 'Queso costeño 100g', precio: 2400 },
    { id: 'ad_pina', nombre: 'Piña', precio: 3000 },
    { id: 'ad_tartara', nombre: 'Tártara', precio: 3000 },
    { id: 'ad_maiz', nombre: 'Maíz dulce 100g', precio: 3000 },
    { id: 'ad_ranchera', nombre: 'Ranchera (unidad)', precio: 4000 },
    { id: 'ad_pollo', nombre: 'Pollo 100g', precio: 4600 },
    { id: 'ad_mozarella', nombre: 'Queso mozarella 100g', precio: 4600 },
    { id: 'ad_suiza', nombre: 'Suiza (unidad)', precio: 8000 },
    { id: 'ad_carne', nombre: 'Carne 100g', precio: 9000 },
  ],
};

/*
 * Sabores de bebida. Son obligatorios y no cambian el precio. Con
 * 'reparto' el cliente pide varias unidades y las reparte entre sabores
 * (ej: 2 Uva + 1 Kola); cada sabor llega como una linea del pedido.
 */
/* El chuzo desgranado se sirve con bollo o con papas: el cliente elige uno. */
const acompChuzoDesgranado = {
  id: 'grp_acomp_desgranado',
  titulo: '¿Con bollo o papas?',
  min: 1,
  max: 1,
  opciones: [
    { id: 'acd_bollo', nombre: 'Bollo', precio: 0, incluida: true },
    { id: 'acd_papas', nombre: 'Papas', precio: 0 },
  ],
};

const saboresPostobon = {
  id: 'grp_sabor_postobon',
  titulo: 'Elige el sabor',
  min: 1,
  max: 1,
  reparto: true,
  opciones: [
    { id: 'pb_kola', nombre: 'Kola', precio: 0, incluida: true },
    { id: 'pb_manzana', nombre: 'Manzana', precio: 0 },
    { id: 'pb_naranja', nombre: 'Naranja', precio: 0 },
    { id: 'pb_uva', nombre: 'Uva', precio: 0 },
    { id: 'pb_colombiana', nombre: 'Colombiana', precio: 0 },
  ],
};

const saboresHit = {
  id: 'grp_sabor_hit',
  titulo: 'Elige el sabor',
  min: 1,
  max: 1,
  reparto: true,
  opciones: [
    { id: 'hit_mora', nombre: 'Mora', precio: 0, incluida: true },
    { id: 'hit_mango', nombre: 'Mango', precio: 0 },
    { id: 'hit_tropical', nombre: 'Tropical', precio: 0 },
    { id: 'hit_naranja_pina', nombre: 'Naranja piña', precio: 0 },
  ],
};

export const menu = {
  actualizadoEn: '2026-09-17',
  tamanios: [],
  sized: [],
  categorias: [
    /* ==================== PIZZAS ==================== */
    {
      categoria: {
        id: CAT.pizzas,
        nombre: 'Pizzas',
        descripcion: 'Pizza small de 30 cm · 8 pedazos para dos personas',
        orden: 0,
        emoji: '🍕',
      },
      items: [
        { id: 'pz1', nombre: 'Napolitana', descripcion: 'Salsa napolitana, queso mozarella y orégano.', precio: 21000, categoriaId: CAT.pizzas, etiquetas: [], orden: 0, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz2', nombre: 'Salami', descripcion: 'Salami, queso mozarella y salsa de la casa.', precio: 23000, categoriaId: CAT.pizzas, etiquetas: [], orden: 1, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz3', nombre: 'Butifarra', descripcion: 'Butifarra, queso mozarella y salsa de la casa.', precio: 23000, categoriaId: CAT.pizzas, etiquetas: [], orden: 2, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz4', nombre: 'Pollo', descripcion: 'Pollo desmechado y queso mozarella.', precio: 23000, categoriaId: CAT.pizzas, etiquetas: [], orden: 3, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz5', nombre: 'Hawaiana', descripcion: 'Jamón, piña y queso mozarella.', precio: 24000, categoriaId: CAT.pizzas, etiquetas: [], orden: 4, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz6', nombre: 'Jamón y queso', descripcion: 'Jamón y doble queso mozarella.', precio: 25000, categoriaId: CAT.pizzas, etiquetas: [], orden: 5, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz7', nombre: 'Chorizo', descripcion: 'Chorizo, queso mozarella y salsa de la casa.', precio: 26000, categoriaId: CAT.pizzas, etiquetas: [], orden: 6, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz8', nombre: 'Peperoni', descripcion: 'Peperoni y queso mozarella.', precio: 26000, categoriaId: CAT.pizzas, etiquetas: [], orden: 7, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz9', nombre: 'Pollo con pimentón', descripcion: 'Pollo desmechado, pimentón y queso mozarella.', precio: 26000, categoriaId: CAT.pizzas, etiquetas: [], orden: 8, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz10', nombre: 'Pollo con champiñón', descripcion: 'Pollo desmechado, champiñones y queso mozarella.', precio: 26000, categoriaId: CAT.pizzas, etiquetas: [], orden: 9, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz11', nombre: 'Con bocadillo', descripcion: 'Bocadillo y queso mozarella, el dulce de la casa.', precio: 26000, categoriaId: CAT.pizzas, etiquetas: [], orden: 10, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz12', nombre: 'Tocineta', descripcion: 'Tocineta crocante y queso mozarella.', precio: 31000, categoriaId: CAT.pizzas, etiquetas: [], orden: 11, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz13', nombre: 'Ciruela con tocineta', descripcion: 'Ciruela, tocineta y queso mozarella.', precio: 31000, categoriaId: CAT.pizzas, etiquetas: [], orden: 12, disponible: true, grupos: [adicionalesPizza] },
        { id: 'pz14', nombre: 'Ranchera', descripcion: 'Salchicha ranchera y queso mozarella.', precio: 32000, categoriaId: CAT.pizzas, etiquetas: [], orden: 13, disponible: true, grupos: [adicionalesPizza] },
        {
          id: 'pz15',
          nombre: 'Súper Caníbal',
          descripcion:
            'Jamón, chorizo, butifarra, pollo, tocineta, peperoni, salami, maíz, pimentón y cebolla.',
          precio: 49000,
          categoriaId: CAT.pizzas,
          // pendiente: texto de lo que lleva, aparece como 'Qué lleva' en la ficha
          ingredientes: '',
          etiquetas: ['La más cargada'],
          orden: 14,
          disponible: true,
          grupos: [adicionalesPizza],
        },
      ],
    },

    /* ==================== HAMBURGUESAS ==================== */
    {
      categoria: { id: CAT.hamburguesas, nombre: 'Hamburguesas', orden: 1, emoji: '🍔' },
      items: [
        { id: 'hb1', nombre: 'Hamburguesa de carne', descripcion: 'Carne de res, queso y vegetales frescos.', precio: 18000, categoriaId: CAT.hamburguesas, etiquetas: [], orden: 0, disponible: true },
        { id: 'hb2', nombre: 'Hamburguesa de pollo', descripcion: 'Pechuga de pollo, queso y vegetales frescos.', precio: 18000, categoriaId: CAT.hamburguesas, etiquetas: [], orden: 1, disponible: true },
        { id: 'hb3', nombre: 'Apanada de pollo', descripcion: 'Pollo apanado crocante, queso y vegetales.', precio: 18000, categoriaId: CAT.hamburguesas, etiquetas: [], orden: 2, disponible: true },
        { id: 'hb4', nombre: 'Doble carne', descripcion: 'Doble carne de res, queso y vegetales frescos.', precio: 26000, categoriaId: CAT.hamburguesas, etiquetas: [], orden: 3, disponible: true },
        { id: 'hb5', nombre: 'Doble apanada de pollo', descripcion: 'Doble pollo apanado, queso y vegetales.', precio: 26000, categoriaId: CAT.hamburguesas, etiquetas: [], orden: 4, disponible: true },
        {
          id: 'hb6',
          nombre: 'Hamburguesa Caníbal',
          descripcion: 'Carne, pollo, doble jamón, queso mozarella y tocineta.',
          precio: 27000,
          categoriaId: CAT.hamburguesas,
          etiquetas: ['La de la casa'],
          orden: 5,
          disponible: true,
          destacado: true,
        },
      ],
    },

    /* ==================== SALCHIPAPAS ==================== */
    {
      categoria: { id: CAT.salchipapas, nombre: 'Salchipapas', orden: 2, emoji: '🍟' },
      items: [
        { id: 'sp1', nombre: 'Porción de papa', descripcion: 'Papa a la francesa.', precio: 7000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 0, disponible: true },
        { id: 'sp2', nombre: 'Salchipapa sencilla', descripcion: 'Papa a la francesa con salchicha.', precio: 15000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 1, disponible: true },
        { id: 'sp3', nombre: 'Butipapa', descripcion: 'Papa a la francesa con butifarra.', precio: 16000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 2, disponible: true },
        { id: 'sp4', nombre: 'Choripapa', descripcion: 'Papa a la francesa con chorizo.', precio: 17000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 3, disponible: true },
        { id: 'sp5', nombre: 'Papipollo', descripcion: 'Papa a la francesa con pollo.', precio: 19000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 4, disponible: true },
        { id: 'sp6', nombre: 'Salchipollo', descripcion: 'Papa a la francesa con salchicha y pollo.', precio: 19000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 5, disponible: true },
        { id: 'sp7', nombre: 'Mixta', descripcion: 'Pollo, chorizo y butifarra.', precio: 20000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 6, disponible: true },
        { id: 'sp8', nombre: 'Suiza', descripcion: 'Papa a la francesa con salchicha suiza.', precio: 21000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 7, disponible: true },
        { id: 'sp9', nombre: 'Ranchera', descripcion: 'Papa a la francesa con salchicha ranchera.', precio: 21000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 8, disponible: true },
        { id: 'sp10', nombre: 'Ranchipollo', descripcion: 'Papa a la francesa con ranchera y pollo.', precio: 22000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 9, disponible: true },
        { id: 'sp11', nombre: 'Pollo-suiza', descripcion: 'Papa a la francesa con pollo y salchicha suiza.', precio: 26000, categoriaId: CAT.salchipapas, etiquetas: [], orden: 10, disponible: true },
        {
          id: 'sp12',
          nombre: 'Salchipapa Caníbal',
          descripcion: 'Pollo, chorizo, butifarra, salchicha sencilla, queso, lechuga y chongo.',
          precio: 22000,
          categoriaId: CAT.salchipapas,
          etiquetas: ['Para compartir'],
          orden: 11,
          disponible: true,
          tamanios: [
            { nombre: 'Personal', precio: 22000, porciones: 1 },
            { nombre: 'Mediana', precio: 35000, porciones: 2 },
            { nombre: 'Grande', precio: 48000, porciones: 3 },
            { nombre: 'Grande', codigo: '4P', precio: 58000, porciones: 4 },
            { nombre: 'Grande', codigo: '5P', precio: 70000, porciones: 5 },
          ],
        },
      ],
    },

    /* ==================== PERROS ==================== */
    {
      categoria: { id: CAT.perros, nombre: 'Perros', orden: 3, emoji: '🌭' },
      items: [
        { id: 'pr1', nombre: 'Perro sencillo', descripcion: 'Salchicha, salsas y papa ripio.', precio: 9000, categoriaId: CAT.perros, etiquetas: [], orden: 0, disponible: true },
        { id: 'pr2', nombre: 'Butiperro', descripcion: 'Butifarra, salsas y papa ripio.', precio: 10000, categoriaId: CAT.perros, etiquetas: [], orden: 1, disponible: true },
        { id: 'pr3', nombre: 'Choriperro', descripcion: 'Chorizo, salsas y papa ripio.', precio: 11000, categoriaId: CAT.perros, etiquetas: [], orden: 2, disponible: true },
        { id: 'pr4', nombre: 'Perro ranchero', descripcion: 'Salchicha ranchera, salsas y papa ripio.', precio: 13000, categoriaId: CAT.perros, etiquetas: [], orden: 3, disponible: true },
        { id: 'pr5', nombre: 'Perro combinado', descripcion: 'Pollo, chorizo y butifarra.', precio: 16000, categoriaId: CAT.perros, etiquetas: [], orden: 4, disponible: true },
        { id: 'pr6', nombre: 'Perro suizo', descripcion: 'Salchicha suiza, salsas y papa ripio.', precio: 16000, categoriaId: CAT.perros, etiquetas: [], orden: 5, disponible: true },
        { id: 'pr7', nombre: 'Ítalo-suizo', descripcion: 'Salchicha italiana y suiza con salsas de la casa.', precio: 18000, categoriaId: CAT.perros, etiquetas: [], orden: 6, disponible: true },
        {
          id: 'pr8',
          nombre: 'Perro Caníbal',
          descripcion: 'Ranchera, pollo, chorizo, butifarra sencilla, queso mozzarella y tocineta.',
          precio: 25000,
          categoriaId: CAT.perros,
          etiquetas: ['Hasta 75 cm'],
          orden: 7,
          disponible: true,
          destacado: true,
          tamanios: [
            { nombre: 'Medio', codigo: '35 cm', precio: 25000 },
            { nombre: 'Grande', codigo: '75 cm', precio: 42000 },
          ],
        },
      ],
    },

    /* ==================== PICADAS ==================== */
    {
      categoria: {
        id: CAT.picadas,
        nombre: 'Picadas',
        descripcion: 'Con verduras salteadas de pimentón y cebolla',
        orden: 4,
        emoji: '🍢',
      },
      items: [
        {
          id: 'pi1',
          nombre: 'Picada Caníbal',
          descripcion:
            'Carne, pollo, chorizo, butifarras, manguera, papa francesa y queso, con verduras salteadas.',
          precio: 26000,
          categoriaId: CAT.picadas,
          etiquetas: ['Para compartir'],
          orden: 0,
          disponible: true,
          destacado: true,
          tamanios: [
            { nombre: 'Personal', precio: 26000, porciones: 1 },
            { nombre: 'Mediana', precio: 40000, porciones: 2 },
            { nombre: 'Grande', precio: 55000, porciones: 3 },
            { nombre: 'Grande', codigo: '4P', precio: 65000, porciones: 4 },
            { nombre: 'Grande', codigo: '5P', precio: 77000, porciones: 5 },
          ],
        },
      ],
    },

    /* ==================== BURRITOS ==================== */
    {
      categoria: { id: CAT.burritos, nombre: 'Burritos', orden: 5, emoji: '🌯' },
      items: [
        { id: 'bu1', nombre: 'Burrito de pollo', descripcion: 'Pollo, queso y vegetales en tortilla de trigo.', precio: 18000, categoriaId: CAT.burritos, etiquetas: [], orden: 0, disponible: true },
        { id: 'bu2', nombre: 'Burrito combinado', descripcion: 'Pollo, chorizo y butifarra.', precio: 19000, categoriaId: CAT.burritos, etiquetas: [], orden: 1, disponible: true },
        { id: 'bu3', nombre: 'Burrito pollo ranchera', descripcion: 'Pollo y salchicha ranchera con queso.', precio: 21000, categoriaId: CAT.burritos, etiquetas: [], orden: 2, disponible: true },
        { id: 'bu4', nombre: 'Burrito Caníbal', descripcion: 'Carne, pollo, chorizo, butifarra y tocineta.', precio: 21000, categoriaId: CAT.burritos, etiquetas: [], orden: 3, disponible: true },
      ],
    },

    /* ==================== CHUZO DESGRANADO ==================== */
    {
      categoria: { id: CAT.chuzoDesgranado, nombre: 'Chuzo desgranado', orden: 6, emoji: '🌽' },
      items: [
        { id: 'cd1', nombre: 'Chuzo desgranado de pollo', descripcion: 'Pollo, maíz, queso y salsas de la casa.', precio: 21000, categoriaId: CAT.chuzoDesgranado, etiquetas: [], orden: 0, disponible: true, grupos: [acompChuzoDesgranado] },
        { id: 'cd2', nombre: 'Chuzo desgranado Caníbal', descripcion: 'Pollo, chorizo, butifarra y tocineta.', precio: 22000, categoriaId: CAT.chuzoDesgranado, etiquetas: [], orden: 1, disponible: true, grupos: [acompChuzoDesgranado] },
        { id: 'cd3', nombre: 'Chuzo desgranado combinado', descripcion: 'Pollo, chorizo y butifarra.', precio: 23000, categoriaId: CAT.chuzoDesgranado, etiquetas: [], orden: 2, disponible: true, grupos: [acompChuzoDesgranado] },
        { id: 'cd4', nombre: 'Chuzo desgranado pollo ranchera', descripcion: 'Pollo y salchicha ranchera con maíz y queso.', precio: 25000, categoriaId: CAT.chuzoDesgranado, etiquetas: [], orden: 3, disponible: true, grupos: [acompChuzoDesgranado] },
      ],
    },

    /* ==================== MAZORCA DESGRANADA ==================== */
    {
      categoria: { id: CAT.mazorca, nombre: 'Mazorca desgranada', orden: 7, emoji: '🌽' },
      items: [
        { id: 'md1', nombre: 'Mazorca desgranada de pollo', descripcion: 'Maíz tierno, pollo, queso y salsas.', precio: 20000, categoriaId: CAT.mazorca, etiquetas: [], orden: 0, disponible: true },
        { id: 'md2', nombre: 'Mazorca desgranada combinada', descripcion: 'Pollo, chorizo y butifarra.', precio: 21000, categoriaId: CAT.mazorca, etiquetas: [], orden: 1, disponible: true },
        { id: 'md3', nombre: 'Mazorca desgranada pollo ranchera', descripcion: 'Pollo y salchicha ranchera con maíz y queso.', precio: 22000, categoriaId: CAT.mazorca, etiquetas: [], orden: 2, disponible: true },
        { id: 'md4', nombre: 'Mazorca desgranada Caníbal', descripcion: 'Pollo, chorizo, butifarra y tocineta.', precio: 23000, categoriaId: CAT.mazorca, etiquetas: [], orden: 3, disponible: true },
      ],
    },

    /* ==================== CHUZO PAN ==================== */
    {
      categoria: { id: CAT.chuzoPan, nombre: 'Chuzo pan', orden: 8, emoji: '🥖' },
      items: [
        { id: 'cp1', nombre: 'Chuzo pan de butifarra', descripcion: 'Butifarra en pan con salsas de la casa.', precio: 16000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 0, disponible: true },
        { id: 'cp2', nombre: 'Chuzo pan de chorizo', descripcion: 'Chorizo en pan con salsas de la casa.', precio: 17000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 1, disponible: true },
        { id: 'cp3', nombre: 'Chuzo pan de pollo', descripcion: 'Pollo en pan con salsas de la casa.', precio: 19000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 2, disponible: true },
        { id: 'cp4', nombre: 'Chuzo pan mixto', descripcion: 'Pollo, chorizo y butifarra en pan.', precio: 20000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 3, disponible: true },
        { id: 'cp5', nombre: 'Chuzo pan ranchera', descripcion: 'Salchicha ranchera en pan con salsas.', precio: 20000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 4, disponible: true },
        { id: 'cp6', nombre: 'Chuzo pan pollo ranchera', descripcion: 'Pollo y salchicha ranchera en pan.', precio: 22000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 5, disponible: true },
        { id: 'cp7', nombre: 'Chuzo pan Caníbal', descripcion: 'Pollo, chorizo, butifarra y tocineta.', precio: 24000, categoriaId: CAT.chuzoPan, etiquetas: [], orden: 6, disponible: true },
      ],
    },

    /* ==================== AREPA PICADA ==================== */
    {
      categoria: { id: CAT.arepaPicada, nombre: 'Arepa picada', orden: 9, emoji: '🫓' },
      items: [
        { id: 'ap1', nombre: 'Arepa picada de butifarra', descripcion: 'Arepa con butifarra, queso y salsas.', precio: 16000, categoriaId: CAT.arepaPicada, etiquetas: [], orden: 0, disponible: true },
        { id: 'ap2', nombre: 'Arepa picada de chorizo', descripcion: 'Arepa con chorizo, queso y salsas.', precio: 17000, categoriaId: CAT.arepaPicada, etiquetas: [], orden: 1, disponible: true },
        { id: 'ap3', nombre: 'Arepa picada ranchera', descripcion: 'Arepa con salchicha ranchera y queso.', precio: 19000, categoriaId: CAT.arepaPicada, etiquetas: [], orden: 2, disponible: true },
        { id: 'ap4', nombre: 'Arepa picada mixta', descripcion: 'Pollo, chorizo y butifarra.', precio: 21000, categoriaId: CAT.arepaPicada, etiquetas: [], orden: 3, disponible: true },
        { id: 'ap5', nombre: 'Arepa picada pollo ranchera', descripcion: 'Pollo y salchicha ranchera con queso.', precio: 22000, categoriaId: CAT.arepaPicada, etiquetas: [], orden: 4, disponible: true },
        { id: 'ap6', nombre: 'Arepa picada Caníbal', descripcion: 'Pollo, chorizo, butifarra y tocineta.', precio: 23000, categoriaId: CAT.arepaPicada, etiquetas: [], orden: 5, disponible: true },
      ],
    },

    /* ==================== SANDWICHS ==================== */
    {
      categoria: { id: CAT.sandwichs, nombre: 'Sándwiches', orden: 10, emoji: '🥪' },
      items: [
        { id: 'sw1', nombre: 'Sándwich de jamón', descripcion: 'Jamón, queso y vegetales frescos.', precio: 11000, categoriaId: CAT.sandwichs, etiquetas: [], orden: 0, disponible: true },
        { id: 'sw2', nombre: 'Sándwich de pollo', descripcion: 'Pollo, queso y vegetales frescos.', precio: 16000, categoriaId: CAT.sandwichs, etiquetas: [], orden: 1, disponible: true },
        { id: 'sw3', nombre: 'Sándwich combinado', descripcion: 'Pollo, jamón, queso y tocineta.', precio: 17000, categoriaId: CAT.sandwichs, etiquetas: [], orden: 2, disponible: true },
        {
          id: 'sw4',
          nombre: 'Sándwich Caníbal',
          descripcion: 'Pollo, chorizo, butifarra, manguera, queso mozarella y tocineta.',
          precio: 25000,
          categoriaId: CAT.sandwichs,
          etiquetas: [],
          orden: 3,
          disponible: true,
          tamanios: [
            { nombre: 'Medio', precio: 25000 },
            { nombre: 'Grande', precio: 40000 },
          ],
        },
      ],
    },

    /* ==================== PINCHOS ==================== */
    {
      categoria: { id: CAT.pinchos, nombre: 'Pinchos', orden: 11, emoji: '🍡' },
      items: [
        { id: 'pn1', nombre: 'Pincho de chorizo', descripcion: 'Chorizo a la parrilla con salsas.', precio: 14000, categoriaId: CAT.pinchos, etiquetas: [], orden: 0, disponible: true },
        { id: 'pn2', nombre: 'Pincho de butifarra', descripcion: 'Butifarra a la parrilla con salsas.', precio: 14000, categoriaId: CAT.pinchos, etiquetas: [], orden: 1, disponible: true },
        { id: 'pn3', nombre: 'Pincho combinado', descripcion: 'Pollo, chorizo y butifarra.', precio: 15000, categoriaId: CAT.pinchos, etiquetas: [], orden: 2, disponible: true },
        { id: 'pn4', nombre: 'Pincho de pollo', descripcion: 'Pollo a la parrilla con salsas.', precio: 20000, categoriaId: CAT.pinchos, etiquetas: [], orden: 3, disponible: true },
      ],
    },

    /* ==================== ASADOS ==================== */
    {
      categoria: { id: CAT.asados, nombre: 'Asados', orden: 12, emoji: '🍗' },
      items: [
        { id: 'as1', nombre: 'Pechuga asada', descripcion: 'Pechuga de pollo a la parrilla.', precio: 23000, categoriaId: CAT.asados, etiquetas: [], orden: 0, disponible: true },
        { id: 'as2', nombre: 'Pechuga gratinada', descripcion: 'Pechuga de pollo gratinada con queso.', precio: 27000, categoriaId: CAT.asados, etiquetas: [], orden: 1, disponible: true },
        { id: 'as3', nombre: 'Asado Caníbal', descripcion: 'El asado de la casa, cargado y a la parrilla.', precio: 30000, categoriaId: CAT.asados, etiquetas: [], orden: 2, disponible: true },
      ],
    },

    /* ==================== BEBIDAS ==================== */
    {
      categoria: { id: CAT.bebidas, nombre: 'Bebidas', orden: 13, emoji: '🥤' },
      items: [
        { id: 'bd1', nombre: 'Agua botella cristal', descripcion: 'Agua sin gas.', precio: 2500, categoriaId: CAT.bebidas, etiquetas: [], orden: 0, disponible: true },
        { id: 'bd2', nombre: 'Agua saborizada 280 ml', descripcion: 'Agua saborizada sabor manzana, botella de 280 ml.', precio: 3000, categoriaId: CAT.bebidas, etiquetas: [], orden: 1, disponible: true },
        { id: 'bd3', nombre: 'Postobón personal', descripcion: 'Gaseosa personal. Elige el sabor.', precio: 4000, categoriaId: CAT.bebidas, etiquetas: [], orden: 2, disponible: true, grupos: [saboresPostobon] },
        { id: 'bd4', nombre: 'Coca-Cola personal', descripcion: 'Gaseosa personal.', precio: 4500, categoriaId: CAT.bebidas, etiquetas: [], orden: 3, disponible: true },
        { id: 'bd5', nombre: 'Jugo Hit personal', descripcion: 'Jugo personal. Elige el sabor.', precio: 4500, categoriaId: CAT.bebidas, etiquetas: [], orden: 4, disponible: true, grupos: [saboresHit] },
        { id: 'bd6', nombre: 'Postobón econolitro', descripcion: 'Gaseosa para compartir. Elige el sabor.', precio: 5500, categoriaId: CAT.bebidas, etiquetas: [], orden: 5, disponible: true, grupos: [saboresPostobon] },
        { id: 'bd7', nombre: 'Postobón 1.25 L', descripcion: 'Gaseosa familiar. Elige el sabor.', precio: 7000, categoriaId: CAT.bebidas, etiquetas: [], orden: 6, disponible: true, grupos: [saboresPostobon] },
        { id: 'bd8', nombre: 'Coca-Cola 1.25 L', descripcion: 'Gaseosa familiar.', precio: 9000, categoriaId: CAT.bebidas, etiquetas: [], orden: 7, disponible: true },
      ],
    },
  ],
};
