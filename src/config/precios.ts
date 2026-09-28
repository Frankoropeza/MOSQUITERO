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
export const NOTA_PRECIOS_REFERENCIA = "Precios de referencia 2026. La cotización final depende de la medida, la malla y el acceso.";
export const ALCANCE_PRECIOS_REFERENCIA = "Fabricación a medida + instalación en CDMX y Edomex.";

export const formatearPrecio = (precio: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(precio);

export const precioDesde = (precio: number | null) => (precio === null ? null : `desde ${formatearPrecio(precio)}`);

export const precioMasBajo = (tipo: "ventana" | "puerta") =>
  Math.min(...Object.values(PRECIOS_REFERENCIA).flatMap((precio) => precio[tipo] === null ? [] : [precio[tipo]]));
