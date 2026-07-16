// site.ts — SSoT (Single Source of Truth) de mosquitero.mx
// ============================================================================
// FUENTE ÚNICA DE VERDAD. Todo dato que aparezca en más de una página vive aquí:
// identidad, contacto (NAP), taxonomías y mensajes de WhatsApp. Nada de esto se
// hardcodea en componentes ni páginas — se importa desde este archivo.
//
// CONTRATO CANÓNICO (interoperable con lib/seo.ts, layouts y componentes):
//   • src/lib/seo.ts  → SITE.seo, SITE.locale, SITE.organization, SITE.business,
//                        SITE.social, SITE.searchUrl, SITE.trailingSlash,
//                        SITE.allowSelfReviews, CONTACT.phoneRaw.
//   • componentes     → PRODUCT_CATEGORIES, SERVICES, SECTORS, COVERAGE_STATES,
//                        SITE.tagline, CONTACT.schedule, WA_MESSAGES.cotizar/.cotizacion.
// Respetar las claves EXACTAS: renombrar una rompe el JSON-LD o el chrome.
//
// ⚠️ SCAFFOLD INICIAL. Todo lo marcado con `TODO:` es un PLACEHOLDER y NO es un
// dato real del negocio. Reemplázalo con el dato verificado del cliente antes de
// publicar. Regla dura OrigenLab: CERO contenido fabricado (sin teléfonos,
// direcciones, precios, reseñas ni clientes inventados).
// ============================================================================

// ── SITE — identidad de marca + SEO + organización + negocio local ───────────
export const SITE = {
  name: 'Mosquitero.mx', // Nombre comercial corto.
  brand: 'MOSQUITERO', // Marca para títulos/footer/logo.
  tagline: 'Mosquiteros a medida: fabricación e instalación', // TODO: validar frase con el cliente.
  domain: 'mosquitero.mx',
  url: 'https://mosquitero.mx', // URL canónica con protocolo, SIN slash final.
  lang: 'es-MX',
  locale: 'es-MX',
  description:
    'Mosquiteros a medida para ventanas y puertas: fabricación, instalación y reparación. Cotiza tu mosquitero por WhatsApp con medidas y tiempo de entrega.', // 140–160 chars · abre con kw1, teje las 3 keywords.
  defaultImage: '/images/og/default.svg', // TODO: reemplazar por OG real 1200×630.

  // ── COLOR DE MARCA — fuente única del HEX ────────────────────────────────
  // TODO: color de marca real de mosquitero.mx. Hoy es el índigo heredado del
  // template, NO la marca. Al cambiarlo hay que tocar los TRES sitios de abajo.
  //
  // Por qué existe esta clave: el hex vive en 3 lugares que NO pueden leerse
  // entre sí — CSS, JSON estático y TS:
  //   1. src/styles/tokens.css      → --c-primary (y --c-primary-rgb, su canal RGB)
  //   2. public/site.webmanifest    → "theme_color" (JSON estático, sin build step)
  //   3. AQUÍ                       → lo lee BaseLayout para <meta name="theme-color">
  // El (3) existía antes como `content="var(--color-primary)"` escrito a mano en
  // BaseLayout: un var() de CSS NO resuelve dentro de un <meta>, así que el
  // navegador lo ignoraba y la barra del navegador en móvil nunca se pintó.
  // Ahora sale de aquí. Los 3 hex deben coincidir; no hay forma de garantizarlo
  // en build sin un generador de tokens, así que queda como contrato escrito.
  themeColor: '#5b3df5',

  // ── GATE DE LANZAMIENTO ─────────────────────────────────────────────────
  // noindexAll: true → TODA página emite `robots: noindex, nofollow`.
  // ⚠️ CORREGIDO 2026-07-14: este comentario decía que el sitio "se despliega en
  // mosquitero.pages.dev". Era FALSO — nadie lo había comprobado. `mosquitero.mx`
  // resuelve (Cloudflare) y SIRVE ESTE SITIO: es público ahora mismo. O sea que
  // esto no es una precaución sobre un staging, es lo único que separa a Google
  // de 29 páginas que muestran `TODO: 55 0000 0000` (203 veces), 8 enlaces a un
  // wa.me inventado por página, y un `geo: 0,0` (Null Island, frente a África)
  // en el JSON-LD de LocalBusiness. Que Google indexe eso es peor que no tener
  // sitio: contenido placeholder posicionado bajo la marca real, y una entidad
  // de negocio local anclada a una coordenada del Golfo de Guinea.
  //
  // ⚠️ PONER EN false SOLO CUANDO: (1) no quede ningún `TODO:` vivo en este
  // archivo, y (2) el cliente haya validado el contenido marcado 🟠 en
  // docs/PROCEDENCIA.md. La antigua condición (3) «el dominio real apunta al
  // sitio» YA ESTÁ CUMPLIDA — era la que la gente asumía pendiente.
  // Checklist accionable con lo que falta: docs/GATE-LANZAMIENTO.md
  //
  // NOTA: NO se bloquea con `Disallow: /` en robots.txt a propósito. Bloquear el
  // rastreo impide que Google LEA la etiqueta noindex, y la URL puede acabar
  // indexada igual si alguien la enlaza. Para no indexar hay que DEJAR rastrear
  // y servir noindex. Los dos juntos se anulan.
  noindexAll: true,

  // Política de trailing slash. Debe coincidir con astro.config.mjs (canónico B5: 'never').
  trailingSlash: 'never' as 'never' | 'always',
  // searchUrl: si el sitio tiene buscador interno → WebSite SearchAction. Si no, undefined.
  searchUrl: undefined as string | undefined,
  // allowSelfReviews: gate de reseñas. DEFAULT false (Google penaliza self-serving).
  allowSelfReviews: false,

  // seo: defaults para <head>. Los consume lib/seo.ts (buildMeta/formatTitle/truncate).
  seo: {
    title: 'Mosquiteros a medida | mosquiteros para ventanas', // ≤60 chars. Fallback; la home lo genera con buildKeywordTitle(KEYWORDS).
    description:
      'Mosquiteros a medida para ventanas y puertas: fabricación, instalación y reparación. Cotiza tu mosquitero por WhatsApp con medidas y tiempo de entrega.',
    image: '/images/og/default.svg',
    titleMaxLength: 60,
    descriptionMaxLength: 160,
    appendBrand: false, // Regla OrigenLab: title sin marca.
  },

  // social: redes para JSON-LD sameAs + twitter:site. undefined = se omite.
  // TODO: agregar SOLO perfiles oficiales verificables del cliente.
  social: {
    twitter: undefined as string | undefined,
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    linkedin: undefined as string | undefined,
    youtube: undefined as string | undefined,
  },

  // organization: entidad publisher (JSON-LD Organization). Entidad raíz por @id.
  organization: {
    name: 'Mosquitero.mx',
    legalName: 'Mosquitero.mx', // TODO: razón social legal real.
    logo: '/images/brand/logo.svg', // TODO: logo real cuadrado para schema.
    foundingDate: undefined as string | undefined, // TODO: 'YYYY' real o dejar undefined.
    sameAs: [] as string[], // Solo perfiles oficiales verificables.
  },

  // business: negocio local (JSON-LD LocalBusiness).
  //
  // ⚠️ ESTO ES UN NEGOCIO DE ÁREA DE SERVICIO (service-area business), no una
  // tienda. Frank lo confirmó el 2026-07-14: en Insurgentes Sur 716 NO se atiende
  // al público — es domicilio de oficina, el contacto es por teléfono/WhatsApp y
  // el trabajo ocurre en casa del cliente (medición e instalación).
  //
  // Qué significa para el schema, y qué NO hacer:
  //   • `areaServed` (CDMX + Edomex) es el campo que de verdad describe a este
  //     negocio. Es lo que Google usa para decidir a quién le apareces.
  //   • `geo` va OMITIDO. Publicar coordenadas de una oficina donde no atiendes
  //     le diría a Google "ven aquí", que es falso.
  //   • La dirección se conserva por decisión de Frank ("solo pon la dirección").
  //     Es real y da confianza en el footer. Pero OJO 👇
  //
  // 🔴 SI SE CREA UN PERFIL DE GOOGLE BUSINESS: hay que marcarlo como negocio de
  // área de servicio y OCULTAR la dirección. Google suprime las fichas de SABs
  // que publican un domicilio donde no atienden, y Insurgentes Sur 716 es una
  // torre de oficinas: si otros negocios se dan de alta ahí, Google puede
  // conflictuar las entidades. Esto NO lo resuelve el sitio — es al dar de alta
  // la ficha. Ver docs/GATE-LANZAMIENTO.md.
  //
  // (El TODO original decía: "si NO hay sede física verificable, pon
  // `business: undefined`". No aplica: la dirección es REAL, solo que no es
  // customer-facing. Borrar LocalBusiness entero perdería el areaServed, que es
  // justo lo que este negocio sí puede declarar con verdad.)
  business: {
    type: 'LocalBusiness' as string | string[],
    priceRange: '$$',
    // Datos de Frank, 2026-07-14. Mapeo a schema.org PostalAddress para México:
    // la colonia va con la calle (no tiene campo propio), la ALCALDÍA es la
    // `locality` (equivale al municipio) y CDMX es la `region` (el estado).
    // ⚠️ SIN CONFIRMAR que sea sede física con atención al público. Ver el TODO
    // de arriba: si Insurgentes Sur 716 es oficina, domicilio fiscal o espacio
    // compartido, esto debe ser `business: undefined` — declarar LocalBusiness
    // donde no se atiende va contra las guías de Google y te suprime la ficha.
    address: {
      street: 'Av. Insurgentes Sur 716, Del Valle',
      locality: 'Benito Juárez',
      region: 'Ciudad de México',
      postalCode: '03300',
      country: 'MX',
    },
    // OMITIDO a propósito — ver el bloque de arriba. `undefined`, NO `0,0`:
    // buildSchema salta `geo` si es falsy (seo.ts:441). Con 0,0 le declarabas a
    // Google que el negocio está en Null Island, frente a África.
    geo: undefined as { lat: string | number; lng: string | number } | undefined,
    openingHours: {
      // 🟢 Confirmado por Frank el 2026-07-14.
      // ⚠️ BUG CORREGIDO el 2026-07-14: `saturday` estaba en `undefined` mientras
      // CONTACT.schedule mostraba "Sábado 9:00–14:00" en el footer y el TopBar.
      // O sea: la página decía que abres el sábado y el JSON-LD le decía a Google
      // que cierras. Google se cree el JSON-LD — un cliente que buscara "mosquiteros
      // abierto ahora" un sábado no te habría visto. Los dos bloques son espejo:
      // si cambias uno, cambia el otro. Domingo cerrado = simplemente no se declara.
      weekdays: { opens: '09:00', closes: '18:00' },
      saturday: { opens: '09:00', closes: '14:00' } as { opens: string; closes: string } | undefined,
    },
    // 🟢 Confirmado por Frank el 2026-07-14. ESTE es el campo que describe de
    // verdad a este negocio: no atiende en un local, va a casa del cliente. Es lo
    // que Google usa para decidir a quién le apareces. Si la cobertura cambia,
    // esto se cambia — no es decoración.
    areaServed: ['Ciudad de México', 'Estado de México'] as string[],
  },
} as const;

// ── KEYWORDS — las 3 palabras clave del sitio (regla keyword-first) ──────────
// kw1 = principal (va primero, sobrevive el truncado) · kw2 = secundaria ·
// kw3 = variante/long-tail. Title: "kw1 | kw2 | kw3" ≤60, sin marca ni relleno.
// Description: abre con kw1, teje kw2/kw3 natural, 140–160 chars.
// TODO: validar la tripleta contra volumen/intención real antes de escalar contenido.
export const KEYWORDS = [
  'mosquiteros a medida', // kw1 · principal
  'mosquiteros para ventanas', // kw2 · secundaria
  'instalación de mosquiteros', // kw3 · variante / long-tail
] as const;

// ── CONTACT — NAP (Name, Address, Phone) + geo + horario ─────────────────────
// ⚠️ TODOS los valores de abajo son PLACEHOLDERS. Reemplázalos por los datos
// reales del cliente. El sitio NO debe publicarse con un `TODO:` vivo.
export const CONTACT = {
  // Datos dados por Frank el 2026-07-14. 🟢 Verificados como "lo que dijo el
  // cliente"; NADIE los ha comprobado marcando el número ni yendo al domicilio.
  phone: '55 1005 3463', // Formato legible para mostrar.
  phoneE164: '+525510053463', // E.164 CON +, para <a href="tel:">.
  phoneRaw: '+525510053463', // E.164 CON +; lo consumen componentes y JSON-LD.
  // 🟢 Confirmado por Frank el 2026-07-14: el mismo número recibe WhatsApp.
  // De esto cuelga el CTA principal del sitio: 8 enlaces wa.me por página, el
  // botón flotante y la franja del hero.
  whatsapp: '525510053463', // E.164 SIN +, lo exige wa.me.
  email: 'ventas@mosquitero.mx',
  street: 'Av. Insurgentes Sur 716, Del Valle',
  city: 'Benito Juárez',
  state: 'Ciudad de México',
  postalCode: '03300',
  country: 'MX', // ISO 3166-1 alpha-2.
  // SIN COORDENADAS, a propósito (decisión de Frank, 2026-07-14: "solo pon la
  // dirección"). `undefined`, NO `0,0`: buildSchema omite `geo` si es falsy, así
  // que el JSON-LD sale sin GeoCoordinates y Google geocodifica la dirección por
  // su cuenta. Dejarlo en 0,0 habría publicado Null Island —un punto en el Golfo
  // de Guinea— como ubicación del negocio.
  // Si algún día hacen falta: Google Maps → clic derecho → copiar coordenadas.
  geo: undefined as { lat: number; lng: number } | undefined,
  // hours: fuente única del horario. 🟢 Confirmado por Frank el 2026-07-14.
  hours: {
    weekdays: 'Lun–Vie 9:00–18:00',
    saturday: 'Sáb 9:00–14:00',
    sunday: 'Dom Cerrado',
    // ⚠️ CORREGIDO 2026-07-14: `display` decía solo 'Lun–Vie 9:00–18:00' y se
    // comía el sábado. Lo pintan el TopBar y el Header —lo primero que ve
    // cualquiera— así que un cliente que entrara un sábado a las 11 leía
    // "Lun–Vie" y asumía cerrado, estando abierto. Mismo error que tenía el
    // JSON-LD con `saturday: undefined`: el horario real vivía en los campos de
    // abajo y el resumen lo contradecía. Si cambia el horario, cambia AQUÍ y en
    // `schedule` (abajo) y en SITE.business.openingHours. Son tres espejos.
    display: 'Lun–Vie 9:00–18:00 · Sáb 9:00–14:00',
  },
  // schedule: versión que consumen TopBar/Footer. Doble espacio "Día␣␣Horario"
  // (el Footer hace split('  ')). Espejo de `hours` con ese formato.
  schedule: {
    display: 'Lun–Vie 9:00–18:00 · Sáb 9:00–14:00',
    weekdays: 'Lun–Vie  9:00–18:00',
    saturday: 'Sábado  9:00–14:00',
    sunday: 'Domingo  Cerrado',
  },
} as const;

