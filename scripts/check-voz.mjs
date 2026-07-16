#!/usr/bin/env node
// ============================================================================
// check-voz.mjs — mide los tics que hacen que el texto suene a máquina.
// ----------------------------------------------------------------------------
// POR QUÉ EXISTE
// El 2026-07-15 Frank dijo "todo suena a robot". Tenía razón, y no era opinión.
// Medido sobre la prosa de site.ts, los tics eran dos:
//
//     "te lo decimos"   52 veces   ← el cierre de casi cada FAQ
//     raya (—)          144        → una cada 120 palabras (sano: 1/400)
//
// El texto no era malo; la franqueza que promete está bien. Lo que cansa es que
// la MISMA promesa llegue con las MISMAS palabras 52 veces. A la tercera deja de
// leerse como honestidad y empieza a leerse como plantilla.
//
// ⚠️ NO CONFÍES EN LOS NÚMEROS DE LA v1 SI LOS VES EN OTRO LADO.
// La v1 de este script reportó además "885 dos puntos, uno cada 19 palabras".
// ERA FALSO: el regex se comía el TypeScript entre strings y contaba «answer:»,
// «question:», «label:» como prosa. Real: 120 dos puntos, uno cada 64. Ver el
// comentario del arreglo más abajo. Un medidor roto es peor que no medir,
// porque te manda a reescribir lo que no estaba mal.
//
// ⚠️ ESTO NO ES UNA MÉTRICA DE SEO. Google no puntúa "suena humano". Lo que hay
// detrás es la conversión: un texto con un solo ritmo cansa, y el que se cansa
// se va. Los umbrales de abajo son criterio, no ciencia — sirven para ver la
// TENDENCIA entre revisiones, no para sacar un 10.
//
// USO:  node scripts/check-voz.mjs
//       node scripts/check-voz.mjs --top 30     (más detalle)
//
// No falla el build a propósito: la voz es un juicio humano, no un booleano.
// Sale con 0 siempre; lee los números y decide.
// ============================================================================

import { readFileSync } from "node:fs";

const TOP = Number(process.argv[process.argv.indexOf("--top") + 1]) || 12;
const src = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");

// Solo texto de cara al usuario: strings largos, sin comentarios ni código.
const sinComentarios = src
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/[^\n]*/g, "");

// ⚠️ BUG CORREGIDO 2026-07-15 — la v1 usaba /'([^'\\]|\\.){60,}'/ y contaba CÓDIGO.
// El regex no distingue la comilla que ABRE de la que CIERRA, así que emparejaba
// desde el cierre de un string hasta la apertura del siguiente y se tragaba el
// TypeScript de en medio. Por eso el top de "dos puntos" salía «answer:»,
// «question:», «label:» — nombres de campo, no prosa. La v1 reportó 885 dos
// puntos (1 cada 19 palabras); el número real es mucho menor.
// EL ARREGLO: los strings de prosa de este archivo nunca llevan salto de línea;
// el código sí. Excluir \n de la clase negada corta la contaminación de raíz,
// porque el match ya no puede saltar de un string al siguiente.
const textos = [
  ...sinComentarios.matchAll(/'((?:[^'\\\n]|\\.){60,})'/g),
  ...sinComentarios.matchAll(/"((?:[^"\\\n]|\\.){60,})"/g),
].map((m) => m[1]);

const corpus = textos.join(" ").replace(/<[^>]+>/g, "");
const palabras = corpus.split(/\s+/).filter(Boolean);
const n = palabras.length;

// ── AUTOTEST ───────────────────────────────────────────────────────────────
// La v1 se rompió sin avisar y estuvo dando números inflados. Un medidor que no
// puede fallar no es un medidor. Si el extractor vuelve a tragarse código, estos
// tokens aparecen en el corpus y el script muere aquí en vez de mentir.
const FUGAS = ["answer:", "question:", "readonly", "string[]", "as const", "=>", "export"];
const fugas = FUGAS.filter((f) => corpus.includes(f));
if (fugas.length) {
  console.error(
    `\n  ✖ EXTRACTOR ROTO — hay código en el corpus: ${fugas.join(", ")}\n` +
    `    Los números serían basura. Arregla el regex antes de leer nada.\n`
  );
  process.exit(1);
}
if (n < 4000) {
  console.error(`\n  ✖ EXTRACTOR ROTO — solo ${n} palabras; el sitio tiene ~7.600.\n`);
  process.exit(1);
}

const linea = (etq, val, nota = "") =>
  console.log(`  ${String(val).padStart(6)}  ${etq.padEnd(26)}${nota}`);

console.log(`\n  ${textos.length} textos · ${n} palabras\n`);

// ── Muletillas ─────────────────────────────────────────────────────────────
const limpias = corpus.toLowerCase().match(/[a-záéíóúñü]+/g) ?? [];
const tri = new Map();
for (let i = 0; i < limpias.length - 2; i++) {
  const k = limpias.slice(i, i + 3).join(" ");
  tri.set(k, (tri.get(k) ?? 0) + 1);
}
// Se ignoran las combinaciones puramente gramaticales: no son un tic de voz.
const RUIDO = /^(de la|que se|en el|a la|lo que|el mosquitero|la malla|de tu|en la|y el|con la|para el|es un|no se|se puede|de un|a tu)\b/;
const muletillas = [...tri.entries()]
  .filter(([k, v]) => v >= 4 && !RUIDO.test(k))
  .sort((a, b) => b[1] - a[1]);

console.log("  ── MULETILLAS (3 palabras, 4+ repeticiones) ──");
if (!muletillas.length) console.log("     ninguna");
muletillas.slice(0, TOP).forEach(([k, v]) => linea(`«${k}»`, `${v}×`));

// ── Tics de puntuación ─────────────────────────────────────────────────────
console.log("\n  ── RITMO ──");
const rayas = (corpus.match(/—/g) ?? []).length;
const dosp = (corpus.match(/:/g) ?? []).length;
linea("raya (—)", rayas, `1 cada ${Math.round(n / Math.max(rayas, 1))} palabras   (sano: 1/400+)`);
linea("dos puntos", dosp, `1 cada ${Math.round(n / Math.max(dosp, 1))} palabras   (sano: 1/80+)`);

// ── Longitud y variedad de frase ───────────────────────────────────────────
// Lo que delata a una máquina no es la frase larga: es que TODAS midan igual.
// Una persona alterna frases de 4 palabras con otras de 30.
const frases = corpus
  .split(/[.!?]+/)
  .map((f) => f.trim().split(/\s+/).filter(Boolean).length)
  .filter((l) => l > 2);
const media = frases.reduce((a, b) => a + b, 0) / frases.length;
const desv = Math.sqrt(frases.reduce((a, b) => a + (b - media) ** 2, 0) / frases.length);
console.log("\n  ── FRASE ──");
linea("media", media.toFixed(1), "palabras");
linea("desviación", desv.toFixed(1), `← la VARIEDAD. Bajo 8 = todas iguales = robot`);
linea("cortas (≤6 pal.)", frases.filter((l) => l <= 6).length, `de ${frases.length}   ← una persona usa muchas`);
linea("largas (>30 pal.)", frases.filter((l) => l > 30).length, `de ${frases.length}`);

console.log("");
