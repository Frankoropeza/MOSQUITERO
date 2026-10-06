export const TAG_LABELS: Record<string, string> = {
  "a-medida": "Fabricación a la medida",
  aluminio: "Aluminio",
  "antes-de-comprar": "Antes de comprar",
  bricolaje: "Bricolaje",
  cdmx: "CDMX",
  "como-trabajamos": "Cómo trabajamos",
  departamento: "Departamentos",
  herreria: "Herrería",
  insectos: "Insectos",
  instalacion: "Instalación",
  limpieza: "Limpieza",
  malla: "Malla",
  mantenimiento: "Mantenimiento",
  mascotas: "Mascotas",
  materiales: "Materiales",
  medicion: "Medición",
  precio: "Precios",
  puertas: "Puertas",
  reparacion: "Reparación",
  "temporada-de-lluvias": "Temporada de lluvias",
  tipos: "Tipos",
  ventanas: "Ventanas",
  zancudos: "Zancudos",
};

export function tagLabel(slug: string): string {
  const label = TAG_LABELS[slug];
  if (!label) throw new Error(`[tags] Tag sin etiqueta: ${slug}`);
  return label;
}
