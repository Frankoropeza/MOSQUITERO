// Anchors SEO — Ahrefs Keywords Explorer, México, 2026-09-28.
// Regla: una keyword principal por URL, sin canibalizar. Los volúmenes son MX/mes.

export const ANCHORS: Record<string, { kw: string; variantes: readonly string[] }> = {
  '/': { kw: 'Mosquitero para ventana', variantes: ['Mosquiteros para ventanas', 'Mosquiteros a medida', 'Mosquiteros de aluminio'] }, // 3,800 (variantes: 2,700; 300)
  '/mosquiteros/': { kw: 'Tipos de mosquiteros', variantes: ['Catálogo de mosquiteros'] }, // 70
  '/mosquiteros/para-puertas/': { kw: 'Mosquitero para puerta', variantes: ['Mosquiteros para puertas', 'Puerta mosquitero', 'Puerta con mosquitero'] }, // 2,600 (variantes: 1,300; 200; 250)
  '/mosquiteros/magneticos/': { kw: 'Mosquitero magnético', variantes: ['Mosquitero de imán', 'Mosquiteros magnéticos', 'Mosquitero para puerta con imán'] }, // 1,100 (variantes: 150; 150)
  '/mosquiteros/enrollables/': { kw: 'Mosquitero enrollable', variantes: ['Mosquiteros enrollables', 'Mosquitero enrollable para puerta', 'Mosquitero enrollable para ventana'] }, // 400 (variantes: 200; 100; 60)
  '/mosquiteros/corredizos/': { kw: 'Mosquitero corredizo', variantes: ['Mosquiteros corredizos', 'Mosquitero corredizo para ventana'] }, // 300 (variantes: 150; 100)
  '/mosquiteros/fijos/': { kw: 'Mosquitero fijo de aluminio', variantes: ['Mosquitero fijo', 'Mosquiteros fijos'] }, // 150 (variantes: 80; 20)
  '/mosquiteros/plisados/': { kw: 'Mosquitero plisado', variantes: ['Mosquiteros plisados'] }, // 50
  '/mosquiteros/abatibles/': { kw: 'Mosquitero abatible', variantes: ['Mosquiteros abatibles'] }, // 50 (variante: 30)
  '/mosquiteros/accesorios/': { kw: 'Accesorios para mosquiteros', variantes: ['Refacciones para mosquitero'] },
  '/servicios/': { kw: 'Mosquiteros a domicilio', variantes: ['Servicios de mosquiteros'] }, // 20
  '/servicios/fabricacion/': { kw: 'Fabricación de mosquiteros', variantes: ['Fabricación de mosquiteros a medida'] },
  '/servicios/instalacion/': { kw: 'Instalación de mosquiteros', variantes: ['Instalar mosquiteros'] }, // 40
  '/servicios/medicion/': { kw: 'Medición de mosquiteros', variantes: ['Medición a domicilio para mosquiteros'] },
  '/servicios/reparacion/': { kw: 'Reparación de mosquiteros', variantes: ['Cambio de malla de mosquitero', 'Reparar mosquitero'] }, // 50 (variante: 20)
  '/cobertura/': { kw: 'Mosquiteros en CDMX y Edomex', variantes: ['Zonas de cobertura'] },
  '/cobertura/cdmx/': { kw: 'Mosquiteros en CDMX', variantes: [] }, // 10
  '/cobertura/edomex/': { kw: 'Mosquiteros en Estado de México', variantes: ['Mosquiteros en Edomex'] },
  '/contacto/': { kw: 'Cotizar mosquiteros', variantes: ['Cotización de mosquiteros a medida'] },
  '/blog/': { kw: 'Guías de mosquiteros', variantes: ['Blog de mosquiteros'] },
  '/aviso-de-privacidad/': { kw: 'Aviso de privacidad', variantes: [] },
  '/blog/como-medir-ventana-mosquitero/': { kw: 'Cómo medir una ventana para mosquitero', variantes: ['Cómo medir tu ventana'] },
  '/blog/tipos-de-mosquitero-cual-elegir/': { kw: 'Qué tipo de mosquitero elegir', variantes: ['Cuál mosquitero elegir'] },
  '/blog/tipos-de-malla-mosquitero/': { kw: 'Malla para mosquitero', variantes: ['Tipos de malla para mosquitero', 'Malla mosquitero metálica', 'Tela para mosquitero'] }, // 600 (variantes: 400; 300)
  '/blog/de-que-depende-el-precio-de-un-mosquitero/': { kw: 'Precio de un mosquitero', variantes: ['Cuánto cuesta un mosquitero', 'Precio de mosquiteros'] },
  '/blog/mantenimiento-limpieza-mosquiteros/': { kw: 'Limpieza de mosquiteros', variantes: ['Mantenimiento de mosquiteros'] },
  '/blog/reparar-o-reponer-un-mosquitero/': { kw: 'Reparar o reponer un mosquitero', variantes: [] },
  '/blog/por-que-mosquiteros-a-medida/': { kw: 'Por qué un mosquitero a medida', variantes: [] },
  '/blog/que-preguntar-antes-de-contratar-mosquiteros/': { kw: 'Qué preguntar antes de contratar mosquiteros', variantes: [] },
  '/blog/como-trabajamos-de-la-medida-a-la-instalacion/': { kw: 'Cómo fabricamos e instalamos mosquiteros', variantes: [] },
};

const normalize = (href: string) => {
  const path = href.split(/[?#]/, 1)[0] || '/';
  return path === '/' ? path : `${path.replace(/\/+$/, '')}/`;
};

export function anchorText(href: string, opts: { variante?: number; minuscula?: boolean } = {}): string {
  const path = normalize(href);
  if (path.startsWith('/blog/categoria/')) {
    const slug = path.slice('/blog/categoria/'.length, -1);
    const labels: Record<string, string> = { guias: 'Guías', mantenimiento: 'Mantenimiento', 'tipos-de-malla': 'Tipos de malla', 'la-marca': 'Cómo trabajamos', novedades: 'Novedades', general: 'General' };
    return labels[slug] ?? slug.replace(/-/g, ' ');
  }
  if (path.startsWith('/blog/tag/')) return path.slice('/blog/tag/'.length, -1).replace(/-/g, ' ');
  const anchor = ANCHORS[path];
  if (!anchor) throw new Error(`[anchors] Ruta interna sin anchor: ${path}`);
  const text = opts.variante !== undefined ? (anchor.variantes[opts.variante] ?? anchor.kw) : anchor.kw;
  return opts.minuscula && text !== 'CDMX' ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

export const PRIORIDAD_ENLACES = ['/mosquiteros/para-puertas/', '/mosquiteros/magneticos/', '/mosquiteros/enrollables/', '/mosquiteros/corredizos/', '/mosquiteros/fijos/', '/mosquiteros/abatibles/', '/mosquiteros/plisados/', '/mosquiteros/accesorios/'] as const;