// ── DESTINOS DE CATÁLOGO Y SERVICIOS — un solo interruptor ───────────────────
// PROBLEMA QUE RESUELVEN (medido el 2026-07-14 sobre el HTML compilado):
// el sitio tenía **1.358 enlaces internos rotos** en 11 rutas. El mega-menú del
// Header repite los 7 tipos y los 4 servicios en CADA página, y ninguna de esas
// fichas existe: /productos/enrollables/, /servicios/fabricacion/, etc.
//
// Hasta que las fichas se escriban, esos enlaces apuntan al ANCLA del índice
// correspondiente (/productos#enrollables), que sí existe y sí tiene contenido.
// Es la opción honesta: no inventa fichas de un producto que nadie validó, y no
// manda al usuario ni a Google a un 404.
//
// ⚠️ POR QUÉ NO SE ESCRIBEN LAS FICHAS YA: una ficha por tipo tiene que decir
// materiales, mallas, acabados y de qué depende el precio. Nada de eso está
// validado (ver docs/GATE-LANZAMIENTO.md §3). Siete fichas clonando la misma
// frase con otro título son thin content: Google las trata como relleno y pesan
// en contra del dominio entero. Mejor un índice bueno que 7 fichas huecas.
//
// ✅ ACTUALIZADO EL MISMO DÍA. Frank confirmó que el negocio fabrica los 6 tipos
// y presta los 4 servicios, así que las fichas se escribieron y estas funciones
// ya apuntan a rutas reales. El interruptor cumplió su función: cambiar 2 líneas
// reapuntó el NAV, el mega-menú, el footer, RelatedLinks, las tarjetas de la home
// y el schema — sin tocar ninguno de esos archivos.
//
// Si mañana el cliente deja de ofrecer una línea: bórrala de TAXONOMY.categories
// (o de .services). Su ficha deja de generarse Y su enlace desaparece de todas
// partes. No hay que buscar hrefs a mano: por eso esto es una función.
// ⚠️ SIN BARRA FINAL. `trailingSlash: 'never'` (astro.config.mjs + SITE.trailingSlash):
// /productos es la URL canónica y /productos/ NO EXISTE — devuelve 404 en dev.
// Cloudflare redirige en producción, así que el bug se veía solo en local... y en
// las Search Console de cualquiera que rastreara. El 2026-07-14 el sitio emitía
// ~50 hrefs con barra, incluido el PRIMER botón del menú ("Mosquiteros" →
// /productos/): el menú llevaba a un 404.
// ⚠️ LA RUTA ES /mosquiteros, NO /productos (renombrada el 2026-07-14 por Frank).
// La URL debe decir lo mismo que el botón que lleva a ella: el menú dice
// "Mosquiteros", el H1 dice "Mosquiteros" y la keyword principal es "mosquiteros
// a medida" — tener /productos ahí era el único sitio del sitio que no lo decía.
// "productos" era vocabulario del template, no de este negocio: nadie busca
// "productos", buscan "mosquiteros".
// El nombre INTERNO se queda: la colección `productos` (content.config.ts),
// PRODUCT_CATEGORIES, ProductCard, ProductLayout y el `pageType="product"` del
// schema. Eso es taxonomía del código y no sale a la URL; renombrarlo sería
// tocar media base sin que el usuario note nada.
export const productoHref = (slug: string): string => `/mosquiteros/${slug}`;
export const servicioHref = (id: string): string => `/servicios/${id}`;
export const zonaHref = (slug: string): string => `/cobertura/${slug}`;

// ROUTES — las rutas fijas del sitio, en un solo sitio y SIN barra final.
// Existe porque '/mosquiteros' estaba escrito a mano en 14 archivos y cada uno
// podía (y podía no) llevar la barra. Un literal repetido 14 veces no es una
// ruta: es 14 oportunidades de divergir. Impórtalo en vez de escribir la cadena.
export const ROUTES = {
  home: '/',
  /** La L2 de catálogo. La URL dice `mosquiteros` porque eso dice el menú y eso
   *  es lo que se busca. La clave se llama `mosquiteros` a propósito: si se
   *  llamara `productos` volveríamos a tener dos vocabularios. */
  mosquiteros: '/mosquiteros',
  servicios: '/servicios',
  cobertura: '/cobertura',
  contacto: '/contacto',
  blog: '/blog',
} as const;

// ── TAXONOMY — categorías/servicios/zonas cerradas (as const) ────────────────
// Fuente única de navegación, footer y rutas. Cada `slug` DEBE coincidir con el
// `category` de las Content Collections (ver src/content.config.ts).
export const TAXONOMY = {
  // categories: catálogo de dominio (L2) — tipos de mosquitero.
  //
  // 🟢 VALIDADO por Frank el 2026-07-14: el negocio fabrica los 6 tipos y vende
  // accesorios/refacciones. Hasta esa fecha, `magneticos`, `fijos` y `accesorios`
  // llevaban un "TODO: validar con el cliente que ofrece esta línea" — el sitio
  // los describía como producto propio sin que nadie lo hubiera confirmado.
  //
  // ⚠️ QUÉ SIGNIFICA ESTE 🟢 Y QUÉ NO: significa que Frank confirmó que se
  // fabrican. NO significa que estén validados los materiales, los tipos de malla
  // que se manejan, los acabados ni de qué depende el precio — nada de eso se ha
  // preguntado. Por eso las fichas describen QUÉ resuelve cada tipo y EN QUÉ
  // ventana encaja (oficio general), y no inventan especificaciones.
  // Si una línea deja de ofrecerse: bórrala de aquí y desaparece de la home, del
  // mega-menú, del footer, del catálogo y su ficha deja de generarse.
  //
  // `desc` — una línea (≤ ~70 chars) para el mega-menú. Es el resumen del blurb
  // de SHOWCASE: misma promesa, versión corta. Si editas uno, revisa el otro.
  //
  // `icon` — NOMBRE del icono, no el SVG; el trazo vive en src/config/nav-icons.ts
  // y se resuelve con navIcon(). ⚠️ El MENÚ YA NO LO USA (el Header va sin
  // iconos, a propósito). Su único consumidor hoy es BlogSidebar.astro, en el
  // bloque de cross-sell "Tipos de mosquitero". Si algún día quitas ese bloque,
  // este campo se queda sin lector y se puede borrar junto con nav-icons.ts.
  categories: [
    { slug: 'enrollables', label: 'Enrollables', badge: undefined, href: productoHref('enrollables'),
      icon: 'enrollable', desc: 'La malla se recoge sola en su cajón: ventana libre.' },
    { slug: 'corredizos', label: 'Corredizos', badge: undefined, href: productoHref('corredizos'),
      icon: 'corredizo', desc: 'Corren sobre riel, sin obstruir el paso.' },
    { slug: 'abatibles', label: 'Abatibles', badge: undefined, href: productoHref('abatibles'),
      icon: 'abatible', desc: 'Se abren como puerta, con cierre automático.' },
    { slug: 'plisados', label: 'Plisados', badge: undefined, href: productoHref('plisados'),
      icon: 'plisado', desc: 'Acordeón retráctil para vanos amplios.' },
    { slug: 'magneticos', label: 'Magnéticos', badge: undefined, href: productoHref('magneticos'),
      icon: 'magnetico', desc: 'Cierre por imán: pasas y se vuelve a sellar.' },
    { slug: 'fijos', label: 'Fijos', badge: undefined, href: productoHref('fijos'),
      icon: 'fijo', desc: 'Marco fijo a la ventana: la opción más económica.' },
    { slug: 'accesorios', label: 'Accesorios y refacciones', badge: undefined, href: productoHref('accesorios'),
      icon: 'accesorio', desc: 'Malla, herrajes y perfiles de repuesto.' },
  ],
  // services: servicios ofrecidos. 🟢 Confirmado por Frank el 2026-07-14: presta los cuatro.
  services: [
    { id: 'fabricacion', label: 'Fabricación a medida', desc: 'Mosquiteros hechos a la medida exacta de tu ventana o puerta.' },
    { id: 'instalacion', label: 'Instalación', desc: 'Colocación profesional en ventanas, puertas y domos.' },
    { id: 'medicion', label: 'Medición a domicilio', desc: 'Visita para tomar medidas y recomendar el tipo correcto.' },
    { id: 'reparacion', label: 'Reparación y cambio de malla', desc: 'Cambio de tela, marcos y herrajes de mosquiteros existentes.' },
  ],
  // articleCategories: taxonomía del BLOG (presentación).
  //
  // REPARTO DE RESPONSABILIDAD — leer antes de tocar:
  //   • src/content.config.ts → `ARTICLE_CATEGORIES` = los SLUGS válidos. Es el
  //     enum de Zod: gobierna qué acepta el frontmatter y falla el build si un
  //     .mdx trae una categoría fuera de lista.
  //   • AQUÍ → cómo se PRESENTA cada slug: label humano y bajada. El enum no
  //     puede cargar esto (content.config.ts es contrato de datos, no de UI).
  //
  // ⚠️ Los `slug` de abajo son ESPEJO EXACTO de ARTICLE_CATEGORIES. Si agregas
  // una categoría, va en los DOS sitios o el blog la ignora (aquí) o el build
  // revienta (allá). El mismo pacto que categories ↔ PRODUCT_CATEGORIES.
  //
  // `desc` alimenta la meta description del archivo /blog/categoria/<slug> y la
  // columna derecha de su SectionHeading.
  articleCategories: [
    { slug: 'guias', label: 'Guías', desc: 'Cómo medir, cómo elegir y qué preguntar antes de encargar tu mosquitero.' },
    { slug: 'mantenimiento', label: 'Mantenimiento', desc: 'Limpieza, ajustes y reparaciones para que la pieza dure.' },
    { slug: 'tipos-de-malla', label: 'Tipos de malla', desc: 'Qué tela lleva cada caso: mascotas, sol, insecto pequeño o vista despejada.' },
    { slug: 'la-marca', label: 'Cómo trabajamos', desc: 'Nuestro criterio de oficio: cómo fabricamos, qué exigirle a un proveedor y de qué depende el precio.' },
    { slug: 'novedades', label: 'Novedades', desc: 'Avisos y cambios en el catálogo y en el servicio.' },
    { slug: 'general', label: 'General', desc: 'Temas del oficio que no caben en las otras categorías.' },
  ],
  // sectors: segmentos atendidos (residencial/comercial). Tipado explícito para
  // que Header/Footer puedan .map() sin que TS infiera `never` con `[]`.
  sectors: [] as readonly { slug: string; label: string }[], // TODO: definir si aplica.
  // coverageStates: cobertura geográfica. TODO: reemplazar por la cobertura real.
  coverageStates: [
    { slug: 'cdmx', label: 'CDMX', type: 'operativo' as 'operativo' | 'comercial' },
    { slug: 'edomex', label: 'Estado de México', type: 'comercial' as 'operativo' | 'comercial' },
  ],
} as const;

// ── Alias planos de TAXONOMY — contrato de componentes ───────────────────────
export const PRODUCT_CATEGORIES = TAXONOMY.categories;
export const SERVICES = TAXONOMY.services;
export const SECTORS = TAXONOMY.sectors;
export const COVERAGE_STATES = TAXONOMY.coverageStates;
// BLOG_CATEGORIES ≠ ARTICLE_CATEGORIES (content.config.ts). Nombres distintos A
// PROPÓSITO: aquélla es la lista de slugs que valida Zod; ésta es su presentación
// (label + desc). Si se llamaran igual, importar las dos en la misma página sería
// una colisión y acabaríamos con un `as any` para taparla.
export const BLOG_CATEGORIES = TAXONOMY.articleCategories;

export type ProductCategory = (typeof TAXONOMY.categories)[number];
export type Service = (typeof TAXONOMY.services)[number];
export type Sector = (typeof TAXONOMY.sectors)[number];
export type CoverageState = (typeof TAXONOMY.coverageStates)[number];
export type BlogCategory = (typeof TAXONOMY.articleCategories)[number];

/** Resuelve slug → label humano. Slug desconocido → el propio slug (nunca revienta). */
export const blogCategoryLabel = (slug?: string): string =>
  TAXONOMY.articleCategories.find((c) => c.slug === slug)?.label ?? slug ?? '';

