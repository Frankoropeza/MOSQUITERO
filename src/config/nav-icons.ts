// nav-icons.ts — Trazos SVG de los iconos de navegación, indexados por NOMBRE.
// ============================================================================
// ⚠️ EL MENÚ (Header.astro) YA NO USA ESTE ARCHIVO. El nombre quedó del origen:
// se creó para el mega-menú y luego el menú se rehízo sin iconos, a propósito
// (la jerarquía la llevan el peso tipográfico y la descripción).
//
// CONSUMIDOR ACTUAL: BlogSidebar.astro — bloque "Tipos de mosquitero", que
// resuelve navIcon(c.icon) sobre PRODUCT_CATEGORIES.
//
// Por eso siguen vivos SOLO los 7 iconos de categoría de producto + `generico`.
// Los de servicio (fabricacion, instalacion, medicion, reparacion) y los de
// geografía (zona, sector) NO tienen lector hoy: se conservan porque el
// contrato es estable y el coste es nulo, pero si nadie los reclama son
// candidatos a borrar.
// (La home tuvo iconos de servicio un momento y se revirtió: la sección quedó
// con marco + trama, sin iconografía. No los revivas ahí sin hablarlo.)
//
// POR QUÉ ESTE ARCHIVO EXISTE
// site.ts es la SSoT de DATOS: dice que la categoría "enrollables" usa el icono
// `enrollable`. No dice cómo se dibuja — eso es presentación y no tiene por qué
// ensuciar la taxonomía. Aquí vive el trazo; el componente resuelve nombre → trazo.
//
// CONTRATO (respétalo o el icono sale deforme):
//   • El contenido es SOLO el interior de un <svg>: paths/rects/lines. El
//     <svg> lo pone el componente (tamaño, stroke y aria-hidden los decide él).
//   • viewBox fijo 0 0 24 24 para TODOS. Un icono con otro viewBox se ve de
//     otra escala junto a los demás.
//   • Estilo homologado: line-art, `fill:none`, `stroke:currentColor`,
//     stroke-width 1.5, esquinas y puntas redondeadas. Hereda el color del
//     contenedor → el hover del enlace tiñe el icono sin CSS extra.
//   • Nombre desconocido → el Header usa `generico`. Nunca revienta.
//
// Los iconos de producto son METÁFORAS DE LA MECÁNICA (cómo se mueve la malla),
// no dibujos literales del producto: es lo que hace que se distingan de un
// vistazo a 20×20 px.
// ============================================================================

/** Interior de <svg viewBox="0 0 24 24">. Clave = valor de `icon` en site.ts. */
export const NAV_ICONS: Record<string, string> = {
  // ── Categorías de producto ────────────────────────────────────────────────
  // Enrollable: cajón arriba + malla que baja (la malla se guarda enrollada).
  enrollable:
    '<rect x="3" y="3" width="18" height="4" rx="1.5"/><path d="M6 7v11M18 7v11"/><path d="M6 18h12"/><path d="M8.5 10.5h7M8.5 14h7"/>',
  // Corredizo: dos hojas sobre riel, una desplazada (movimiento lateral).
  corredizo:
    '<rect x="2.5" y="5" width="9" height="14" rx="1.5"/><rect x="12.5" y="5" width="9" height="14" rx="1.5"/><path d="M2.5 21h19"/><path d="M15 12h5"/><path d="M18 9.5 20.5 12 18 14.5"/>',
  // Abatible: hoja que gira sobre bisagras (arco de apertura).
  abatible:
    '<path d="M4 3v18"/><rect x="4" y="3" width="11" height="18" rx="1.5"/><circle cx="12" cy="12" r=".9"/><path d="M17.5 6.5a9 9 0 0 1 0 11"/>',
  // Plisado: fuelle de acordeón.
  plisado:
    '<path d="M3 4v16M21 4v16"/><path d="M6.5 4v16M10 4v16M13.5 4v16M17 4v16"/><path d="M3 4h18M3 20h18"/>',
  // Magnético: dos hojas que se juntan al centro (imán).
  magnetico:
    '<path d="M12 4v16"/><rect x="2.5" y="4" width="19" height="16" rx="1.5"/><path d="M8 11.5 10.5 12 8 12.5"/><path d="M16 11.5 13.5 12 16 12.5"/>',
  // Fijo: marco cerrado con malla, sin partes móviles.
  fijo:
    '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M8.5 3v18M15.5 3v18"/><path d="M3 8.5h18M3 15.5h18"/>',
  // Accesorios: herraje / refacción.
  accesorio:
    '<path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8.4 8.4a2.3 2.3 0 0 1-3.3-3.3z"/><path d="M6.5 3.5 3.5 6.5l3 3 3-3z"/>',

  // ── Servicios ─────────────────────────────────────────────────────────────
  fabricacion:
    '<path d="M3 21h18"/><path d="M5 21V10l4-3v14"/><path d="M9 21V7l5-4v18"/><path d="M14 21V9l5 3v9"/>',
  instalacion:
    '<path d="m14.7 6.3 3-3 3 3-3 3"/><path d="M17.7 9.3 8.4 18.6a2.3 2.3 0 0 1-3.3-3.3l9.3-9.3"/><path d="M3 21h6"/>',
  medicion:
    '<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M7 8v3M12 8v4M17 8v3"/>',
  reparacion:
    '<path d="M9.5 3.5 6 7l-2.5-.5L3 3.5 6.5 3z"/><path d="M6 7l11 11"/><path d="m17 18 2 2a2 2 0 0 0 3-3l-2-2"/><path d="M14 6.5 17.5 3l3.5.5.5 3.5-3.5 3.5"/>',

  // ── Geografía / segmentos ─────────────────────────────────────────────────
  zona: '<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  sector: '<rect x="3" y="8" width="8" height="13" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/><path d="M6 12h2M6 16h2M16 7h2M16 11h2M16 15h2"/>',

  // Fallback: si `icon` viene vacío o con un nombre que no existe aquí.
  generico: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
};

/** Resuelve nombre → trazo. Nombre desconocido/ausente → `generico`. */
export const navIcon = (name?: string): string =>
  (name && NAV_ICONS[name]) || NAV_ICONS.generico;
