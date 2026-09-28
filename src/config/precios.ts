export type PrecioReferencia = {
  ventana: number | null;
  puerta: number | null;
};

export const PRECIOS_REFERENCIA = {
  fijos: { ventana: 790, puerta: null },
  corredizos: { ventana: 990, puerta: 2490 },
  abatibles: { ventana: 1290, puerta: 2890 },
  enrollables: { ventana: 1690, puerta: 3490 },
  plisados: { ventana: 1990, puerta: 3890 },
  magneticos: { ventana: null, puerta: 990 },
  cambioDeMalla: { ventana: 390, puerta: 690 },
} as const satisfies Record<string, PrecioReferencia>;

export type PrecioSlug = keyof typeof PRECIOS_REFERENCIA;

export const ETIQUETAS_PRECIO: Record<PrecioSlug, string> = {
  fijos: "Fijo",
  corredizos: "Corredizo",
  abatibles: "Abatible",
  enrollables: "Enrollable",
  plisados: "Plisado",
  magneticos: "Magnético",
  cambioDeMalla: "Cambio de malla (por hoja)",
};

export const TAMANO_REFERENCIA = "Ventana hasta 1.00 × 1.20 m · puerta hasta 0.90 × 2.10 m";
export const NOTA_PRECIOS_REFERENCIA = "Precios de referencia 2026 con IVA incluido. La cotización final depende de la medida, la malla y el acceso.";

// ── Condiciones de servicio (Frank, 2026-09-28: «maneja los costos que tiene la
// competencia»). Fijadas contra lo que publica el mercado; fuente y cifras en el
// vault: MOSQUITERO-Precios-de-referencia-2026-09-28.md §Condiciones.
//   · Medición/visita: la competencia la ofrece «sin costo» / «sin compromiso»
//     (Innova, Aluminglas, Net Pro; plataformas con cotización gratis). Nadie la cobra.
//   · Garantía: 3 meses Net Pro (defectos de fabricación) · 13 meses Alumicasa
//     (general) · 5 años Innova (retráctil premium). Se fija 12 meses, tramo medio.
//   · IVA: ninguno lo publica; la Ley Federal de Protección al Consumidor exige
//     anunciar el precio total con impuestos, así que el «desde» es con IVA.
export const MEDICION_CONDICION = "Sin costo y sin compromiso";
export const GARANTIA_TEXTO = "12 meses por defectos de fabricación e instalación";
export const GARANTIA_EXCLUYE = "No cubre roturas por golpes, mascotas o mal uso";
export const ALCANCE_PRECIOS_REFERENCIA = "Fabricación a medida + instalación en CDMX y Edomex.";

export const formatearPrecio = (precio: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(precio);

export const precioDesde = (precio: number | null) => (precio === null ? null : `desde ${formatearPrecio(precio)}`);

// «Desde» de un mosquitero NUEVO: excluye `cambioDeMalla`, que es una reparación.
// Sin esta exclusión el hero y la FAQ de /mosquiteros/ decían «desde $390»
// (el cambio de malla), que no es el precio de ningún mosquitero.
const SERVICIOS_NO_PIEZA: PrecioSlug[] = ["cambioDeMalla"];

export const precioMasBajo = (tipo: "ventana" | "puerta") =>
  Math.min(
    ...(Object.entries(PRECIOS_REFERENCIA) as [PrecioSlug, PrecioReferencia][])
      .filter(([slug]) => !SERVICIOS_NO_PIEZA.includes(slug))
      .flatMap(([, precio]) => (precio[tipo] === null ? [] : [precio[tipo] as number])),
  );
