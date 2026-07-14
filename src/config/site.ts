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

  // ── GATE DE LANZAMIENTO ─────────────────────────────────────────────────
  // noindexAll: true → TODA página emite `robots: noindex, nofollow`.
  // Está en true porque el sitio se despliega en mosquitero.pages.dev (público,
  // deploy automático desde main) con datos `TODO:` y contenido sin validar por
  // el cliente. Que Google indexe eso es peor que no tener sitio: contenido
  // placeholder posicionado bajo la marca real.
  //
  // ⚠️ PONER EN false SOLO CUANDO: (1) no quede ningún `TODO:` vivo en este
  // archivo, (2) el cliente haya validado el contenido marcado 🟠 en
  // docs/PROCEDENCIA.md, y (3) el dominio real apunte al sitio.
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
  // TODO: si NO hay sede física verificable, pon `business: undefined` y buildSchema
  // omite LocalBusiness. NO inventes domicilio ni coordenadas.
  business: {
    type: 'LocalBusiness' as string | string[],
    priceRange: '$$',
    address: {
      street: 'TODO: calle y número, colonia',
      locality: 'TODO: ciudad',
      region: 'TODO: estado',
      postalCode: 'TODO: CP',
      country: 'MX',
    },
    geo: {
      lat: 0 as string | number, // TODO: lat real (Google Maps → clic derecho → copiar).
      lng: 0 as string | number, // TODO: lng real.
    },
    openingHours: {
      weekdays: { opens: '09:00', closes: '18:00' }, // TODO: horario real.
      saturday: undefined as { opens: string; closes: string } | undefined,
    },
    areaServed: ['TODO: ciudad principal'] as string[],
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
  phone: 'TODO: 55 0000 0000', // Formato legible para mostrar.
  phoneE164: '+520000000000', // TODO: E.164 CON +, para <a href="tel:">.
  phoneRaw: '+520000000000', // TODO: E.164 CON +; lo consumen componentes y JSON-LD.
  whatsapp: '520000000000', // TODO: E.164 SIN +, lo exige wa.me.
  email: 'TODO: hola@mosquitero.mx',
  street: 'TODO: calle y número, colonia',
  city: 'TODO: ciudad',
  state: 'TODO: estado',
  postalCode: 'TODO: CP',
  country: 'MX', // ISO 3166-1 alpha-2.
  geo: {
    lat: 0, // TODO: coordenada real.
    lng: 0, // TODO: coordenada real.
  },
  // hours: fuente única del horario. TODO: confirmar con el cliente.
  hours: {
    weekdays: 'Lun–Vie 9:00–18:00',
    saturday: 'Sáb 9:00–14:00',
    sunday: 'Dom Cerrado',
    display: 'Lun–Vie 9:00–18:00',
  },
  // schedule: versión que consumen TopBar/Footer. Doble espacio "Día␣␣Horario"
  // (el Footer hace split('  ')). Espejo de `hours` con ese formato.
  schedule: {
    display: 'Lun–Vie 9:00–18:00',
    weekdays: 'Lun–Vie  9:00–18:00',
    saturday: 'Sábado  9:00–14:00',
    sunday: 'Domingo  Cerrado',
  },
} as const;

