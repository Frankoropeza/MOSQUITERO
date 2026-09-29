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

import { anchorText } from './anchors'; // anchors de palabra clave (Ahrefs 2026-09-28) para NAV.

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
    'Mosquiteros para ventanas y puertas a medida: fabricación, instalación y reparación en CDMX y Edomex. Cotiza por WhatsApp con tus medidas.', // 140–160 chars · abre con kw1, teje las 3 keywords.
  defaultImage: '/images/og/default.png', // OG raster 1200×630 (WhatsApp/Facebook/X no aceptan SVG). Wordmark provisional 2026-09-28.

  // ── COLOR DE MARCA — fuente única del HEX ────────────────────────────────
  // Tinta (#15231b) del rediseño «Ronnsquare adaptado» del 2026-09-28 (antes:
  // índigo #5b3df5 heredado del template). Sistema completo en tokens.css.
  // Al cambiarlo hay que tocar los TRES sitios de abajo.
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
  themeColor: '#15231b',

  // ── GATE DE LANZAMIENTO ─────────────────────────────────────────────────
  // noindexAll: true → TODA página emite `robots: noindex, nofollow`.
  // 2026-09-28: LEVANTADO por decisión de Frank ("todo tiene que ser index y
  // follow, que lo vean Google y los motores de IA"). El sitio se indexa completo.
  // Pendientes que siguen abiertos con el sitio ya público: fotos reales (hoy SVG
  // marcadores), logo definitivo y validación del contenido 🟠 con el cliente.
  // Ver OBSIDIAN/OrigenLab/Proyectos/MOSQUITERO/MOSQUITERO-Auditoria-2026-09-28.md.
  // No bloquear con `Disallow: /` en robots.txt: para desindexar hay que DEJAR
  // rastrear y servir noindex.
  noindexAll: false as boolean,

  // Política de trailing slash. Debe coincidir con astro.config.mjs.
  // MEDIDO en producción 2026-08-12: mosquitero.mx redirige 308 de sin-slash a
  // con-slash en todas las rutas internas (Cloudflare fuerza 'always'). Antes
  // decía 'never', desalineado con lo que el dominio realmente sirve.
  trailingSlash: 'always' as 'never' | 'always',
  // searchUrl: si el sitio tiene buscador interno → WebSite SearchAction. Si no, undefined.
  searchUrl: undefined as string | undefined,
  // allowSelfReviews: gate de reseñas. DEFAULT false (Google penaliza self-serving).
  allowSelfReviews: false,

  // seo: defaults para <head>. Los consume lib/seo.ts (buildMeta/formatTitle/truncate).
  seo: {
    title: 'Mosquiteros para ventanas | mosquiteros a medida', // ≤60 chars. Fallback; la home lo genera con buildKeywordTitle(KEYWORDS).
    description:
      'Mosquiteros para ventanas y puertas a medida: fabricación, instalación y reparación en CDMX y Edomex. Cotiza por WhatsApp con tus medidas.',
    image: '/images/og/default.png',
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
    logo: '/images/brand/logo-512.png', // PNG cuadrado 512 para schema (Google exige raster ≥112 px). Wordmark provisional 2026-09-28.
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
// Tripleta validada con Ahrefs (México) el 2026-09-28: ver OBSIDIAN/OrigenLab/Proyectos/MOSQUITERO.
export const KEYWORDS = [
  'mosquiteros para ventanas', // kw1 · principal — 2,700/mes + «mosquitero para ventana» 3,800 (Ahrefs MX, 2026-09-28)
  'mosquiteros a medida', // kw2 · diferenciador del negocio (volumen bajo, intención de compra)
  'mosquiteros para puertas', // kw3 · 1,300 + «mosquitero para puerta» 2,600; página propia /mosquiteros/para-puertas/
] as const;

// ── CONTACT — NAP (Name, Address, Phone) + geo + horario ─────────────────────
// Datos confirmados por Frank el 2026-07-14 (ver cada campo). Si cambian, se
// cambian AQUÍ: footer, TopBar, JSON-LD, llms.txt y WhatsApp salen de este objeto.
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
// ⚠️ CON BARRA FINAL. `trailingSlash: 'always'` (astro.config.mjs + SITE.trailingSlash),
// medido en producción el 2026-08-12: Cloudflare redirige 308 /ruta → /ruta/.
// Hasta el 2026-09-28 estas funciones emitían la ruta SIN barra y CADA clic
// interno pasaba por un 308. Todo href interno a una página termina en «/»;
// scripts/check-links.mjs lo verifica sobre dist/.
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
export const productoHref = (slug: string): string => `/mosquiteros/${slug}/`;
export const servicioHref = (id: string): string => `/servicios/${id}/`;
export const zonaHref = (slug: string): string => `/cobertura/${slug}/`;

// ROUTES — las rutas fijas del sitio, en un solo sitio y CON barra final.
// Existe porque '/mosquiteros/' estaba escrito a mano en 14 archivos y cada uno
// podía (y podía no) llevar la barra. Un literal repetido 14 veces no es una
// ruta: es 14 oportunidades de divergir. Impórtalo en vez de escribir la cadena.
export const ROUTES = {
  home: '/',
  /** La L2 de catálogo. La URL dice `mosquiteros` porque eso dice el menú y eso
   *  es lo que se busca. La clave se llama `mosquiteros` a propósito: si se
   *  llamara `productos` volveríamos a tener dos vocabularios. */
  mosquiteros: '/mosquiteros/',
  servicios: '/servicios/',
  cobertura: '/cobertura/',
  contacto: '/contacto/',
  blog: '/blog/',
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
    { slug: 'instalacion', label: 'Instalación', desc: 'Cómo se coloca, se fija y se arma un mosquitero: lo que puedes hacer tú y cuándo conviene un instalador.' },
    { slug: 'zancudos', label: 'Zancudos e insectos', desc: 'Qué insectos entran a tu casa, por qué pican y qué los detiene de verdad.' },
    { slug: 'la-marca', label: 'Cómo trabajamos', desc: 'Nuestro criterio de oficio: cómo fabricamos, qué exigirle a un proveedor y de qué depende el precio.' },
    { slug: 'novedades', label: 'Novedades', desc: 'Avisos y cambios en el catálogo y en el servicio.' },
    { slug: 'general', label: 'General', desc: 'Temas del oficio que no caben en las otras categorías.' },
  ],
  // sectors: segmentos atendidos (residencial/comercial). Tipado explícito para
  // que Header/Footer puedan .map() sin que TS infiera `never` con `[]`.
  sectors: [] as readonly { slug: string; label: string }[], // TODO: definir si aplica.
  // coverageStates: cobertura geográfica. 🟢 Confirmada por Frank (CDMX + Edomex).
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
    href: '/mosquiteros/',
    panel: 'mega',
    allLabel: anchorText('/mosquiteros/'),
    intro: 'Elige por tipo de mosquitero. Todos se fabrican a la medida de tu ventana o puerta.',
    items: [
      ...PRODUCT_CATEGORIES.map((c) => ({ label: anchorText(c.href), href: c.href, desc: c.desc })),
      { label: anchorText('/mosquiteros/para-puertas/'), href: '/mosquiteros/para-puertas/', desc: 'Opciones para accesos, patios y puertas corredizas.' },
    ],
  },
  {
    label: 'Servicios',
    href: '/servicios/',
    panel: 'dropdown',
    allLabel: anchorText('/servicios/'),
    items: SERVICES.map((s) => ({ label: anchorText(servicioHref(s.id)), href: servicioHref(s.id), desc: s.desc })),
  },
  {
    label: 'Cobertura',
    href: '/cobertura/',
    panel: 'dropdown',
    allLabel: anchorText('/cobertura/'),
    items: COVERAGE_STATES.map((s) => ({ label: anchorText(`/cobertura/${s.slug}/`), href: `/cobertura/${s.slug}/` })),
  },
  // Sectores: aparece SOLO si hay datos en TAXONOMY.sectors (hoy vacío → oculto).
  ...(SECTORS.length > 0
    ? [{
        label: 'Sectores',
        href: '/sectores/',
        panel: 'dropdown' as const,
        allLabel: 'Sectores que atendemos',
        items: SECTORS.map((s) => ({ label: s.label, href: `/sectores/${s.slug}/` })),
      }]
    : []),
  // Todas las entradas llevan barra final (política trailingSlash 'always').
  { label: 'Blog', href: '/blog/' },
  { label: 'Contacto', href: '/contacto/' },
];

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