// ── NAV — menú principal del Header (FUENTE ÚNICA: escritorio + móvil) ────────
// Header.astro itera ESTE array para generar los DOS menús y sus paneles.
// Para agregar/quitar/reordenar una entrada, edita SOLO este array.
// CONTRATO DE PANEL (lo consume Header.astro, no lo adivines):
//   sin `panel`        → enlace simple (Blog, Contacto).
//   panel: 'dropdown'  → tarjeta angosta, 1 columna. Para listas cortas (≤6).
//   panel: 'mega'      → panel ancho a todo el header, grid de tarjetas.
//                        Para el catálogo (7 categorías).
// TODOS los ítems de panel se pintan igual: label + desc. La diferencia entre
// mega y dropdown es el ANCHO, no la jerarquía (antes el mega mostraba solo
// labels y el dropdown label+desc: dos lenguajes en el mismo menú).
export type NavLink = { label: string; href: string; desc?: string };
export type NavItem = {
  label: string;
  href: string;
  panel?: 'mega' | 'dropdown';
  allLabel?: string;
  /** Bajada del panel: una línea que enmarca la sección. Solo la usa el mega. */
  intro?: string;
  items?: readonly NavLink[];
};
export const NAV: readonly NavItem[] = [
  {
    label: 'Mosquiteros',
    href: '/mosquiteros',
    panel: 'mega',
    allLabel: 'Ver catálogo completo',
    intro: 'Elige por tipo de mosquitero. Todos se fabrican a la medida de tu ventana o puerta.',
    items: PRODUCT_CATEGORIES.map((c) => ({ label: c.label, href: c.href, desc: c.desc })),
  },
  {
    label: 'Servicios',
    href: '/servicios',
    panel: 'dropdown',
    allLabel: 'Ver todos los servicios',
    items: SERVICES.map((s) => ({ label: s.label, href: servicioHref(s.id), desc: s.desc })),
  },
  {
    label: 'Cobertura',
    href: '/cobertura',
    panel: 'dropdown',
    allLabel: 'Ver toda la cobertura',
    items: COVERAGE_STATES.map((s) => ({ label: s.label, href: `/cobertura/${s.slug}` })),
  },
  // Sectores: aparece SOLO si hay datos en TAXONOMY.sectors (hoy vacío → oculto).
  ...(SECTORS.length > 0
    ? [{
        label: 'Sectores',
        href: '/sectores',
        panel: 'dropdown' as const,
        allLabel: 'Ver todos los sectores',
        items: SECTORS.map((s) => ({ label: s.label, href: `/sectores/${s.slug}` })),
      }]
    : []),
  // Blog: SIN slash final. `trailingSlash: 'never'` (astro.config.mjs + SITE.trailingSlash)
  // significa que la URL canónica es /blog y que `astro dev` responde 404 a /blog/.
  // El resto de las entradas de este NAV todavía llevan el slash heredado del
  // scaffold: hoy no molesta porque esas rutas aún no existen, pero hay que
  // quitárselo al construir cada sección (deuda registrada en README → hoja de ruta).
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

// ── SHOWCASE — vitrina de categorías de la home ──────────────────────────────
// Cada categoría se presenta como producto: imagen + título (H3) + copy de venta
// + atajos a subcategorías + CTA. Data-driven: edita SOLO este array.
// TODO: reemplazar imágenes placeholder por foto real optimizada (AVIF/WebP) y
// validar cada blurb con el cliente (sin promesas que no pueda cumplir).
export type ShowcaseSub = { label: string; href: string };
export type ShowcaseCategory = {
  slug: string;
  label: string; // título de la tarjeta (H3). Lleva la keyword de la categoría.
  href: string; // landing de la categoría.
  image: string; // ruta bajo /public. Optimiza el peso en producción.
  imageAlt: string; // alt descriptivo con keyword (a11y + SEO de imagen).
  badge?: string; // etiqueta corta de gancho.
  blurb: string; // copy de venta: beneficio + keyword + confianza (~120–160).
  subcategories: readonly ShowcaseSub[];
  ctaLabel?: string;
};
export const SHOWCASE: readonly ShowcaseCategory[] = [
  {
    slug: 'enrollables',
    label: 'Mosquiteros Enrollables',
    href: productoHref('enrollables'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero enrollable instalado en ventana',
    badge: undefined, // TODO: gancho real (entrega, garantía) o dejar sin badge.
    blurb:
      'El mosquitero se recoge solo cuando no lo usas: la malla queda oculta en el cajón y la ventana se ve libre. Ideal para ventanas de uso diario.',
    subcategories: [
      { label: 'Para ventana', href: productoHref('enrollables') },
      { label: 'Para puerta', href: productoHref('enrollables') },
    ],
    ctaLabel: 'Ver enrollables',
  },
  {
    slug: 'corredizos',
    label: 'Mosquiteros Corredizos',
    href: productoHref('corredizos'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero corredizo de aluminio en ventana corrediza',
    badge: undefined,
    blurb:
      'Corren sobre riel junto a tu ventana corrediza, sin obstruir el paso. Marco de aluminio a medida y malla que puedes cambiar cuando se dañe.',
    subcategories: [
      { label: 'Ventana corrediza', href: productoHref('corredizos') },
      { label: 'Puerta corrediza', href: productoHref('corredizos') },
    ],
    ctaLabel: 'Ver corredizos',
  },
  {
    slug: 'abatibles',
    label: 'Mosquiteros Abatibles',
    href: productoHref('abatibles'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero abatible con bisagras en puerta de acceso',
    badge: undefined,
    blurb:
      'Se abren como puerta con bisagras y cierre automático. La opción práctica para accesos por donde entras y sales todo el día.',
    subcategories: [
      { label: 'Puerta de acceso', href: productoHref('abatibles') },
      { label: 'Ventana abatible', href: productoHref('abatibles') },
    ],
    ctaLabel: 'Ver abatibles',
  },
  {
    slug: 'plisados',
    label: 'Mosquiteros Plisados',
    href: productoHref('plisados'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero plisado retráctil en vano amplio',
    badge: undefined,
    blurb:
      'La malla se pliega como acordeón y casi desaparece. Resuelven vanos amplios y puertas de cristal donde otros mosquiteros no alcanzan.',
    subcategories: [
      { label: 'Vano amplio', href: productoHref('plisados') },
      { label: 'Puerta de cristal', href: productoHref('plisados') },
    ],
    ctaLabel: 'Ver plisados',
  },

  // ── Añadidos el 2026-07-14 al construir la L2 /productos ────────────────────
  // SHOWCASE tenía 4 entradas y TAXONOMY.categories tiene 7: la L2 de catálogo
  // tiene que mostrar las 7, o no es un catálogo. Se completan aquí, en la misma
  // fuente, en vez de armar las tarjetas desde otro sitio — el propio archivo ya
  // avisa de que `desc` y `blurb` son la misma promesa en dos largos y hay que
  // mantenerlos a la par. Dos fuentes para lo mismo = drift garantizado.
  //
  // 🟢 Frank confirmó el 2026-07-14 que se fabrican estas líneas.
  // 🟠 Los blurbs son conocimiento del oficio, no especificaciones del cliente.
  //
  // ⚠️ LA HOME NO LAS MUESTRA TODAS, Y ES A PROPÓSITO: index.astro corta a las 4
  // primeras (ver SHOWCASE_HOME). Siete tarjetas + siete bloques "a fondo"
  // convertirían la home en un catálogo, y la home presenta — el catálogo es la
  // L2. Si reordenas este array, cambias lo que sale en la home.
  {
    slug: 'magneticos',
    label: 'Mosquiteros Magnéticos',
    href: productoHref('magneticos'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero magnético instalado en el marco de una puerta',
    badge: undefined,
    blurb:
      'Cortina de malla con banda de imanes: pasas empujando y se vuelve a sellar solo. Para puertas por las que entras con las manos ocupadas.',
    subcategories: [
      { label: 'Puerta de patio', href: productoHref('magneticos') },
      { label: 'Puerta de cocina', href: productoHref('magneticos') },
    ],
    ctaLabel: 'Ver magnéticos',
  },
  {
    slug: 'fijos',
    label: 'Mosquiteros Fijos',
    href: productoHref('fijos'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero fijo montado en el marco de una ventana',
    badge: undefined,
    blurb:
      'Bastidor con la malla tensada que se monta y se queda. Sin mecanismo que falle: la opción más económica para ventanas de poco uso.',
    subcategories: [
      { label: 'Ventana de poco uso', href: productoHref('fijos') },
      { label: 'Cubo de luz', href: productoHref('fijos') },
    ],
    ctaLabel: 'Ver fijos',
  },
  {
    slug: 'accesorios',
    label: 'Accesorios y refacciones',
    href: productoHref('accesorios'),
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Rollos de malla y perfiles de aluminio para mosquiteros',
    badge: undefined,
    blurb:
      'Malla por metro, perfiles, herrajes y rodamientos. Para quien repara por su cuenta. Y si prefieres, te lo cambiamos nosotros.',
    subcategories: [
      { label: 'Malla por metro', href: productoHref('accesorios') },
      { label: 'Herrajes y perfiles', href: productoHref('accesorios') },
    ],
    ctaLabel: 'Ver accesorios',
  },
];

// SHOWCASE_HOME — el corte que pinta la home. La home PRESENTA (4 tipos, los de
// mayor demanda); la L2 /productos es el CATÁLOGO (los 7). Sin este corte, meter
// una categoría nueva en SHOWCASE alargaría la home sola, sin que nadie lo
// decidiera. Aquí el corte es explícito y está en la fuente, no escondido en un
// `.slice(0, 4)` dentro de index.astro.
export const SHOWCASE_HOME: readonly ShowcaseCategory[] = SHOWCASE.slice(0, 4);

// ── AFONDO — cuerpo largo + puntos clave por categoría (módulo "a fondo") ────
// Lo consume CategoryDetail.astro desde la home, indexado por el `slug` de
// SHOWCASE. Vive APARTE de SHOWCASE a propósito: SHOWCASE se diseñó para la
// tarjeta corta (blurb de 1 frase) y este cuerpo no cabe ahí sin desvirtuarla.
// La tarjeta abre la puerta; este bloque la atraviesa.
//
// REGLAS DE ESCRITURA (no son estilo, son el contrato del bloque):
//   • body  → 2 párrafos MÁXIMO. Párrafo 1: cómo funciona. Párrafo 2: qué caso
//     resuelve y qué condición exige. Nada de relleno.
//   • points → 3-5 bullets escaneables que RESUMEN, no que repiten el body.
//   • gallery → 1 imagen grande (main) + 2 pequeñas (thumbs). El bloque es de
//     DOS columnas: info a la izquierda, galería a la derecha. Es la forma
//     canónica del módulo, no un adorno opcional.
//   • Un slug sin entrada aquí simplemente no renderiza su bloque (la home
//     filtra por AFONDO[slug]), así que agregar una categoría no rompe nada.
//
// ⚠️ IMÁGENES. Las rutas apuntan a placeholders generados en
// public/images/showcase/<slug>-{1,2,3}.svg. Cada uno dice QUÉ foto va en ese
// hueco (toma principal · detalle · aplicación): son la lista de tomas para la
// sesión de fotos. Al sustituirlos por las fotos reales (AVIF/WebP < 200 KB),
// respeta el 4:3 y NO toques los `alt` — ya están escritos para describir la
// foto real, no el placeholder.
//
// ⚠️ PROCEDENCIA DEL CONTENIDO. Todo lo de abajo es mecánica de producto
// verificable (cómo se mueve la malla, qué vano exige, qué caso resuelve): es
// conocimiento técnico del oficio, NO una promesa del negocio. Por eso NO hay
// ni un dato de entrega, garantía, precio, material específico ni certificación:
// eso son claims comerciales y solo los puede afirmar el cliente. Si quieres
// añadirlos (p. ej. "Entrega en X días", "Garantía de Y meses", "Aluminio
// calibre Z"), pídeselos al cliente y añádelos como un punto más — pero NO los
// inventes aquí. Regla dura OrigenLab: cero contenido fabricado.
export type AfondoImage = { src: string; alt: string };
export type AfondoEntry = {
  body: readonly string[];
  points: readonly string[];
  gallery: { main: AfondoImage; thumbs: readonly AfondoImage[] };
};

export const AFONDO: Record<string, AfondoEntry> = {
  enrollables: {
    gallery: {
      main: { src: '/images/showcase/enrollables-1.svg', alt: 'Mosquitero enrollable instalado en una ventana, con la malla recogida en su cajón' },
      thumbs: [
        { src: '/images/showcase/enrollables-2.svg', alt: 'Detalle del cajón superior donde se enrolla la malla del mosquitero' },
        { src: '/images/showcase/enrollables-3.svg', alt: 'Mosquitero enrollable en versión para puerta' },
      ],
    },
    body: [
      'El mosquitero enrollable funciona como una persiana: la malla vive enrollada dentro de un cajón en la parte superior del vano y baja solo cuando la necesitas. Al soltarla, el mecanismo la recoge y la ventana vuelve a quedar despejada, sin bastidor a la vista.',
      'Por eso encaja en ventanas de uso diario: no estorba cuando no lo usas y no hay que desmontar nada para limpiar el cristal. A cambio pide una condición. El cajón se fija arriba del vano, así que necesita unos centímetros libres en esa zona.',
    ],
    points: [
      'La malla se guarda enrollada: la ventana queda libre cuando no lo usas',
      'Sin bastidor fijo a la vista: no estorba para limpiar el cristal',
      'Requiere espacio libre arriba del vano para alojar el cajón',
      'Hay versión para ventana y versión para puerta',
    ],
  },
  corredizos: {
    gallery: {
      main: { src: '/images/showcase/corredizos-1.svg', alt: 'Mosquitero corredizo de aluminio montado junto a una ventana corrediza' },
      thumbs: [
        { src: '/images/showcase/corredizos-2.svg', alt: 'Detalle del riel y el bastidor de aluminio del mosquitero corredizo' },
        { src: '/images/showcase/corredizos-3.svg', alt: 'Mosquitero corredizo en versión para puerta corrediza' },
      ],
    },
    body: [
      'El mosquitero corredizo es un bastidor de aluminio con malla que corre sobre su propio riel, paralelo al de tu ventana. Se desliza a un lado cuando quieres abrir del todo y vuelve a su sitio sin desmontarse.',
      'Es la opción natural si tu ventana ya es corrediza: repite el mismo movimiento que ya conoces y no invade el paso ni hacia dentro ni hacia fuera. Al ser un bastidor independiente, la malla se cambia cuando se daña sin tocar el marco de la ventana.',
    ],
    points: [
      'Corre sobre riel propio, paralelo al de tu ventana',
      'No invade el paso: no abre hacia dentro ni hacia fuera',
      'Bastidor de aluminio armado a la medida del vano',
      'Malla reemplazable sin cambiar el bastidor',
    ],
  },
  abatibles: {
    gallery: {
      main: { src: '/images/showcase/abatibles-1.svg', alt: 'Mosquitero abatible instalado en una puerta de acceso' },
      thumbs: [
        { src: '/images/showcase/abatibles-2.svg', alt: 'Detalle de las bisagras y el cierre automático del mosquitero abatible' },
        { src: '/images/showcase/abatibles-3.svg', alt: 'Mosquitero abatible en versión para ventana' },
      ],
    },
    body: [
      'El mosquitero abatible se abre como una puerta: va montado sobre bisagras en un costado del vano y gira para dejar pasar. El cierre lo hace el propio mecanismo, así que vuelve a su posición solo. No se queda abierto detrás de ti.',
      'Es el tipo pensado para accesos de paso frecuente, donde deslizar un corredizo cada vez acaba molestando. Su condición es el espacio: necesita el arco de apertura libre, así que conviene revisar que ningún mueble ni maceta lo bloquee.',
    ],
    points: [
      'Se abre como puerta, sobre bisagras laterales',
      'Cierre automático: no se queda abierto tras pasar',
      'Pensado para accesos por donde entras y sales a diario',
      'Necesita el arco de apertura despejado',
    ],
  },
  plisados: {
    gallery: {
      main: { src: '/images/showcase/plisados-1.svg', alt: 'Mosquitero plisado retráctil cubriendo un vano amplio' },
      thumbs: [
        { src: '/images/showcase/plisados-2.svg', alt: 'Detalle de la malla plegada en acordeón dentro de su perfil' },
        { src: '/images/showcase/plisados-3.svg', alt: 'Mosquitero plisado en versión para puerta de cristal' },
      ],
    },
    body: [
      'El mosquitero plisado lleva la malla plegada en acordeón dentro de un perfil lateral. Al correrlo, la malla se despliega guiada por un riel; al recogerlo, se pliega sobre sí misma y se reduce a unos pocos centímetros contra el marco.',
      'Resuelve los vanos donde los demás tipos se quedan cortos: puertas de cristal, ventanales anchos y accesos amplios que un bastidor rígido no cubre de una pieza. Como se pliega casi por completo, no tapa la vista cuando no está en uso.',
    ],
    points: [
      'La malla se pliega en acordeón: casi desaparece al recogerla',
      'Cubre vanos amplios y puertas de cristal',
      'Riel de guía: apertura suave incluso en tramos largos',
      'No tapa la vista cuando no está en uso',
    ],
  },

  // ── Añadidos el 2026-07-14 para que las 7 fichas de /productos existan ──────
  // Los 4 de arriba venían del scaffold con galería propia (showcase/*.svg). Estos
  // 3 no tenían más que la línea de `desc`, así que sus fichas habrían sido páginas
  // huecas. Se escriben con el MISMO registro: qué es, qué resuelve, y —lo que
  // más importa— CUÁNDO NO conviene. Un catálogo que solo dice bondades no ayuda
  // a elegir; el que dice "esto no es para ti" es el que gana la confianza.
  //
  // 🟢 Frank confirmó el 2026-07-14 que el negocio fabrica estas líneas.
  // 🟠 PERO el contenido de abajo es conocimiento general del oficio, NO
  // especificaciones del cliente: no dice materiales concretos, ni medidas
  // máximas, ni precios. Nadie ha preguntado eso. Si el cliente tiene un dato
  // real (p. ej. "nuestros magnéticos llegan hasta X cm"), sustituye lo genérico.
  //
  // gallery: apuntan a placeholder.svg — no hay SVGs de showcase para estos 3.
  // TODO: fotos reales (4:3, AVIF/WebP < 200 KB).
  magneticos: {
    gallery: {
      main: { src: '/images/placeholder.svg', alt: 'Mosquitero magnético instalado en el marco de una puerta' },
      thumbs: [
        { src: '/images/placeholder.svg', alt: 'Detalle de la banda de imanes que cierra el mosquitero magnético' },
        { src: '/images/placeholder.svg', alt: 'Mosquitero magnético abriéndose al paso de una persona' },
      ],
    },
    body: [
      'El mosquitero magnético es una cortina de malla partida al centro, con una banda de imanes a lo largo de la unión. Pasas empujando con el cuerpo y, detrás de ti, los imanes vuelven a juntar las dos hojas sin que tengas que hacer nada.',
      'Es la solución para accesos por donde entras y sales con las manos ocupadas: la puerta del patio, la de la cocina, la del jardín. No lleva bastidor rígido, así que se instala sobre el marco existente sin obra.',
    ],
    points: [
      'Se cierra solo: pasas empujando y los imanes vuelven a sellar',
      'Ideal si entras y sales con las manos ocupadas',
      'Se monta sobre el marco existente, sin obra',
      'No conviene en ventanas: está pensado para pasar a través',
    ],
  },
  fijos: {
    gallery: {
      main: { src: '/images/placeholder.svg', alt: 'Mosquitero fijo montado en el marco de una ventana' },
      thumbs: [
        { src: '/images/placeholder.svg', alt: 'Detalle del bastidor de aluminio de un mosquitero fijo' },
        { src: '/images/placeholder.svg', alt: 'Mosquitero fijo instalado en una ventana que no se abre' },
      ],
    },
    body: [
      'El mosquitero fijo es un bastidor con la malla tensada que se monta al vano y se queda ahí. No corre, no se enrolla y no se abate: cubre la ventana de forma permanente.',
      'Por eso es el más económico y el que menos se estropea, porque no tiene mecanismo que falle. Encaja donde la ventana se abre poco o donde solo hace falta tapar el hueco: cubos de luz, baños, ventanas altas, cocinas.',
    ],
    points: [
      'La opción más económica: sin mecanismo, nada que se descomponga',
      'Va en ventanas de poco uso, cubos de luz y ventanas altas',
      'Bastidor de aluminio a la medida del vano',
      'No conviene si necesitas asomarte o limpiar el cristal seguido',
    ],
  },
  accesorios: {
    gallery: {
      main: { src: '/images/placeholder.svg', alt: 'Rollos de malla y perfiles de aluminio para mosquiteros' },
      thumbs: [
        { src: '/images/placeholder.svg', alt: 'Herrajes y rodamientos de repuesto para mosquiteros' },
        { src: '/images/placeholder.svg', alt: 'Detalle de un perfil de aluminio para bastidor de mosquitero' },
      ],
    },
    body: [
      'Vendemos por separado lo que lleva un mosquitero: malla por metro, perfiles de aluminio, herrajes, rodamientos, felpa y el cordón que tensa la tela contra el bastidor.',
      'Sirve si reparas por tu cuenta o si solo necesitas la refacción concreta que se rompió. Y si prefieres no meterte, el cambio lo hacemos nosotros. Cuéntanos qué se dañó y vemos si te sale mejor la pieza o el servicio.',
    ],
    points: [
      'Malla por metro, perfiles, herrajes, rodamientos y felpa',
      'Para quien repara por su cuenta',
      'También hacemos el cambio nosotros si prefieres',
      'Cuéntanos qué se rompió y vemos qué necesitas',
    ],
  },
};

// ── SERVICIOS A FONDO — cuerpo de las fichas /servicios/<id> ────────────────
// Añadido el 2026-07-14, cuando Frank confirmó que el negocio presta los cuatro.
// SERVICES solo tenía `label` + una línea de `desc`: suficiente para una tarjeta,
// no para una ficha. Sin esto las 4 fichas habrían sido un título y una frase.
//
// 🟢 Frank confirmó QUE se prestan los 4 servicios.
// 🟠 El contenido de abajo es conocimiento general del oficio. NO se ha preguntado:
//      · ¿Cobra la medición a domicilio? ¿Cuánto?   ← por eso NINGÚN texto lo dice
//      · ¿Cuánto tarda la entrega?                  ← por eso no hay plazos
//      · ¿Da garantía? ¿De qué?                     ← por eso no se promete ninguna
//    Cuando haya respuestas, entran aquí y salen en las fichas solas.
//
// REGLA AL EDITAR: nada de plazos, precios ni garantías sin dato verificado.
// Es la regla dura del portafolio y es la que protege al cliente de una promesa
// que luego tiene que pagar.
// Mismo shape que AfondoEntry + `blurb`, a propósito: así /servicios usa los
// MISMOS componentes que /mosquiteros (CategoryCard + CategoryDetail) y las dos
// L2 se ven iguales sin duplicar CSS. Si divergen los tipos, divergen las páginas.
// ⭐ Cumple el CONTRATO L4 (docs/CONTRATO-L4.md §2) — los campos de abajo son el
// equivalente de FICHAS para los servicios. Léelo antes de tocarlos.
export type ServicioAfondo = {
  /** Copy de la tarjeta en la vitrina (~120–160). Versión larga de `desc`. */
  blurb: string;
  /** Los 2 párrafos de cabecera. Los consume la L2 y el hero de la L4. */
  body: readonly string[];
  /** Resumen escaneable. Lo consume la L2. */
  points: readonly string[];
  /** Qué NO incluye o cuándo no aplica. Lo que más confianza da de un servicio. */
  limite?: string;
  gallery: { main: AfondoImage; thumbs: readonly AfondoImage[] };

  // ── Campos de la L4 (contrato §2) ────────────────────────────────────────
  /** Cómo trabajamos el servicio, paso a paso. 2–3 párrafos. */
  comoFunciona: readonly string[];
  /** Cuándo SÍ pedirlo. Bullets. */
  encajaEn: readonly string[];
  /**
   * Cuándo NO pedirlo. Bullets. ⚠️ OBLIGATORIO — es el campo que justifica que
   * la L4 exista: sin él sería la L2 recortada, compitiendo con su propio padre.
   * Y en un servicio a domicilio, decir "esto no es lo tuyo" antes de agendar
   * ahorra una visita que nadie quiere pagar.
   */
  noConviene: readonly string[];
  /** Tabla de referencia. Hechos del oficio, NO specs ni plazos del cliente. */
  datos: readonly FichaDato[];
  /** Mínimo 8. Únicas en TODO el sitio (lo verifica una guarda de build). */
  faqs: readonly { question: string; answer: string }[];
  /** Slugs de artículos relevantes a ESTE servicio. Contextual, no boilerplate. */
  guias: readonly string[];
};

export const SERVICIOS_AFONDO: Record<string, ServicioAfondo> = {
  fabricacion: {
    blurb:
      'Cada pieza se arma a las dimensiones exactas de tu vano, no a una medida de línea. Es lo que hace que cierre completo, sin huecos.',
    gallery: {
      main: { src: '/images/servicios/fabricacion-1.svg', alt: 'Corte del perfil de aluminio a la medida del vano' },
      thumbs: [
        { src: '/images/servicios/fabricacion-2.svg', alt: 'Malla tensada sobre el bastidor del mosquitero' },
        { src: '/images/servicios/fabricacion-3.svg', alt: 'Mosquitero terminado listo para instalar' },
      ],
    },
    body: [
      'Fabricamos cada mosquitero a la medida exacta del vano, no a una medida de línea. Tomamos el ancho y el alto de tu ventana —o los tomas tú y nos los mandas— y armamos el bastidor con esas dimensiones, para que la pieza cierre completa y no queden huecos por donde se cuele un mosquito.',
      'Antes de cortar definimos dos cosas contigo: el tipo de mosquitero que corresponde a tu ventana y la malla que aguanta tu caso. No es lo mismo una ventana con mascotas que una que da al sol todo el día.',
    ],
    points: [
      'A la medida del vano, no a medida de línea',
      'Te decimos qué tipo corresponde a tu ventana',
      'Elegimos la malla según tu caso: mascotas, sol, insectos chicos',
      'Bastidor armado para que cierre completo, sin huecos',
    ],
    limite: 'Necesitamos las medidas del vano para poder fabricar. Si no sabes tomarlas, te enseñamos cómo o vamos nosotros.',
    guias: ['como-medir-ventana-mosquitero', 'por-que-mosquiteros-a-medida', 'tipos-de-mosquitero-cual-elegir'],
    comoFunciona: [
      'Todo arranca con dos datos: qué tipo de ventana o puerta es, y las medidas del vano. Con eso definimos el tipo de mosquitero que corresponde y la malla que aguanta tu caso, porque una ventana con mascotas no pide la misma tela que una que da al poniente.',
      'Cortamos el perfil a esas dimensiones exactas, armamos el bastidor y tensamos la malla contra él con el cordón. La tensión es la parte que no se ve y la que decide todo: floja hace bolsa, apretada de más deforma el marco.',
      'No trabajamos medidas de línea. Cada pieza sale del taller para tu vano y solo para tu vano, que es precisamente lo que hace que cierre completo, sin huecos por donde se cuele nada.',
    ],
    encajaEn: [
      'Ya tienes las medidas del vano y quieres la pieza',
      'Tu ventana no encaja en ninguna medida comercial',
      'Quieres que cierre completo, sin huecos en los cantos',
      'Necesitas varias piezas y que todas queden iguales',
    ],
    noConviene: [
      'Si solo se rompió la malla y el bastidor está sano: eso es reparación',
      'Si no tienes las medidas y no quieres tomarlas: pide medición primero',
      'Si esperas una pieza estándar barata: aquí todo se hace a medida',
    ],
    datos: [
      { label: 'Qué necesitamos', value: 'Tipo de vano + ancho y alto' },
      { label: 'Dónde ocurre', value: 'En el taller, no en tu casa' },
      { label: 'Medidas', value: 'Las tuyas: no hay medidas de línea' },
      { label: 'Malla', value: 'Se elige según tu caso, no por defecto' },
      { label: 'Si no tienes medidas', value: 'Te decimos cómo o vamos nosotros' },
    ],
    faqs: [
      {
        question: '¿Qué pasa si las medidas que les di están mal?',
        answer:
          'La pieza sale a la medida que nos diste, así que si el número está mal, la pieza está mal. Y en un producto a medida <strong>no hay devolución</strong>. Por eso pedimos las tres mediciones y la <strong>menor</strong> de cada terna: es la que garantiza que entre. Si te da inseguridad, pide <a href="/servicios/medicion">medición</a>: sale más barato que una pieza que no entra.',
      },
      {
        question: '¿Puedo cambiar de tipo de mosquitero después de pedirlo?',
        answer:
          'Antes de cortar el perfil, sí, y sin problema. Después ya no: el corte es a la medida y para el mecanismo de ese tipo concreto. Por eso el tipo se decide <strong>antes</strong>, con la foto de tu ventana delante. Por eso insistimos tanto en la columna de "piénsalo si" de cada tipo.',
      },
      {
        question: '¿Fabrican una sola pieza o hay mínimo?',
        answer:
          'Una sola. Cotizamos <strong>por pieza</strong>, así que una ventana suelta es un trabajo válido. Ahora bien, si tienes varias, dilo de entrada: se aprovecha mejor la visita y el material.',
      },
      {
        question: '¿Fabrican para ventanas que no son rectangulares?',
        answer:
          'Cuéntanos el caso con una foto. Un vano irregular, en arco o en triángulo se resuelve a veces sí y a veces no, según el tipo y el mecanismo, y prometerlo a ciegas sería mentirte. Lo que sí podemos adelantarte es que <strong>ningún vano es perfectamente cuadrado</strong>. Esa desviación normal ya la contemplamos siempre.',
      },
      {
        question: '¿Qué les tengo que dar para que empiecen a fabricar?',
        answer:
          'Una <strong>foto de la ventana completa</strong> y el <strong>ancho y alto del vano</strong>. La foto no es un extra: nos dice el tipo de marco, que es lo que define qué mosquitero corresponde. Con esas dos cosas cotizamos; sin la foto, adivinamos.',
      },
      {
        question: '¿Fabrican para domos y tragaluces?',
        answer:
          'Sí, y suele ser un <a href="/mosquiteros/fijos">fijo</a>: son vanos que nadie abre y donde lo último que quieres es un mecanismo al que darle mantenimiento en altura. Mándanos foto. En domos importa mucho cómo está el marco y si hay dónde anclar.',
      },
      {
        question: '¿Puedo darles las medidas de mi mosquitero viejo en vez del vano?',
        answer:
          'Mejor no, y es un error común. El mosquitero viejo puede estar mal hecho, vencido o ser de una medida que nunca fue la correcta, y copiarlo es heredar su problema. Medimos el <strong>vano</strong>, que es lo que no cambia. Si aun así prefieres darnos la pieza vieja como referencia, mándanos también la del vano.',
      },
      {
        question: '¿Fabrican si vivo fuera de CDMX y Edomex?',
        answer:
          'La fabricación ocurre en el taller, así que técnicamente sí. Lo que no podemos es medir ni instalar fuera de nuestra <a href="/cobertura">cobertura</a>. Y sin eso, si la medida falla, no hay quien lo resuelva. Escríbenos y lo hablamos: preferimos decirte que no de entrada a mandarte una pieza que quizá no entre.',
      },
    ],
  },
  instalacion: {
    blurb:
      'La colocamos y la dejamos funcionando: verificamos que cierre, que corra sin trabarse y ajustamos en sitio antes de irnos.',
    gallery: {
      main: { src: '/images/servicios/instalacion-1.svg', alt: 'Colocación del mosquitero en la ventana' },
      thumbs: [
        { src: '/images/servicios/instalacion-2.svg', alt: 'Ajuste de los herrajes del mosquitero en sitio' },
        { src: '/images/servicios/instalacion-3.svg', alt: 'Prueba de que el mosquitero cierra bien antes de entregar' },
      ],
    },
    body: [
      'Colocamos la pieza en tu ventana o puerta y la dejamos funcionando. No basta con que entre: verificamos que cierre completo, que corra sin trabarse y que no roce, y ajustamos lo que haga falta antes de irnos.',
      'Instalamos lo que fabricamos. La instalación es parte del trabajo, no un extra que se cotiza aparte una vez que ya tienes la pieza en casa.',
    ],
    points: [
      'Colocación en ventana, puerta o domo',
      'Verificamos que cierre y corra bien antes de irnos',
      'Ajustamos en sitio lo que haga falta',
      'Te decimos cómo limpiarlo para que dure',
    ],
    guias: ['como-trabajamos-de-la-medida-a-la-instalacion', 'que-preguntar-antes-de-contratar-mosquiteros', 'mantenimiento-limpieza-mosquiteros'],
    comoFunciona: [
      'Llegamos con la pieza ya hecha a la medida de tu vano. Lo primero no es montarla: es presentarla y comprobar que el marco está como lo medimos. Un vano se mueve —la casa se asienta, alguien pintó encima, la reja se movió— y eso se ve antes de atornillar, no después.',
      'Después va el anclaje, que cambia según el tipo: el corredizo entra al riel, el abatible atornilla bisagras al marco, el enrollable fija su cajón arriba del vano. Cada uno pide lo suyo y ninguno se resuelve a martillazos.',
      'Y lo que de verdad separa una instalación de un montaje: antes de irnos lo abrimos y lo cerramos. Que corra sin trabarse, que cierre completo, que no roce. Lo que falle se ajusta ahí, no cuando ya nos fuimos.',
    ],
    encajaEn: [
      'Va incluida en la pieza que fabricamos: no es un extra',
      'Ventanas, puertas y domos',
      'Cuando quieres que alguien verifique que quedó bien',
      'Varias piezas a la vez: se resuelven en la misma visita',
    ],
    noConviene: [
      'Si la pieza no está hecha a la medida de tu vano: no hay instalación que lo arregle',
      'Si el marco está vencido: primero se resuelve el marco',
      'Si el mosquitero magnético lo quieres poner tú: es el único que se instala sin nosotros',
    ],
    datos: [
      { label: 'Qué llevamos', value: 'La pieza ya hecha a tu medida' },
      { label: 'Primero', value: 'Presentar y comprobar el vano' },
      { label: 'Anclaje', value: 'Según el tipo: riel, bisagras o cajón' },
      { label: 'Antes de irnos', value: 'Se abre y se cierra: tiene que correr' },
      { label: 'Incluida', value: 'Va con la pieza que fabricamos' },
    ],
    faqs: [
      {
        question: '¿Van a perforar mis paredes?',
        answer:
          'La pared casi nunca se toca. El anclaje va al <strong>marco</strong> del vano, que es de aluminio o madera y es lo que sostiene la pieza. Solo se perfora muro cuando el vano no da otra opción, y en ese caso lo sabrás <strong>antes</strong> de que taladremos, no después. Si vives de renta y eso te importa, dilo al agendar.',
      },
      {
        question: '¿Hay que quitar las cortinas o el mosquitero viejo antes de que lleguen?',
        answer:
          'Nos ayuda que esté despejado, pero no es tu trabajo: si el mosquitero viejo hay que retirarlo, lo retiramos nosotros. Las cortinas sí conviene recogerlas. El mosquitero va por fuera del cristal y no las estorba, pero para trabajar necesitamos ver el marco.',
      },
      {
        question: '¿Qué pasa si al llegar descubren que la medida no da?',
        answer:
          'Pasa, y por eso presentamos la pieza antes de atornillar nada. Si el vano se movió o la medida venía mal de origen, lo hablamos ahí mismo y salimos con un plan. Lo que <strong>no</strong> hacemos es forzarla para que entre. Una pieza forzada no cierra completa, y el problema reaparece después, cuando ya no estamos.',
      },
      {
        question: '¿Instalan en departamentos de piso alto?',
        answer:
          'Sí. Lo que necesitamos saber de antemano es si el trabajo se hace <strong>desde dentro</strong>, que es lo normal, o si algo obliga a asomarse. Dilo al agendar junto con el piso: cambia cómo preparamos la visita, y no es algo que queramos descubrir al llegar.',
      },
      {
        question: '¿Me explican cómo usarlo antes de irse?',
        answer:
          'Sí, y en algunos tipos importa más de lo que parece. Un <a href="/mosquiteros/enrollables">enrollable</a> que sueltas de golpe se enrolla torcido y luego se atora; un <a href="/mosquiteros/plisados">plisado</a> que corres desde una esquina se sale de guía. Son treinta segundos que te ahorran una llamada.',
      },
      {
        question: '¿Recogen la basura y el mosquitero que quitaron?',
        answer:
          'Sí: recortes, tornillos, embalaje y la pieza vieja si la retiramos. Dejar tu casa como estaba es parte del trabajo, no un favor.',
      },
      {
        question: 'Si después se afloja o empieza a rozar, ¿qué hago?',
        answer:
          'Escríbenos y lo vemos. Un ajuste no es lo mismo que una reparación: muchas veces es cuestión de reapretar o recalibrar, y es normal que una pieza se acomode las primeras semanas. Mándanos un video corto del movimiento. Se diagnostica mucho mejor que con una foto.',
      },
      {
        question: '¿Puedo instalarlo yo si me lo fabrican?',
        answer:
          'Sí, la instalación es un servicio aparte y no una obligación. Te diríamos que adelante sin reservas con el <a href="/mosquiteros/magneticos">magnético</a>. Con un enrollable o un abatible, píensalo: el anclaje sostiene una pieza que se usa a diario y un tornillo mal puesto se ve en un mes.',
      },
    ],
  },
  medicion: {
    blurb:
      'Vamos a tu domicilio y tomamos las medidas nosotros. La vía segura cuando el vano no es cuadrado o hay varias ventanas.',
    gallery: {
      main: { src: '/images/servicios/medicion-1.svg', alt: 'Flexómetro midiendo el ancho del vano de una ventana' },
      thumbs: [
        { src: '/images/servicios/medicion-2.svg', alt: 'Anotando las medidas de la ventana en el domicilio del cliente' },
        { src: '/images/servicios/medicion-3.svg', alt: 'Revisión del marco de la ventana para definir el tipo de mosquitero' },
      ],
    },
    body: [
      'Si prefieres no medir tú, vamos a tu domicilio y tomamos las medidas nosotros. Es la vía segura cuando el vano no es cuadrado —que es lo normal— o cuando hay varias ventanas y no quieres arriesgarte a equivocarte en una.',
      'En la visita también vemos el marco que ya tienes, que es lo que define qué tipo de mosquitero corresponde. Con la ventana delante sabrás cuál es el tuyo y por qué.',
    ],
    points: [
      'Vamos a tu domicilio a tomar las medidas',
      'Útil cuando el vano no es cuadrado o hay varias ventanas',
      'Vemos tu marco y sabrás qué tipo corresponde',
      'También puedes medir tú: te explicamos cómo',
    ],
    // ⚠️ NO decir "gratis" ni poner precio: nadie ha confirmado si se cobra.
    // Ver la pregunta 3 de docs/GATE-LANZAMIENTO.md §3.
    limite: 'Agenda la visita por WhatsApp y te confirmamos las condiciones antes de ir.',
    guias: ['como-medir-ventana-mosquitero', 'tipos-de-mosquitero-cual-elegir', 'como-trabajamos-de-la-medida-a-la-instalacion'],
    comoFunciona: [
      'Vamos a tu domicilio y medimos el vano por dentro del marco: el ancho en tres alturas y el alto en tres puntos. De cada terna nos quedamos con la <strong>menor</strong>, porque los vanos no son cuadrados —ninguno lo es— y una pieza hecha sobre la medida mayor simplemente no entra.',
      'Pero la visita no es solo el flexómetro. Vemos el marco que ya tienes, que es lo que de verdad define qué tipo de mosquitero corresponde: si hay riel, si hay fondo arriba para un cajón, si la puerta tiene espacio para abatir. Eso no se ve en una foto y decide la pieza entera.',
      'Sales de la visita sabiendo qué tipo te toca y por qué. Y si prefieres medir tú, también está bien. Te enseñamos cómo y nos ahorramos el viaje. Esto no es un trámite obligatorio, es un seguro contra la pieza equivocada.',
    ],
    encajaEn: [
      'No sabes medir o te da inseguridad hacerlo',
      'El vano no es cuadrado o tiene reja, y no sabes qué contar',
      'Tienes varias ventanas y no quieres errar en ninguna',
      'No tienes claro qué tipo de mosquitero te corresponde',
    ],
    noConviene: [
      'Si ya tienes las medidas bien tomadas: manda foto y ahórrate la visita',
      'Si es una sola ventana simple y te animas a medir tú',
      'Si estás fuera de nuestra cobertura: ahí no llegamos',
    ],
    datos: [
      { label: 'Dónde', value: 'En tu domicilio' },
      { label: 'Qué medimos', value: 'El vano por dentro, en 3 puntos' },
      { label: 'Qué más vemos', value: 'Tu marco: define el tipo de pieza' },
      { label: 'Alternativa', value: 'Mides tú y nos mandas foto + números' },
      { label: 'Condiciones', value: 'Te las confirmamos al agendar' },
    ],
    faqs: [
      {
        question: '¿Qué revisan además de las medidas?',
        answer:
          'El <strong>marco</strong>, que es lo que decide el tipo: si tu ventana corre sobre riel, si hay centímetros libres arriba para el cajón de un enrollable, si una puerta tiene espacio para abrir una hoja. También el estado —un riel doblado o un marco vencido hay que resolverlo antes de fabricar—. Eso no se ve en una foto y es la mitad del valor de la visita.',
      },
      {
        question: '¿Puedo mandar fotos en vez de que vayan?',
        answer:
          'Muchas veces sí, y nos parece bien: si mandas una <strong>foto de la ventana completa</strong> más el ancho y el alto, normalmente cotizamos sin pisar tu casa. La visita se gana su sitio cuando el vano es raro, hay varias ventanas distintas o no te fías de tus números.',
      },
      {
        question: '¿Miden todas mis ventanas o solo las que les diga?',
        answer:
          'Las que nos digas. Ahora bien, si ya estamos ahí, dinos todas las que te interesan aunque no las vayas a pedir hoy: medirlas no cuesta esfuerzo extra y te evita una segunda visita cuando decidas.',
      },
      {
        question: '¿Me dan el precio ahí mismo?',
        answer:
          'Con las medidas en la mano y el tipo definido, sí: eso es todo lo que hace falta para cotizar por pieza. Si el caso tiene algo raro —un vano irregular, algo que revisar del marco— preferimos decírtelo ahí y pasarte el número después, en vez de improvisar una cifra que luego cambie.',
      },
      {
        question: '¿Y si después de medir decido no comprar?',
        answer:
          'Es tu derecho y no pasa nada. Las condiciones de la visita te las confirmamos <strong>antes</strong> de ir, precisamente para que no haya sorpresas si decides que no. Preferimos que te vayas con la información y decidas tranquilo.',
      },
      {
        question: '¿Tengo que preparar algo antes de que lleguen?',
        answer:
          'Que se pueda llegar a la ventana: quitar lo que esté delante y recoger la cortina. Nada más. Y si tienes claro qué te molesta —mosquitos chicos, el sol, el perro que rasga— dilo, porque eso decide la malla tanto como la medida decide la pieza.',
      },
      {
        question: 'Mi ventana tiene reja, ¿pueden medir igual?',
        answer:
          'Sí, y es justo un caso donde la visita vale la pena: con reja hay que decidir si el mosquitero va por dentro o por fuera, y eso cambia la medida que se toma. Es de las cosas que por foto se calculan mal y por eso acaban en una pieza que no entra.',
      },
      {
        question: '¿Qué pasa si mis ventanas no son iguales entre sí?',
        answer:
          'Es lo normal, aunque parezcan idénticas: dos ventanas del mismo modelo suelen diferir unos milímetros por cómo se instalaron. Por eso <strong>cada una se mide por separado</strong> y cada pieza sale con su número. Copiar la medida de una a otra es el error que más piezas devuelve al taller.',
      },
    ],
  },
  reparacion: {
    blurb:
      'Si el bastidor aguanta, se cambia solo la malla y queda como nuevo. Y si no aguanta, lo vas a saber antes de que te cobremos.',
    gallery: {
      main: { src: '/images/servicios/reparacion-1.svg', alt: 'Cambio de malla en un bastidor de mosquitero existente' },
      thumbs: [
        { src: '/images/servicios/reparacion-2.svg', alt: 'Malla de mosquitero rota antes de repararla' },
        { src: '/images/servicios/reparacion-3.svg', alt: 'Rodamientos y herrajes de repuesto para mosquiteros' },
      ],
    },
    body: [
      'Si ya tienes mosquiteros y solo se rompió la malla, no siempre hay que reponer la pieza entera. Cuando el bastidor y los herrajes aguantan, se cambia solo la tela y el mosquitero queda como nuevo por una fracción de lo que cuesta uno nuevo.',
      'Cuando el marco está vencido o los rodamientos ya no corren, la cuenta cambia. A veces reparar sale casi lo mismo que reponer, y ahí conviene la pieza nueva. Preferimos perder el trabajo a cobrarte una reparación que no te va a durar.',
    ],
    points: [
      'Cambio de malla si el bastidor aguanta',
      'Cambio de herrajes, rodamientos y felpa',
      'Sabrás si conviene reparar o reponer antes de pagar',
      'Mándanos una foto y te orientamos antes de ir',
    ],
    limite: 'No siempre conviene reparar. Si el marco está vencido lo vas a saber, aunque eso signifique que no te vendamos nada.',
    guias: ['reparar-o-reponer-un-mosquitero', 'tipos-de-malla-mosquitero', 'mantenimiento-limpieza-mosquiteros'],
    comoFunciona: [
      'Empieza con una foto. Casi siempre basta verla para saber si lo tuyo es la tela, los rodamientos, los herrajes o el bastidor, y de eso depende que haya reparación o no. Mandarla te ahorra una visita entera para escuchar que no tenía arreglo.',
      'Si el bastidor y los herrajes aguantan, se cambia solo la malla. Se retira el cordón, sale la tela vieja, se tensa la nueva y se vuelve a rematar. Queda como nuevo por una fracción de lo que cuesta la pieza. Y si lo que falla son rodamientos o felpa, se sustituyen sin tocar el marco.',
      'Y cuando el marco está vencido, deformado o le falta un tramo, la respuesta es no. Reparar sale casi lo mismo que reponer y encima dura menos. Preferimos perder la reparación a cobrarte algo que se rompe otra vez en tres meses.',
    ],
    encajaEn: [
      'Se rompió la malla y el bastidor está entero',
      'El mosquitero se traba o se sale del riel',
      'Los herrajes o la felpa están gastados',
      'Tienes varias piezas con el mismo problema',
    ],
    noConviene: [
      'Si el bastidor está vencido o deformado, reparar sale casi lo mismo que reponer',
      'Si la pieza nunca fue de la medida de tu vano, eso no lo arregla una malla nueva',
      'Si prefieres hacerlo tú, te vendemos solo las refacciones y te ahorras el servicio',
    ],
    datos: [
      { label: 'Empieza con', value: 'Una foto de la pieza dañada' },
      { label: 'Lo más común', value: 'Cambio de malla en bastidor sano' },
      { label: 'También', value: 'Rodamientos, herrajes y felpa' },
      { label: 'Si el marco no aguanta', value: 'Conviene reponer, y lo sabrás antes' },
      { label: 'Alternativa', value: 'Te vendemos la refacción y lo haces tú' },
    ],
    faqs: [
      {
        question: '¿Reparan mosquiteros de cualquier fabricante?',
        answer:
          'La malla sí. Cambiarla no depende de quién hizo el bastidor. Donde no prometemos a ciegas es en <strong>rodamientos y herrajes</strong>, que varían entre fabricantes y no son universales. Mándanos una foto de cerca de la pieza que falla y te confirmamos si la tenemos. Si no la tenemos, también te lo vamos a decir.',
      },
      {
        question: '¿Se llevan la pieza o la reparan en mi casa?',
        answer:
          'Depende de qué sea. Un cambio de rodamientos o un ajuste se resuelve en sitio. Un cambio de malla necesita mesa y tensión pareja, así que normalmente la pieza viaja al taller y vuelve. Sabrás cuál es tu caso cuando mandes la foto, no cuando ya estemos ahí.',
      },
      {
        question: '¿Qué tiene arreglo y qué no?',
        answer:
          'Tiene arreglo casi todo lo que <strong>no</strong> sea el bastidor: malla, rodamientos, felpa, herrajes, cordón. No tiene arreglo un marco vencido, doblado o al que le falta un tramo. Se puede intentar, pero vuelve a fallar. Ese es el criterio completo, y lo contamos a fondo en <a href="/blog/reparar-o-reponer-un-mosquitero">reparar o reponer</a>.',
      },
      {
        question: '¿La malla nueva queda igual que la original?',
        answer:
          'Puede quedar mejor, y conviene aprovecharlo. Si la original se rasgó porque el perro la empujaba, ponerle la misma tela es repetir el problema en unos meses. Al cambiarla puedes pasar a una <strong>malla reforzada</strong> o a otra trama. Cuéntanos qué te pasó y elegimos con eso, no por defecto. Ver <a href="/blog/tipos-de-malla-mosquitero">tipos de malla</a>.',
      },
      {
        question: 'A mi mosquitero le falta una pieza del bastidor, ¿se puede?',
        answer:
          'Si es un remate o una esquina, muchas veces sí. Si falta un tramo de perfil, la estructura ya perdió escuadra y la pieza no va a volver a cerrar bien aunque le pongas tela nueva. Mándanos una foto de cerca. Es de las cosas que se ven al instante.',
      },
      {
        question: '¿Puedo juntar varias piezas para una sola visita?',
        answer:
          'Es lo que recomendamos. Si tienes tres mosquiteros con la malla rota, resolverlos juntos aprovecha mejor el viaje y el material. Mándanos foto de cada uno, porque a veces uno no tiene arreglo y conviene saberlo antes de agendar.',
      },
      {
        question: '¿Y si al desarmarlo ven que no tenía arreglo?',
        answer:
          'Te lo decimos y paramos ahí. Nunca vamos a cambiarte una malla sobre un marco que sabemos que va a fallar: te cobraríamos un trabajo con fecha de caducidad y volverías enfadado, con razón. Preferimos decirte que te conviene una pieza nueva.',
      },
      {
        question: '¿Cambian solo la malla o también los herrajes?',
        answer:
          'Lo que haga falta, y no siempre es lo que crees. Mucha gente pide malla nueva cuando lo que falla es el <strong>rodamiento</strong> —la tela está bien y el mosquitero se traba igual—. Por eso miramos la foto antes: cambiar lo que no era es tirar el dinero dos veces.',
      },
    ],
  },
};

// ── FICHAS — cuerpo de las L4 /mosquiteros/<tipo> ───────────────────────────
// ⭐ Contrato de datos de la plantilla L4: docs/CONTRATO-L4.md §2.
//    Léelo antes de añadir campos o de escribir el equivalente para /servicios
//    y /cobertura — ahí está por qué cada campo existe y qué NO puede decir.
// Añadido el 2026-07-14. AFONDO da para un bloque dentro de la L2 (2 párrafos +
// 4 puntos + galería); una ficha propia necesita más o no se gana su URL: sería
// la L2 recortada, o sea contenido duplicado compitiendo con su propio padre.
//
// QUÉ RESPONDE CADA CAMPO, Y POR QUÉ ESE Y NO OTRO:
//   comoFunciona → el mecanismo. Es lo que la gente no sabe y por lo que busca.
//   encajaEn     → en qué ventana va. La pregunta de compra real.
//   noConviene   → cuándo NO. Es el campo que hace útil la ficha: un catálogo
//                  donde todo sirve para todo no ayuda a decidir, y quien lee
//                  "esto no es para ti" se fía de lo demás que dices.
//   datos        → tabla de referencia rápida. ⚠️ NO son specs del cliente:
//                  son hechos del OFICIO (por dónde abre, dónde se monta, qué
//                  exige del vano). NO metas aquí medidas máximas, materiales
//                  concretos ni precios — nadie los ha validado.
//   faqs         → dudas específicas del tipo. NO pueden repetir las de la home
//                  (8), /mosquiteros (6), /servicios (6) ni /cobertura (6): dos
//                  FAQPage con la misma pregunta compiten y Google descarta uno.
//
// 🟢 Frank confirmó el 2026-07-14 que se fabrican los 6 tipos + accesorios.
// 🟠 TODO el contenido de abajo es conocimiento general del oficio. Sigue SIN
//    preguntarse: materiales, medidas máximas, mallas en stock, acabados,
//    precios, plazos y garantías. Nada aquí los afirma. Ver GATE-LANZAMIENTO §3.
export type FichaDato = { label: string; value: string };
export type FichaTipo = {
  /** Párrafos del bloque "Cómo funciona". 2–3. */
  comoFunciona: readonly string[];
  /** En qué ventana/puerta encaja. Bullets. */
  encajaEn: readonly string[];
  /** Cuándo NO conviene. Bullets. El campo más valioso de la ficha. */
  noConviene: readonly string[];
  /** Tabla de referencia rápida. Hechos del oficio, NO specs del cliente. */
  datos: readonly FichaDato[];
  /** FAQ del tipo. Sin solapar con ninguna otra página del sitio. */
  faqs: readonly { question: string; answer: string }[];
  /**
   * ENLAZADO CONTEXTUAL — slugs de artículos del blog relevantes a ESTE tipo.
   *
   * ⚠️ POR QUÉ ESTE CAMPO EXISTE Y NO ES "más enlaces en el sidebar":
   * Google DESCUENTA el boilerplate — los enlaces idénticos que se repiten en
   * todas las páginas (footer, menú) pesan poco por diseño, porque son
   * navegación, no recomendación. Meter otra lista igual en el sidebar no suma.
   * Lo que sí cuenta es el enlace CONTEXTUAL: el que cambia según la página y
   * dice "esto es relevante para lo que estás leyendo". Por eso aquí cada tipo
   * elige SUS artículos, y por eso los 7 tienen combinaciones distintas.
   *
   * Regla al editar: si acabas poniendo los mismos 4 slugs en los 7 tipos, has
   * vuelto a fabricar boilerplate. Elige por relevancia real al tipo.
   *
   * Los slugs se validan contra la colección en build (ver la guarda de
   * mosquiteros/[categoria].astro): si renombras un .mdx, el build lo dice.
   */
  guias: readonly string[];
  /**
   * Ids de SERVICES relevantes al tipo. Mismo criterio: contextual, no la lista
   * completa. Un enrollable pide medición (por el cajón); unos accesorios, no.
   */
  servicios: readonly string[];
};

export const FICHAS: Record<string, FichaTipo> = {
  enrollables: {
    comoFunciona: [
      'El enrollable trabaja como una persiana: la malla vive enrollada dentro de un cajón que se fija en la parte superior del vano, y baja cuando tiras de ella. Un muelle interno mantiene la tensión, así que la tela queda estirada a cualquier altura y no se descuelga.',
      'Al soltarla, el mecanismo la recoge sola y la malla desaparece dentro del cajón. La ventana vuelve a quedar despejada: sin bastidor a la vista, sin marco que recorte el cristal y sin nada que desmontar para limpiar.',
      'Esa es su gracia y también su condición. El cajón ocupa espacio físico arriba del vano, y ahí es donde el tipo se decide: si no hay unos centímetros libres, el enrollable no entra por bonito que sea.',
    ],
    encajaEn: [
      'Ventanas de uso diario que abres y cierras varias veces',
      'Vanos donde quieres conservar la vista despejada',
      'Ventanas que limpias seguido: no hay bastidor que desmontar',
      'También hay versión para puerta, con guía lateral',
    ],
    noConviene: [
      'Si no hay espacio libre arriba del vano para el cajón',
      'Si el marco llega justo al techo o hay una cortina montada ahí',
      'Si buscas la opción más económica: el mecanismo cuesta más que un bastidor fijo',
      'En una ventana que casi nunca abres: pagarías por un mecanismo que no usas',
    ],
    datos: [
      { label: 'Cómo abre', value: 'La malla baja y sube; se recoge sola' },
      { label: 'Dónde se monta', value: 'Cajón fijo en la parte superior del vano' },
      { label: 'Qué exige del vano', value: 'Unos centímetros libres arriba' },
      { label: 'En reposo', value: 'La malla queda oculta; ventana despejada' },
      { label: 'Versiones', value: 'Para ventana y para puerta' },
      { label: 'Malla', value: 'Se puede cambiar sin reponer el mecanismo' },
    ],
    // El enrollable se decide por el espacio del cajón → medir es crítico.
    // Y su malla vive protegida, así que el mantenimiento es distinto.
    guias: ['como-medir-ventana-mosquitero', 'tipos-de-mosquitero-cual-elegir', 'mantenimiento-limpieza-mosquiteros'],
    servicios: ['medicion', 'fabricacion', 'instalacion'],
    faqs: [
      {
        question: '¿Cuánto espacio necesita el cajón del enrollable?',
        answer:
          'Depende del alto de la ventana. Cuanta más malla hay que enrollar, más grueso es el rollo y más cajón hace falta. Por eso no damos un número en el aire. Con la <strong>medida del vano</strong> sacamos exactamente cuánto ocupa el tuyo y si entra. Mándanos una foto donde se vea la parte de arriba de la ventana, que es la zona que decide.',
      },
      {
        question: '¿El enrollable se puede quedar a medio bajar?',
        answer:
          'Sí. El mecanismo mantiene la tensión a cualquier altura, así que puedes dejarlo donde quieras y ahí se queda. No es como una persiana de golpe: se detiene donde lo sueltas.',
      },
      {
        question: 'Si se rompe la malla del enrollable, ¿hay que cambiar todo?',
        answer:
          'No. La malla se cambia sin tocar el mecanismo ni el cajón, que es la parte cara. Es el mismo criterio que aplicamos con cualquier tipo: si la estructura aguanta, se repone solo la tela. Lo contamos a fondo en <a href="/blog/reparar-o-reponer-un-mosquitero">reparar o reponer</a>.',
      },
      {
        question: '¿El enrollable se instala por dentro o por fuera de la ventana?',
        answer:
          'Casi siempre <strong>por dentro del vano</strong>, que es donde el cajón queda protegido del sol y la lluvia y no se ve desde la calle. Por fuera es posible cuando por dentro no hay fondo, pero el mecanismo sufre más: la intemperie es lo que más acorta la vida de cualquier pieza con muelle. Lo definimos en la medición, viendo tu ventana.',
      },
      {
        question: 'Mi enrollable no sube o se atora, ¿qué le pasa?',
        answer:
          'Lo más común es que la malla se haya enrollado <strong>torcida</strong> dentro del cajón —pasa cuando se suelta de golpe o se baja jalando de una esquina— o que haya tierra en las guías laterales. Las dos cosas se corrigen sin cambiar la pieza. Si el muelle perdió tensión, eso ya es mecanismo y hay que verlo. Mándanos un video corto del movimiento: se diagnostica mejor que con una foto.',
      },
      {
        question: '¿La versión de puerta funciona igual que la de ventana?',
        answer:
          'El principio es el mismo —malla enrollada en un cajón— pero en puerta el recorrido es <strong>horizontal</strong> en vez de vertical: la malla sale de un lateral y cruza el vano. Eso pide una guía a ras de suelo para que no se descuelgue. Si esa guía te estorba al pasar, dilo: para puertas de paso diario a veces conviene más un abatible o un magnético.',
      },
      {
        question: '¿El mecanismo hace ruido al subir?',
        answer:
          'Un enrollable en buen estado sube con un siseo suave, no de golpe. Si el tuyo hace un chasquido seco o vibra, suele ser exceso de tensión o suciedad en la guía, y se ajusta. El ruido no es normal y no es algo que tengas que aguantar.',
      },
      {
        question: '¿El sol acaba dañando la malla del enrollable?',
        answer:
          'A la malla le afecta como a cualquier tela expuesta, pero el enrollable tiene una ventaja aquí: <strong>cuando no lo usas, la malla vive dentro del cajón</strong>, a la sombra. En una ventana que da al poniente eso alarga bastante su vida frente a un bastidor fijo que está expuesto las 24 horas. Si tu caso es de sol duro, dilo al cotizar y lo tomamos en cuenta al elegir malla.',
      },
    ],
  },

  corredizos: {
    comoFunciona: [
      'El corredizo es un bastidor de aluminio con la malla tensada que corre sobre un riel, igual que la hoja de tu ventana. Se desplaza a un lado cuando quieres abrir el cristal y vuelve a su sitio cuando lo cierras.',
      'Aprovecha la infraestructura que ya tienes: si tu ventana corre, hay riel; y si hay riel, hay dónde montarlo. Por eso suele ser la opción directa en la mayoría de las ventanas mexicanas, que son corredizas de fábrica.',
      'Al llevar bastidor rígido, la pieza es sólida y la malla se cambia sin tocar nada más. A cambio, el marco queda a la vista sobre el cristal. No desaparece como el enrollable.',
    ],
    encajaEn: [
      'Ventanas y puertas que ya corren sobre riel',
      'El caso más común en casa y departamento',
      'Vanos donde no hay espacio arriba para un cajón',
      'Cuando quieres una pieza sólida y fácil de reparar',
    ],
    noConviene: [
      'Si tu ventana no es corrediza: no hay riel donde montarlo',
      'Si quieres que la malla desaparezca cuando no la usas',
      'En vanos muy anchos de una sola hoja: ahí trabaja mejor un plisado',
    ],
    datos: [
      { label: 'Cómo abre', value: 'Corre lateralmente sobre riel' },
      { label: 'Dónde se monta', value: 'En el riel de la ventana corrediza' },
      { label: 'Qué exige del vano', value: 'Que la ventana ya corra sobre riel' },
      { label: 'En reposo', value: 'El bastidor queda a un lado, visible' },
      { label: 'Versiones', value: 'Ventana corrediza y puerta corrediza' },
      { label: 'Malla', value: 'Se cambia sin desmontar el bastidor' },
    ],
    // El caso más común: mucha gente llega con uno roto y duda si reponer.
    guias: ['tipos-de-mosquitero-cual-elegir', 'reparar-o-reponer-un-mosquitero', 'mantenimiento-limpieza-mosquiteros'],
    servicios: ['fabricacion', 'instalacion', 'reparacion'],
    faqs: [
      {
        question: '¿El mosquitero corredizo va por dentro o por fuera?',
        answer:
          'Depende de cómo esté armada tu ventana y de qué carril quede libre. Lo resolvemos en la medición, porque la posición correcta es la que deja pasar la hoja de cristal sin rozar el mosquitero. Si nos mandas una foto del riel completo, lo aclaramos antes de ir.',
      },
      {
        question: '¿Por qué mi mosquitero corredizo se traba o se sale del riel?',
        answer:
          'Casi siempre son los <strong>rodamientos</strong>, que se gastan o se llenan de tierra, o el riel, que acumula basura. Rara vez es la malla. Suele resolverse cambiando rodamientos y limpiando el carril, sin reponer la pieza. Si el bastidor está deformado ya es otra historia y te lo diremos.',
      },
      {
        question: '¿Puedo quitar el corredizo para lavarlo?',
        answer:
          'Sí, se desmonta del riel. Es una de sus ventajas: puedes sacarlo, lavarlo con agua y jabón suave y volver a ponerlo. Lo explicamos con más detalle en <a href="/blog/mantenimiento-limpieza-mosquiteros">cómo limpiar y mantener tus mosquiteros</a>.',
      },
      {
        question: '¿Cuántas hojas de mosquitero necesito para mi ventana corrediza?',
        answer:
          'Depende de cuántas hojas de cristal tenga y de cuáles abras. Una ventana de dos hojas donde solo corre una necesita <strong>un</strong> mosquitero, no dos. El otro lado es cristal fijo y por ahí no entra nada. Si abres las dos, entonces sí. Mándanos una foto de la ventana completa y sacamos cuántas piezas son. Cotizamos por pieza, así que la cuenta importa.',
      },
      {
        question: '¿Se puede poner un corredizo en una ventana de aluminio viejo?',
        answer:
          'Casi siempre sí, y de hecho es el caso más común que vemos. Lo que revisamos no es la edad sino el <strong>estado del riel</strong>. Si el carril está entero y la ventana corre, hay dónde montar. Si está vencido o le falta un tramo, eso se resuelve primero, y lo vas a saber antes de que fabriquemos, no después.',
      },
      {
        question: '¿Se ve el marco del mosquitero desde adentro?',
        answer:
          'Sí, y es honesto decirlo: el corredizo lleva bastidor rígido, así que hay un perfil de aluminio recorriendo el borde de esa hoja. Se ve. Si lo que quieres es que la ventana quede completamente despejada, ese es el argumento a favor del <a href="/mosquiteros/enrollables">enrollable</a>, que esconde la malla en su cajón.',
      },
      {
        question: '¿Qué pasa si mi riel está doblado?',
        answer:
          'Un riel doblado hace que el mosquitero se trabe o se salga, aunque la pieza esté perfecta. Fabricar sobre un riel torcido es tirar el dinero, porque la pieza nueva se va a trabar igual. Lo vemos en la medición y lo hablamos ahí. A veces se endereza; a veces hay que reponer el carril.',
      },
      {
        question: '¿Puedo tener mosquitero corredizo y cortina a la vez?',
        answer:
          'Sí: van en planos distintos. El mosquitero corre en el riel de la ventana, por fuera del cristal; la cortina va dentro de la habitación. No se estorban. Lo único a revisar es si tu cortinero baja tanto que impida sacar el mosquitero para limpiarlo. Eso lo miramos en la visita.',
      },
    ],
  },

  abatibles: {
    comoFunciona: [
      'El abatible es una hoja con bastidor que se abre girando sobre bisagras, como una puerta. Lleva cierre automático —un muelle o un pistón— que la devuelve a su posición en cuanto la sueltas.',
      'Está pensado para el paso, no para la ventilación: aguanta que lo abran y cierren decenas de veces al día sin que nadie tenga que acordarse de cerrarlo. Por eso es lo que va en la puerta por la que entra y sale toda la familia.',
      'Necesita una condición de espacio: la hoja tiene que poder abrirse hacia algún lado. Si hay un mueble, un muro o una maceta en su arco, no funciona.',
    ],
    encajaEn: [
      'Puertas de acceso que se usan todo el día',
      'Salidas al patio, al jardín o a la terraza',
      'Donde entras y sales con las manos ocupadas',
      'Ventanas abatibles que se abren hacia fuera',
    ],
    noConviene: [
      'Si no hay espacio para que la hoja gire hacia dentro o hacia fuera',
      'En una ventana corrediza: no hay dónde anclar las bisagras',
      'En vanos muy anchos: una hoja grande pesa y vence las bisagras con el tiempo',
    ],
    datos: [
      { label: 'Cómo abre', value: 'Gira sobre bisagras, como una puerta' },
      { label: 'Cierre', value: 'Automático: vuelve solo al soltarlo' },
      { label: 'Dónde se monta', value: 'Al marco de la puerta o ventana' },
      { label: 'Qué exige del vano', value: 'Espacio libre para el arco de apertura' },
      { label: 'Uso previsto', value: 'Paso frecuente de personas' },
      { label: 'Versiones', value: 'Puerta de acceso y ventana abatible' },
    ],
    // Puerta de paso: la malla decide (mascotas, niños). Y el marco manda,
    // así que la medición a domicilio es casi obligada.
    guias: ['tipos-de-malla-mosquitero', 'como-medir-ventana-mosquitero', 'que-preguntar-antes-de-contratar-mosquiteros'],
    servicios: ['medicion', 'fabricacion', 'instalacion'],
    faqs: [
      {
        question: '¿Hacia dónde abre el mosquitero abatible?',
        answer:
          'Se define en la medición, según por dónde tengas espacio y hacia dónde abra tu puerta. Lo normal es que abra al contrario que la puerta principal para que las dos hojas no choquen. Es una decisión que conviene tomar antes de fabricar: cambiarla después implica reperforar el marco.',
      },
      {
        question: '¿El cierre automático da un portazo?',
        answer:
          'No debería. El mecanismo está regulado para acompañar la hoja hasta cerrar, no para soltarla. Si el tuyo azota, normalmente es cuestión de ajustar la tensión. Lo revisamos en la instalación antes de irnos, y si aparece después, se vuelve a ajustar.',
      },
      {
        question: '¿Aguanta que lo empujen los niños o el perro?',
        answer:
          'El bastidor sí; la malla depende de cuál elijas. Si hay mascotas o niños que van a empujar la hoja con el cuerpo, conviene una <strong>malla reforzada</strong> en vez de la estándar. Dinos que es una puerta de paso diario y lo tomamos en cuenta al cotizar. Ver <a href="/blog/tipos-de-malla-mosquitero">tipos de malla</a>.',
      },
      {
        question: '¿Necesito perforar mi puerta para instalar el abatible?',
        answer:
          'Las bisagras se atornillan al <strong>marco</strong>, no a tu puerta: la puerta sigue funcionando igual y no se toca. Sí hay perforación en el marco, que es lo que sostiene la hoja. Una hoja de paso diario necesita anclaje real. Si tu marco es de un material que no admite tornillo, lo vemos en la medición antes de fabricar.',
      },
      {
        question: '¿Qué pasa si el marco de mi puerta es muy delgado?',
        answer:
          'Es la primera cosa que revisamos, porque de ahí cuelga todo el peso de la hoja. Un marco delgado puede necesitar un refuerzo o una configuración distinta. Es justo el tipo de cosa que no se ve en una foto y sí en la <a href="/servicios/medicion">medición a domicilio</a>: preferimos ir a ver que fabricar a ciegas una pieza que después se vence.',
      },
      {
        question: '¿El abatible lleva chapa o seguro?',
        answer:
          'No es una puerta de seguridad y no la vendemos como tal. Es una hoja de malla para que no entren insectos, no para que no entre nadie. Su cierre es el mecanismo automático, que la mantiene junta. Si lo que buscas es seguridad, eso es otro producto y no es el nuestro.',
      },
      {
        question: '¿Puedo poner un abatible si mi puerta es de cristal?',
        answer:
          'Depende de dónde ancle. Si la puerta de cristal tiene un marco perimetral donde morder, normalmente sí. Si es cristal templado a hueso, sin marco, no hay dónde poner las bisagras y ahí conviene un <a href="/mosquiteros/plisados">plisado</a>, que se monta al vano y no a la puerta. Mándanos foto del canto de la puerta.',
      },
      {
        question: '¿Hacia qué lado conviene que abra?',
        answer:
          'La regla práctica: <strong>al contrario que tu puerta principal</strong>, para que las dos hojas no se peleen al pasar. Después manda el espacio real. Si de un lado hay una maceta, un muro o el arco de otra puerta, ese lado se descarta solo. Se decide en la medición y conviene decidirlo bien: cambiarlo luego implica reperforar el marco.',
      },
    ],
  },

  plisados: {
    comoFunciona: [
      'El plisado lleva la malla plegada en acordeón dentro de un perfil lateral. Al correrlo, la tela se despliega guiada por un riel inferior y superior; al recogerlo, se pliega sobre sí misma y se reduce a unos pocos centímetros contra el marco.',
      'Resuelve lo que los demás tipos no alcanzan: puertas de cristal, ventanales anchos y accesos amplios que un bastidor rígido no cubre de una pieza sin volverse pesado e inmanejable.',
      'Como se pliega casi por completo, en reposo no tapa la vista. Es la opción cuando el vano es grande y no quieres renunciar ni al paso ni al paisaje.',
    ],
    encajaEn: [
      'Vanos amplios que otros tipos no cubren de una pieza',
      'Puertas corredizas de cristal',
      'Accesos anchos a terraza o jardín',
      'Cuando quieres que la malla casi desaparezca al recogerla',
    ],
    noConviene: [
      'En vanos pequeños: un corredizo sale más simple y más económico',
      'Si el riel inferior te estorba al pasar (hay quien lo nota)',
      'Si buscas lo más barato: es de los tipos con más mecanismo',
    ],
    datos: [
      { label: 'Cómo abre', value: 'La malla se pliega en acordeón hacia el lado' },
      { label: 'Dónde se monta', value: 'Perfil lateral + riel de guía' },
      { label: 'Qué exige del vano', value: 'Riel inferior y superior a lo largo' },
      { label: 'En reposo', value: 'Plegado contra el marco: casi no se ve' },
      { label: 'Uso previsto', value: 'Vanos amplios y puertas de cristal' },
      { label: 'Versiones', value: 'Una hoja o dos que se juntan al centro' },
    ],
    // Vanos grandes = más pieza = más precio: la guía de precio es la que
    // más se consulta aquí. Y el vano amplio casi siempre pide visita.
    guias: ['de-que-depende-el-precio-de-un-mosquitero', 'como-medir-ventana-mosquitero', 'por-que-mosquiteros-a-medida'],
    servicios: ['medicion', 'fabricacion', 'instalacion'],
    faqs: [
      {
        question: '¿El riel del plisado se nota al pasar?',
        answer:
          'Un poco, sí, y es honesto decirlo. El plisado necesita guía abajo para que la malla no se descuelgue, así que hay un perfil a ras de suelo. Es bajo, pero está. Si en tu caso eso es un problema (silla de ruedas, carriola, tropiezos), dilo y buscamos otro tipo.',
      },
      {
        question: '¿Cuánto ocupa el plisado cuando está recogido?',
        answer:
          'Se reduce a unos pocos centímetros contra el marco. Junto con el enrollable, es el tipo que menos estorba en reposo. Cuánto exactamente depende del ancho del vano, porque a más malla, más grueso el paquete plegado. Con tu medida sacamos el número.',
      },
      {
        question: '¿Se puede poner un plisado en un vano muy ancho?',
        answer:
          'Es justo para lo que sirve. Si el vano es muy grande, a veces conviene <strong>dos hojas que se juntan al centro</strong> en vez de una sola que recorra todo. Pásanos el ancho y vemos qué configuración corresponde.',
      },
      {
        question: '¿El plisado aguanta que lo abran y cierren todos los días?',
        answer:
          'Sí, pero con una diferencia importante frente al abatible: el plisado <strong>no cierra solo</strong>. Hay que correrlo de vuelta. En una puerta por la que sales con las manos ocupadas, eso significa que la vas a dejar abierta. Y un mosquitero abierto no sirve de nada. Si ese es tu caso, mira el <a href="/mosquiteros/magneticos">magnético</a>: se cierra solo detrás de ti.',
      },
      {
        question: 'Se me salió la malla de la guía, ¿tiene arreglo?',
        answer:
          'Normalmente sí y sin reponer la pieza. El plisado se sale de guía cuando se corre de golpe, cuando se fuerza desde una esquina o cuando hay basura en el riel inferior, que está a ras de suelo y recoge de todo. Se reencarrila y se limpia. Si el perfil quedó deformado, eso ya hay que verlo.',
      },
      {
        question: '¿Cómo se limpia una malla plegada?',
        answer:
          'Extendida, no plegada: la corres, la dejas abierta y pasas un paño húmedo o la aspiradora a potencia baja. Lo que no conviene es meterle chorro de agua a presión. El pliegue guarda la humedad, y el mecanismo lateral no está para empaparse. Más detalle en <a href="/blog/mantenimiento-limpieza-mosquiteros">mantenimiento y limpieza</a>.',
      },
      {
        question: '¿Puedo poner un plisado en una ventana normal?',
        answer:
          'Se puede, pero rara vez conviene, y mejor decirlo de entrada. En un vano chico, un <a href="/mosquiteros/corredizos">corredizo</a> hace lo mismo con menos mecanismo y más barato. El plisado se gana su sitio cuando el vano es grande o es una puerta de cristal. Ahí no tiene rival. En una ventana de baño, es pagar de más.',
      },
      {
        question: '¿El riel de arriba se ve mucho?',
        answer:
          'Hay un perfil superior y otro inferior: son los que guían la malla y sin ellos se descuelga. El superior queda a la altura del marco y se disimula; el de abajo está a ras de suelo y ese sí se nota al pasar. Es el precio de cubrir un vano que ningún bastidor rígido cubre de una pieza.',
      },
    ],
  },

  magneticos: {
    comoFunciona: [
      'El magnético es una cortina de malla partida al centro, con una banda de imanes cosida a lo largo de la unión. Empujas con el cuerpo, las dos hojas se separan para dejarte pasar y, detrás de ti, los imanes se buscan y vuelven a cerrar la abertura.',
      'No lleva bastidor rígido: se fija al marco existente con cinta o tachuelas, sin obra y sin perforar nada estructural. Es el tipo que menos intervención pide.',
      'Su lógica es distinta a la de los demás: no está pensado para taparse y destaparse, sino para atravesarlo. Por eso vive en puertas, no en ventanas.',
    ],
    encajaEn: [
      'Puertas por las que pasas con las manos ocupadas',
      'Salida a la cocina, al patio o al tendedero',
      'Cuando no quieres obra ni perforar el marco',
      'Casas con mascotas que entran y salen solas',
    ],
    noConviene: [
      'En ventanas: está pensado para pasar a través, no para abrirse',
      'Si buscas una pieza rígida y de aspecto sólido',
      'Donde pega mucho viento: la cortina se mueve',
    ],
    datos: [
      { label: 'Cómo abre', value: 'Se atraviesa empujando; cierra solo' },
      { label: 'Cierre', value: 'Banda de imanes a lo largo del centro' },
      { label: 'Dónde se monta', value: 'Sobre el marco existente' },
      { label: 'Qué exige del vano', value: 'Nada estructural: sin obra' },
      { label: 'Uso previsto', value: 'Puertas de paso frecuente' },
      { label: 'Bastidor', value: 'No lleva: es cortina flexible' },
    ],
    // Es el tipo que más se autoinstala: pesa la malla y el proceso, no la
    // medición fina.
    guias: ['tipos-de-malla-mosquitero', 'como-trabajamos-de-la-medida-a-la-instalacion', 'tipos-de-mosquitero-cual-elegir'],
    servicios: ['fabricacion', 'instalacion'],
    faqs: [
      {
        question: '¿El mosquitero magnético se abre solo con el viento?',
        answer:
          'Con viento fuerte la cortina se mueve, sí, y es lo más honesto que te podemos decir: no lleva bastidor, así que no es rígida. En una puerta protegida funciona muy bien; en una fachada expuesta al viento conviene un abatible, que sí cierra firme.',
      },
      {
        question: '¿Los imanes se despegan con el tiempo?',
        answer:
          'Los imanes van cosidos a la tela, no pegados, así que no se caen. Lo que sí puede perder fuerza es la sujeción al marco si se montó con cinta en una superficie sucia o porosa. Por eso preparamos la superficie antes de fijar: es la diferencia entre que aguante años o meses.',
      },
      {
        question: '¿Sirve para que entre y salga mi perro?',
        answer:
          'Es probablemente el tipo que mejor lo resuelve: el animal aprende a empujar y la cortina cierra sola detrás. Dinos el tamaño de la mascota al cotizar, porque influye en la altura a la que conviene rematar y en qué malla aguanta el uso.',
      },
      {
        question: '¿El mosquitero magnético se puede lavar?',
        answer:
          'Sí, y es de los más fáciles: se desmonta del marco y se lava a mano con agua y jabón suave. Lo que no conviene es lavadora ni secadora. El calor y el tambor maltratan la banda de imanes y deforman la caída de la tela, que es justo lo que hace que cierre bien.',
      },
      {
        question: '¿Se puede cortar a la medida de mi puerta?',
        answer:
          'No hace falta cortarlo: lo <strong>fabricamos</strong> a la medida de tu vano, igual que los demás tipos. Recortar una cortina genérica deja el borde sin rematar y por ahí se deshilacha. Mándanos el ancho y el alto y sale a tu medida desde el principio.',
      },
      {
        question: '¿Deja pasar el aire igual que un mosquitero con bastidor?',
        answer:
          'Sí: es la misma malla, así que el paso de aire es el mismo. La diferencia no está en la ventilación, está en la rigidez. El magnético es cortina y se mueve; el bastidor no. Por eso el magnético va en puertas y no en ventanas.',
      },
      {
        question: '¿Se nota mucho desde la calle?',
        answer:
          'Se ve, sí: es una cortina de malla cubriendo tu puerta, no desaparece. Es el tipo con la instalación más discreta —no lleva perfil de aluminio a la vista— pero la tela está ahí. Si buscas que no se note nada cuando no lo usas, ninguno de los tipos de puerta te va a dar eso.',
      },
      {
        question: '¿Puedo instalarlo yo mismo?',
        answer:
          'Es el único tipo del que te diríamos que sí sin reservas: se fija al marco, sin obra ni herramienta especial. Donde la gente falla es en la preparación de la superficie. Si la fijas sobre polvo o pintura descascarada, se despega en semanas. Si prefieres no arriesgarte, lo instalamos nosotros.',
      },
    ],
  },

  fijos: {
    comoFunciona: [
      'El fijo es lo más simple que hay: un bastidor de aluminio con la malla tensada, montado al vano de forma permanente. No corre, no se enrolla, no se abate. Se pone y se queda.',
      'Precisamente por eso es el más económico y el que menos se estropea: no hay mecanismo, rodamiento ni muelle que falle. Lo único que puede pasarle es que se rompa la malla, y eso se cambia.',
      'Cubre la ventana de forma continua, así que resuelve donde no hace falta abrir: cubos de luz, baños, ventanas altas, cocinas con ventana de ventilación.',
    ],
    encajaEn: [
      'Ventanas que casi nunca abres',
      'Cubos de luz, baños y ventanas altas',
      'Ventilaciones de cocina o lavadero',
      'Cuando buscas lo más económico y sin mantenimiento',
    ],
    noConviene: [
      'Si necesitas asomarte por esa ventana',
      'Si limpias el cristal seguido: hay que desmontarlo',
      'En una puerta o paso: no se abre',
    ],
    datos: [
      { label: 'Cómo abre', value: 'No abre: es una pieza fija' },
      { label: 'Dónde se monta', value: 'Fijado al marco del vano' },
      { label: 'Qué exige del vano', value: 'Nada especial' },
      { label: 'Mecanismo', value: 'Ninguno: nada que se descomponga' },
      { label: 'Uso previsto', value: 'Ventanas de poco o nulo uso' },
      { label: 'Malla', value: 'Se cambia reponiendo la tela del bastidor' },
    ],
    // El argumento del fijo es el precio: enlazar ahí. Y 'por qué a medida'
    // explica por qué un fijo barato sigue sin ser de línea.
    guias: ['de-que-depende-el-precio-de-un-mosquitero', 'por-que-mosquiteros-a-medida', 'tipos-de-mosquitero-cual-elegir'],
    servicios: ['fabricacion', 'instalacion'],
    faqs: [
      {
        question: '¿Cómo limpio el cristal si el mosquitero es fijo?',
        answer:
          'Desmontándolo. No es difícil —va sujeto al marco, no soldado— pero tampoco es algo que quieras hacer cada semana. Por eso el fijo va en ventanas que casi no tocas: si esa ventana la limpias seguido, te conviene un corredizo aunque cueste más.',
      },
      {
        question: '¿El mosquitero fijo se puede quitar en invierno?',
        answer:
          'Se puede desmontar y volver a montar, sí. Pero ten en cuenta que cada desmontaje es una oportunidad de doblar el bastidor o aflojar la sujeción. Si tu idea es quitarlo y ponerlo por temporadas, mejor dinos: quizá te convenga otro tipo.',
      },
      {
        question: '¿Por qué el fijo es más barato?',
        answer:
          'Porque no lleva mecanismo: ni rodamientos, ni muelle, ni bisagras, ni cajón. Solo bastidor y malla. Eso baja el costo y de paso elimina casi todo lo que puede fallar con el tiempo. De qué depende el precio en general lo contamos en <a href="/blog/de-que-depende-el-precio-de-un-mosquitero">esta guía</a>.',
      },
      {
        question: '¿Y si necesito abrir esa ventana en una emergencia?',
        answer:
          'Es la pregunta correcta, y conviene pensarla <strong>antes</strong> de instalar. El fijo se desmonta, pero no en segundos y no sin herramienta. Si esa ventana es tu salida de emergencia o la única ventilación de un cuarto con calentador, no pongas fijo. Ahí va un corredizo o un abatible aunque cueste más. Cuéntanos el uso real de la ventana y lo resolvemos con eso.',
      },
      {
        question: '¿El fijo se pone por dentro o por fuera?',
        answer:
          'Las dos son posibles y lo define tu marco. Por dentro queda protegido y no se ve desde la calle; por fuera se usa cuando el vano no tiene fondo suficiente. En una ventana alta o un cubo de luz suele ir por dentro, porque montarlo por fuera implica trabajar en altura cada vez que haya que limpiarlo.',
      },
      {
        question: '¿Sirve para un tragaluz o un cubo de luz?',
        answer:
          'Es prácticamente su caso ideal: son vanos que nadie abre, difíciles de alcanzar, donde lo último que quieres es un mecanismo al que haya que darle mantenimiento en altura. Un bastidor sin partes móviles ahí dura años sin que tengas que tocarlo.',
      },
      {
        question: '¿Cómo se sujeta si no lleva riel ni bisagras?',
        answer:
          'Con herrajes de fijación al marco del vano. No va pegado ni a presión. Eso es justo lo que se cae con el primer viento. Va anclado, y por eso se puede desmontar cuando toque cambiar la malla sin romper nada.',
      },
      {
        question: '¿Puedo cambiar un fijo por un corredizo más adelante?',
        answer:
          'Se puede, pero es una pieza nueva: el corredizo necesita riel y el fijo no lo tiene. No es una conversión, es reponer. Por eso conviene acertar de entrada. Si tienes dudas de si vas a querer abrir esa ventana, dilo ahora y te recomendamos el corredizo desde el principio.',
      },
    ],
  },

  accesorios: {
    comoFunciona: [
      'Vendemos por separado las piezas con las que se arma un mosquitero: malla por metro, perfiles de aluminio para el bastidor, herrajes, rodamientos, felpa y el cordón que tensa la tela contra el marco.',
      'Sirve para dos casos. El primero: reparas por tu cuenta y solo necesitas la refacción concreta que se rompió. El segundo: tienes varias piezas iguales y prefieres tener repuestos a mano.',
      'Si prefieres no meterte, el cambio también lo hacemos nosotros. Cuéntanos qué se dañó y vemos si te sale mejor la pieza suelta o el servicio.',
    ],
    encajaEn: [
      'Reparaciones por cuenta propia',
      'Cambiar solo la malla de una pieza que ya tienes',
      'Reponer rodamientos, felpa o herrajes gastados',
      'Tener repuestos si administras varias piezas',
    ],
    noConviene: [
      'Si no tienes claro qué pieza es la que falla: mándanos foto primero',
      'Si el bastidor está deformado: la refacción no lo arregla',
      'Si nunca has armado uno: a veces sale mejor el servicio',
    ],
    datos: [
      { label: 'Qué vendemos', value: 'Malla por metro, perfiles, herrajes' },
      { label: 'También', value: 'Rodamientos, felpa y cordón de tensión' },
      { label: 'Para quién', value: 'Quien repara por su cuenta' },
      { label: 'Alternativa', value: 'El cambio lo podemos hacer nosotros' },
      { label: 'Antes de pedir', value: 'Mándanos foto de la pieza dañada' },
    ],
    // Quien compra refacciones repara: reparar-o-reponer y malla son SU
    // decisión. No necesita medición ni instalación.
    guias: ['reparar-o-reponer-un-mosquitero', 'tipos-de-malla-mosquitero', 'mantenimiento-limpieza-mosquiteros'],
    servicios: ['reparacion'],
    faqs: [
      {
        question: '¿Cómo sé qué refacción necesito?',
        answer:
          // Aquí decía "Es gratis preguntar". En contexto hablaba del mensaje,
          // no del servicio — pero "gratis" es una de las palabras que este
          // archivo tiene prohibidas (ver el aviso en `medicion`), y no aportaba
          // nada. Si alguien la lee rápido, entiende que el diagnóstico no se
          // cobra. Preferimos la frase sin el gancho.
          'Mándanos una <strong>foto de la pieza dañada</strong>, de cerca y con la parte que falla a la vista. Los perfiles y los rodamientos varían entre fabricantes, así que a ojo desde un mensaje de texto no acertamos. Con la foto sí. Preguntar antes te ahorra comprar la pieza equivocada.',
      },
      {
        question: '¿Venden la malla por metro?',
        answer:
          'Sí, y en distintos tipos según lo que necesites aguantar: mascotas, sol o insectos más chicos. Dinos cuántos metros y para qué caso, que la elección de malla importa más que la cantidad. Ver <a href="/blog/tipos-de-malla-mosquitero">tipos de malla</a>.',
      },
      {
        question: '¿Me conviene repararlo yo o que lo hagan ustedes?',
        answer:
          'Si es cambiar la malla de un bastidor sano y tienes paciencia, se puede hacer en casa. Si hay que cambiar rodamientos, ajustar herrajes o el bastidor está torcido, suele salir mejor el servicio. La refacción es barata; el rato que se va en acertar, no. Cuéntanos el caso y lo vemos sin adornos.',
      },
      {
        question: '¿Puedo comprar solo el bastidor sin malla?',
        answer:
          'Se puede, aunque casi nunca es lo que la gente necesita. El bastidor es justo lo que menos se rompe. Si tu marco está entero y solo se rasgó la tela, lo que buscas es <strong>malla y cordón</strong>, no perfil. Mándanos foto de lo que se dañó y te orientamos con qué pedir, que nos ahorra la devolución y a ti el gasto.',
      },
      {
        question: '¿Qué herramienta necesito para cambiar la malla?',
        answer:
          'Poca: un rodillo para meter el cordón en la ranura, unas tijeras y paciencia. Lo que decide el resultado no es la herramienta, es la <strong>tensión</strong>. Si la dejas floja hace bolsa; si la estiras de más, deforma el bastidor. El truco es ir metiendo el cordón por tramos alternos, no de corrido.',
      },
      {
        question: '¿Venden mosquiteros armados para instalarlos yo?',
        answer:
          'Sí: la instalación es un servicio aparte, no una obligación. Si nos das las medidas y quieres solo la pieza, te la fabricamos y la recoges o te la llevamos. Ojo con lo obvio: si la medida está mal, la pieza no entra y ya está hecha a esa medida. Por eso insistimos en <a href="/blog/como-medir-ventana-mosquitero">cómo medir bien</a>.',
      },
      {
        question: '¿Tienen refacciones para mosquiteros de otra marca?',
        answer:
          'Muchas veces sí, pero no lo prometemos a ciegas. Los perfiles, y sobre todo los rodamientos, varían entre fabricantes y hay medidas que no son universales. Mándanos una foto de cerca de la pieza dañada y te confirmamos si la tenemos. Si no la tenemos, también te lo vamos a decir.',
      },
      {
        question: '¿Cuánta malla necesito para mi ventana?',
        answer:
          'La medida del vano más un margen para tensarla y rematarla. Si compras justo, no alcanza. Pásanos el ancho y el alto y sacamos cuánto pedir. Y aprovecha para contarnos el caso, sea el perro, el sol o los mosquitos chicos, porque acertar el <a href="/blog/tipos-de-malla-mosquitero">tipo de malla</a> importa más que la cantidad.',
      },
    ],
  },
};

// ── ZONAS A FONDO — cuerpo de la L2 /cobertura y sus fichas ─────────────────
// Añadido el 2026-07-14. COVERAGE_STATES solo tiene slug/label/type: suficiente
// para un enlace en el footer, no para una L2. Mismo shape que AFONDO y
// SERVICIOS_AFONDO — así /cobertura usa los MISMOS componentes que las otras dos.
//
// 🟢 Frank confirmó (2026-07-14) que se atiende CDMX y Edomex, y que el trabajo
//    ocurre en el domicilio del cliente (no hay mostrador).
// 🟠 El resto es redacción sobre esos dos hechos + geografía pública (que el
//    Edomex es grande y disperso no lo inventa nadie). NO se dice:
//      · qué municipios concretos se cubren   ← nadie lo ha preguntado
//      · cuánto se tarda en llegar            ← no hay dato
//      · si la visita se cobra                ← no hay dato
//
// ⚠️ NO AMPLÍES ESTO CON UNA LISTA DE COLONIAS. La tentación en negocios locales
// es clonar la ficha por cada colonia ("Mosquiteros en Coyoacán", "…en Polanco")
// cambiando el nombre: son DOORWAY PAGES y Google las penaliza explícitamente —
// puede caer el dominio entero, no solo esas páginas. Dos zonas con sustancia
// valen más que cincuenta clonadas. Si el cliente da datos REALES por municipio
// (tiempos, condiciones, trabajos hechos ahí), eso sí gana su propia página.
export type ZonaAfondo = {
  /** Copy de la tarjeta en la vitrina. */
  blurb: string;
  body: readonly string[];
  points: readonly string[];
  /** Lo que hay que decirnos para confirmar cobertura en esta zona. */
  confirmar: string;
  gallery: { main: AfondoImage; thumbs: readonly AfondoImage[] };
};

export const ZONAS_AFONDO: Record<string, ZonaAfondo> = {
  cdmx: {
    blurb:
      'Cobertura completa en las 16 alcaldías: vamos, medimos, fabricamos a esa medida y volvemos a instalar.',
    gallery: {
      main: { src: '/images/zonas/cdmx-1.svg', alt: 'Instalación de mosquiteros en una casa de la Ciudad de México' },
      thumbs: [
        { src: '/images/zonas/cdmx-2.svg', alt: 'Ventana de un edificio de CDMX con mosquitero instalado' },
        { src: '/images/zonas/cdmx-3.svg', alt: 'Camioneta de trabajo llegando al domicilio del cliente' },
      ],
    },
    body: [
      'La Ciudad de México es nuestra zona de trabajo diaria. Atendemos las 16 alcaldías sin distinguir: la misma visita para medir, la misma fabricación a medida y la misma instalación, estés donde estés dentro de la ciudad.',
      'Aquí la mayoría de los vanos son de departamento o casa en colonia consolidada, así que el caso típico se resuelve con corredizos y enrollables. Pero eso lo define tu ventana, no la zona. Mándanos una foto y vemos cuál corresponde.',
    ],
    points: [
      'Las 16 alcaldías, sin zonas excluidas',
      'Medición, fabricación e instalación en el mismo trabajo',
      'Vamos a tu domicilio: no hay que llevar nada a ningún taller',
      'También reparación y cambio de malla si ya tienes las piezas',
    ],
    confirmar: 'Con tu alcaldía y una foto de la ventana basta para arrancar.',
  },
  edomex: {
    blurb:
      'Atendemos buena parte del Estado de México. Como es un área grande, confírmanos tu municipio antes de agendar.',
    gallery: {
      main: { src: '/images/zonas/edomex-1.svg', alt: 'Instalación de mosquiteros en una casa del Estado de México' },
      thumbs: [
        { src: '/images/zonas/edomex-2.svg', alt: 'Puerta de patio con mosquitero instalado en Edomex' },
        { src: '/images/zonas/edomex-3.svg', alt: 'Medición a domicilio de una ventana en el Estado de México' },
      ],
    },
    body: [
      'El Estado de México no es una zona: son 125 municipios repartidos en un área enorme, desde los que pegan con la ciudad hasta los que están a dos horas. Por eso aquí no decimos "cubrimos Edomex" y ya. Depende de dónde estés exactamente.',
      'Lo que sí podemos prometer es una respuesta rápida y honesta: dinos tu municipio y te confirmamos en el momento si llegamos. Preferimos decirte que no de entrada a hacerte esperar una visita que no va a pasar.',
    ],
    points: [
      'Buena parte del área, sobre todo la conurbada con CDMX',
      'Confírmanos tu municipio antes de agendar: te respondemos al momento',
      'Mismo trabajo que en la ciudad: medimos, fabricamos e instalamos',
      'Si no llegamos a tu zona, lo sabrás de una vez',
    ],
    confirmar: 'Dinos tu municipio y colonia junto con las medidas. Con eso confirmamos cobertura y precio de una vez.',
  },
};

// ── BRANCHES — sucursales (opcional) ─────────────────────────────────────────
// Si el negocio no tiene sucursales, déjalo como []; el Footer omite el bloque.
// TODO: agregar solo sucursales reales con domicilio verificable.
export const BRANCHES: { label: string; address: string; mapsUrl?: string }[] = [];

// ── WA_MESSAGES — mensajes de WhatsApp pre-armados por intención ─────────────
// `default` y `cotizar` son OBLIGATORIOS (botón flotante + CTA global).
// `cotizacion` es ALIAS de `cotizar` (lo usan Header/Footer/cta-presets).
export const WA_MESSAGES = {
  default: 'Hola, necesito información sobre mosquiteros.',
  cotizar: 'Hola, quiero cotizar mosquiteros a medida. Te paso las medidas de mis ventanas.',
  cotizacion: 'Hola, quiero cotizar mosquiteros a medida. Te paso las medidas de mis ventanas.', // alias de `cotizar`.
  // Por intención de página:
  productos: 'Hola, estoy viendo el catálogo y quiero cotizar mosquiteros.',
  servicios: 'Hola, necesito información sobre sus servicios de mosquiteros.',
  medicion: 'Hola, quiero agendar una medición a domicilio para mis mosquiteros.',
  reparacion: 'Hola, necesito reparar un mosquitero / cambiar la malla.',
  blog: 'Hola, leí un artículo de su blog y tengo una pregunta.',
  contacto: 'Hola, quiero atención personalizada para mi proyecto.',
  urgente: 'Hola, necesito atención urgente hoy.',
} as const;

// ── waUrl() — constructor canónico de enlaces de WhatsApp ────────────────────
// REGLA DURA (D4): nunca hardcodear wa.me/<número> en una página/componente.
// Siempre waUrl(WA_MESSAGES.<intencion>). Centraliza el número y el encoding.
export function waUrl(message: string = WA_MESSAGES.default): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

// ── telUrl() — constructor canónico del enlace de llamada ────────────────────
export function telUrl(): string {
  return `tel:${CONTACT.phoneE164}`;
}