// ── TAXONOMY — categorías/servicios/zonas cerradas (as const) ────────────────
// Fuente única de navegación, footer y rutas. Cada `slug` DEBE coincidir con el
// `category` de las Content Collections (ver src/content.config.ts).
// NOTA: hoy solo existe la home (/). Las rutas de abajo se construyen en las
// siguientes etapas; el NAV ya las contempla para no rehacer la taxonomía.
export const TAXONOMY = {
  // categories: catálogo de dominio (L2) — tipos de mosquitero.
  categories: [
    { slug: 'enrollables', label: 'Enrollables', badge: undefined, href: '/productos/enrollables/' },
    { slug: 'corredizos', label: 'Corredizos', badge: undefined, href: '/productos/corredizos/' },
    { slug: 'abatibles', label: 'Abatibles', badge: undefined, href: '/productos/abatibles/' },
    { slug: 'plisados', label: 'Plisados', badge: undefined, href: '/productos/plisados/' },
    { slug: 'magneticos', label: 'Magnéticos', badge: undefined, href: '/productos/magneticos/' },
    { slug: 'fijos', label: 'Fijos', badge: undefined, href: '/productos/fijos/' },
    { slug: 'accesorios', label: 'Accesorios y refacciones', badge: undefined, href: '/productos/accesorios/' },
  ],
  // services: servicios ofrecidos. TODO: confirmar cuáles presta realmente el cliente.
  services: [
    { id: 'fabricacion', label: 'Fabricación a medida', desc: 'Mosquiteros hechos a la medida exacta de tu ventana o puerta.' },
    { id: 'instalacion', label: 'Instalación', desc: 'Colocación profesional en ventanas, puertas y domos.' },
    { id: 'medicion', label: 'Medición a domicilio', desc: 'Visita para tomar medidas y recomendar el tipo correcto.' },
    { id: 'reparacion', label: 'Reparación y cambio de malla', desc: 'Cambio de tela, marcos y herrajes de mosquiteros existentes.' },
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

export type ProductCategory = (typeof TAXONOMY.categories)[number];
export type Service = (typeof TAXONOMY.services)[number];
export type Sector = (typeof TAXONOMY.sectors)[number];
export type CoverageState = (typeof TAXONOMY.coverageStates)[number];

// ── NAV — menú principal del Header (FUENTE ÚNICA: escritorio + móvil) ────────
// Header.astro itera ESTE array para generar los DOS menús y sus paneles.
// Para agregar/quitar/reordenar una entrada, edita SOLO este array.
export type NavLink = { label: string; href: string; desc?: string };
export type NavItem = {
  label: string;
  href: string;
  panel?: 'mega' | 'dropdown';
  allLabel?: string;
  items?: readonly NavLink[];
};
export const NAV: readonly NavItem[] = [
  {
    label: 'Mosquiteros',
    href: '/productos/',
    panel: 'mega',
    allLabel: 'Ver catálogo completo',
    items: PRODUCT_CATEGORIES.map((c) => ({ label: c.label, href: c.href })),
  },
  {
    label: 'Servicios',
    href: '/servicios/',
    panel: 'dropdown',
    allLabel: 'Ver todos los servicios',
    items: SERVICES.map((s) => ({ label: s.label, href: `/servicios/${s.id}/`, desc: s.desc })),
  },
  {
    label: 'Cobertura',
    href: '/cobertura/',
    panel: 'dropdown',
    allLabel: 'Ver toda la cobertura',
    items: COVERAGE_STATES.map((s) => ({ label: s.label, href: `/cobertura/${s.slug}/` })),
  },
  // Sectores: aparece SOLO si hay datos en TAXONOMY.sectors (hoy vacío → oculto).
  ...(SECTORS.length > 0
    ? [{
        label: 'Sectores',
        href: '/sectores/',
        panel: 'dropdown' as const,
        allLabel: 'Ver todos los sectores',
        items: SECTORS.map((s) => ({ label: s.label, href: `/sectores/${s.slug}/` })),
      }]
    : []),
  { label: 'Blog', href: '/blog/' },
  { label: 'Contacto', href: '/contacto/' },
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
    href: '/productos/enrollables/',
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero enrollable instalado en ventana',
    badge: undefined, // TODO: gancho real (entrega, garantía) o dejar sin badge.
    blurb:
      'El mosquitero se recoge solo cuando no lo usas: la malla queda oculta en el cajón y la ventana se ve libre. Ideal para ventanas de uso diario.',
    subcategories: [
      { label: 'Para ventana', href: '/productos/enrollables/' },
      { label: 'Para puerta', href: '/productos/enrollables/' },
    ],
    ctaLabel: 'Ver enrollables',
  },
  {
    slug: 'corredizos',
    label: 'Mosquiteros Corredizos',
    href: '/productos/corredizos/',
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero corredizo de aluminio en ventana corrediza',
    badge: undefined,
    blurb:
      'Corren sobre riel junto a tu ventana corrediza, sin obstruir el paso. Marco de aluminio a medida y malla que puedes cambiar cuando se dañe.',
    subcategories: [
      { label: 'Ventana corrediza', href: '/productos/corredizos/' },
      { label: 'Puerta corrediza', href: '/productos/corredizos/' },
    ],
    ctaLabel: 'Ver corredizos',
  },
  {
    slug: 'abatibles',
    label: 'Mosquiteros Abatibles',
    href: '/productos/abatibles/',
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero abatible con bisagras en puerta de acceso',
    badge: undefined,
    blurb:
      'Se abren como puerta con bisagras y cierre automático. La opción práctica para accesos por donde entras y sales todo el día.',
    subcategories: [
      { label: 'Puerta de acceso', href: '/productos/abatibles/' },
      { label: 'Ventana abatible', href: '/productos/abatibles/' },
    ],
    ctaLabel: 'Ver abatibles',
  },
  {
    slug: 'plisados',
    label: 'Mosquiteros Plisados',
    href: '/productos/plisados/',
    image: '/images/placeholder.svg', // TODO: foto real del producto (AVIF/WebP < 200 KB).
    imageAlt: 'Mosquitero plisado retráctil en vano amplio',
    badge: undefined,
    blurb:
      'La malla se pliega como acordeón y casi desaparece. Resuelven vanos amplios y puertas de cristal donde otros mosquiteros no alcanzan.',
    subcategories: [
      { label: 'Vano amplio', href: '/productos/plisados/' },
      { label: 'Puerta de cristal', href: '/productos/plisados/' },
    ],
    ctaLabel: 'Ver plisados',
  },
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
