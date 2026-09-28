// 200 ppm es la velocidad de lectura en pantalla que usamos; el número sale del texto real, no se inventa.
export const minutosLectura = (body?: string): number => {
  if (!body) return 1;

  const texto = body
    .split(/\r?\n/)
    .filter((linea) => !/^\s*(?:import|export)\b/.test(linea))
    .join("\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*(?:[-+*]|>|\d+[.)])\s+(?:\[[ xX]\]\s*)?/gm, " ")
    .replace(/[#*]/g, " ");

  const palabras = texto.trim().match(/\S+/gu)?.length ?? 0;
  return Math.max(1, Math.round(palabras / 200));
};
