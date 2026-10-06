// Anchors SEO — Ahrefs Keywords Explorer, México, 2026-09-28.
// Regla: una keyword principal por URL, sin canibalizar. Los volúmenes son MX/mes.

import { tagLabel } from "@config/tags";

export const ANCHORS: Record<string, { kw: string; variantes: readonly string[] }> = {
  '/': { kw: 'Mosquitero para ventana', variantes: ['Mosquiteros para ventanas', 'Mosquiteros a medida', 'Mosquiteros de aluminio'] }, // 3,800 (variantes: 2,700; 300)
  '/mosquiteros/': { kw: 'Tipos de mosquiteros', variantes: ['Catálogo de mosquiteros'] }, // 70
  '/mosquiteros/para-puertas/': { kw: 'Mosquitero para puerta', variantes: ['Mosquiteros para puertas', 'Puerta mosquitero', 'Puerta con mosquitero', 'Puerta mosquitero de aluminio', 'Mosquitero de aluminio para puerta'] }, // 2,600 (variantes: 1,300; 200; 250; 200; 150)
  '/mosquiteros/para-ventanas-de-aluminio/': { kw: 'Mosquiteros para ventanas de aluminio', variantes: ['Mosquitero para ventana de aluminio', 'Mosquitero de aluminio', 'Precio de mosquiteros para ventanas de aluminio'] }, // 400 (variantes: 150; 350; 200)
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
  '/blog/tipos-de-malla-mosquitero/': { kw: 'Malla para mosquitero', variantes: ['Tipos de malla para mosquitero'] }, // 600 — «metálica» y «tela» pasan a sus artículos propios (Tanda K)
  '/blog/de-que-depende-el-precio-de-un-mosquitero/': { kw: 'Precio de un mosquitero', variantes: ['Cuánto cuesta un mosquitero', 'Precio de mosquiteros'] },
  '/blog/mantenimiento-limpieza-mosquiteros/': { kw: 'Limpieza de mosquiteros', variantes: ['Mantenimiento de mosquiteros'] },
  '/blog/reparar-o-reponer-un-mosquitero/': { kw: 'Reparar o reponer un mosquitero', variantes: [] },
  '/blog/por-que-mosquiteros-a-medida/': { kw: 'Por qué un mosquitero a medida', variantes: [] },
  '/blog/que-preguntar-antes-de-contratar-mosquiteros/': { kw: 'Qué preguntar antes de contratar mosquiteros', variantes: [] },
  '/blog/como-trabajamos-de-la-medida-a-la-instalacion/': { kw: 'Cómo fabricamos e instalamos mosquiteros', variantes: [] },
  // ── Tanda K (2026-09-28): 32 artículos. kw = keyword objetivo del brief (Ahrefs MX). ──
  '/blog/zancudos-grandes-son-peligrosos/': { kw: 'Zancudos grandes', variantes: ['¿Los zancudos grandes pican?'] }, // 1,400 (variantes: 200)
  '/blog/tipos-de-zancudos-en-mexico/': { kw: 'Tipos de zancudos', variantes: ['Zancudos en México'] }, // 300
  '/blog/como-eliminar-zancudos-del-cuarto/': { kw: 'Cómo eliminar zancudos del cuarto', variantes: ['Cómo ahuyentar zancudos'] }, // 350 (variantes: 300)
  '/blog/por-que-me-pican-mas-los-zancudos/': { kw: 'Por qué me pican mucho los zancudos', variantes: ['Picaduras de zancudos'] }, // 250 (variantes: 250)
  '/blog/mosquitos-pequenos-en-casa/': { kw: 'Mosquitos pequeños en casa', variantes: [] }, // 300
  '/blog/remedios-caseros-para-zancudos/': { kw: 'Remedios caseros para zancudos', variantes: ['Plantas contra zancudos'] }, // 200 (variantes: 200)
  '/blog/temporada-de-zancudos-en-cdmx/': { kw: 'Temporada de zancudos en la CDMX', variantes: [] },
  '/blog/zancudos-y-mascotas/': { kw: 'Zancudos y mascotas', variantes: ['¿Los zancudos pican a los perros?'] }, // 200
  '/blog/malla-mosquitera-metalica-o-fibra-de-vidrio/': { kw: 'Malla mosquitera metálica', variantes: ['Malla mosquitero metálica', 'Tela mosquitera metálica'] }, // 700 (variantes: 400; 500)
  '/blog/malla-mosquitera-galvanizada-o-acero-inoxidable/': { kw: 'Malla mosquitera galvanizada', variantes: ['Malla mosquitera de acero inoxidable'] }, // 600 (variantes: 200)
  '/blog/tela-mosquitera-de-plastico/': { kw: 'Tela mosquitera de plástico', variantes: ['Tela para mosquitero', 'Malla mosquitera plástica'] }, // 200 (variantes: 300; 150)
  '/blog/malla-para-gatos-y-perros/': { kw: 'Malla para gatos', variantes: ['Malla mosquitera para mascotas'] }, // 250
  '/blog/mosquitero-que-no-se-vea/': { kw: 'Mosquitero que casi no se ve', variantes: [] }, // 40
  '/blog/la-malla-mosquitera-quita-aire-y-luz/': { kw: 'Malla mosquitera, aire y luz', variantes: [] },
  '/blog/como-cambiar-la-malla-de-un-mosquitero/': { kw: 'Cómo cambiar la malla de un mosquitero', variantes: ['Cómo reparar un mosquitero roto'] }, // (variantes: 30)
  '/blog/como-quitar-un-mosquitero-de-la-ventana/': { kw: 'Cómo quitar un mosquitero de la ventana', variantes: [] }, // 30
  '/blog/como-hacer-un-mosquitero-para-ventana/': { kw: 'Cómo hacer un mosquitero para ventana', variantes: ['Cómo hacer un mosquitero'] }, // 250 (variantes: 150)
  '/blog/como-poner-tela-mosquitera-en-ventana-sin-marco/': { kw: 'Tela mosquitera en ventanas sin marco', variantes: [] }, // 150
  '/blog/como-colocar-mosquitero-en-ventana-corrediza/': { kw: 'Cómo colocar mosquitero en ventana corrediza', variantes: [] }, // 100
  '/blog/como-poner-mosquitero-en-ventana-de-aluminio/': { kw: 'Cómo poner mosquiteros en ventanas', variantes: ['Cómo poner un mosquitero en ventana de aluminio'] }, // 100 (variantes: 40)
  '/blog/perfiles-de-aluminio-para-mosquitero/': { kw: 'Perfil de aluminio para mosquitero', variantes: ['Tipos de perfiles para mosquitero', 'Perfil para mosquitero'] }, // 350 (variantes: 250; 300)
  '/blog/mosquitero-para-ventana-de-herreria/': { kw: 'Mosquitero para ventana de herrería', variantes: ['Cómo pegar mosquitero en metal'] }, // (variantes: 80)
  '/blog/como-hacer-un-mosquitero-para-puerta/': { kw: 'Cómo hacer un mosquitero para puerta', variantes: [] }, // 130
  '/blog/mosquitero-de-aluminio-pvc-o-madera/': { kw: 'Mosquitero de aluminio, PVC o madera', variantes: ['Materiales para mosquitero'] }, // comparativa; «mosquitero de aluminio» es de /mosquiteros/para-ventanas-de-aluminio/
  '/blog/mosquitero-magnetico-o-abatible-para-puerta/': { kw: 'Mosquitero magnético o abatible', variantes: [] },
  '/blog/mosquitero-ajustable-o-a-medida/': { kw: 'Mosquitero ajustable o a medida', variantes: [] },
  '/blog/puertas-con-mosquitero-modernas/': { kw: 'Puertas con mosquitero modernas', variantes: ['Puertas con malla mosquitera'] }, // 250 (variantes: 200)
  '/blog/puerta-corrediza-de-aluminio-con-mosquitero/': { kw: 'Puerta corrediza de aluminio con mosquitero', variantes: [] }, // 300
  '/blog/mosquitero-para-cama-o-para-ventana/': { kw: 'Mosquitero para cama', variantes: ['Mosquitero para bebé'] }, // 1,200 (variantes: 300)
  '/blog/ventanas-de-aluminio-con-mosquitero/': { kw: 'Ventanas de aluminio con mosquitero', variantes: ['Ventanas con mosquitero'] }, // 200 (variantes: 200)
  '/blog/mosquiteros-para-departamento-rentado/': { kw: 'Mosquiteros para departamento rentado', variantes: [] },
  '/blog/donde-comprar-mosquiteros-en-cdmx/': { kw: 'Dónde comprar mosquiteros', variantes: ['Dónde comprar malla mosquitera'] }, // 80 (variantes: 20)
};

const normalize = (href: string) => {
  const path = href.split(/[?#]/, 1)[0] || '/';
  return path === '/' ? path : `${path.replace(/\/+$/, '')}/`;
};

export function anchorText(href: string, opts: { variante?: number; minuscula?: boolean } = {}): string {
  const path = normalize(href);
  if (path.startsWith('/blog/categoria/')) {
    const slug = path.slice('/blog/categoria/'.length, -1);
    const labels: Record<string, string> = { guias: 'Guías', mantenimiento: 'Mantenimiento', 'tipos-de-malla': 'Tipos de malla', 'la-marca': 'Cómo trabajamos', novedades: 'Novedades', general: 'General', instalacion: 'Instalación', zancudos: 'Zancudos e insectos' } // espejo de TAXONOMY.articleCategories (site.ts importa este módulo: no se puede importar de vuelta sin ciclo);
    return labels[slug] ?? slug.replace(/-/g, ' ');
  }
  if (path.startsWith('/blog/tag/')) return tagLabel(path.slice('/blog/tag/'.length, -1));
  const anchor = ANCHORS[path];
  if (!anchor) throw new Error(`[anchors] Ruta interna sin anchor: ${path}`);
  const text = opts.variante !== undefined ? (anchor.variantes[opts.variante] ?? anchor.kw) : anchor.kw;
  return opts.minuscula && text !== 'CDMX' ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

export const PRIORIDAD_ENLACES = ['/mosquiteros/para-puertas/', '/mosquiteros/para-ventanas-de-aluminio/', '/mosquiteros/magneticos/', '/mosquiteros/enrollables/', '/mosquiteros/corredizos/', '/mosquiteros/fijos/', '/mosquiteros/abatibles/', '/mosquiteros/plisados/', '/mosquiteros/accesorios/'] as const;
