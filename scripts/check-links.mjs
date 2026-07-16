#!/usr/bin/env node
// ============================================================================
// check-links.mjs — verifica que NINGÚN enlace interno del sitio dé 404.
// ----------------------------------------------------------------------------
// POR QUÉ EXISTE ESTE ARCHIVO
// El 2026-07-14 el sitio tenía ~53 hrefs con barra final (`/productos/`) contra
// una política `trailingSlash: 'never'`. O sea: el PRIMER botón del menú
// —"Mosquiteros"— llevaba a un 404. Estuvo así todo el rato.
//
// Y no se detectó porque el verificador que yo usaba hacía esto antes de
// comprobar:
//
//     links[h.rstrip('/')]        // ← EL BUG
//
// Normalizaba la barra final y luego preguntaba si existía `/productos`. Claro
// que existía. Pero el usuario no visita `/productos`: visita lo que dice el
// href, que era `/productos/`. El verificador comprobaba una URL que nadie abre
// y daba "0 enlaces rotos" con el menú roto. Un test que no puede fallar no es
// un test.
//
// REGLA DE ORO DE ESTE SCRIPT: se pide la URL **exactamente como aparece en el
// href**. Sin normalizar, sin arreglar, sin adivinar. Si el href lleva barra y
// el servidor devuelve 404, eso ES el bug — no un detalle de formato.
//
// USO:
//   1. npm run dev            (en otra terminal)
//   2. node scripts/check-links.mjs
//   3. Opcional: BASE=https://mosquitero.mx node scripts/check-links.mjs
//
// Sale con código 1 si hay algún enlace roto → sirve en CI.
// ============================================================================

const BASE = process.env.BASE ?? 'http://localhost:4321';

// Prefijos que no son páginas: assets y rutas de infraestructura.
const IGNORAR = ['/_astro', '/images', '/fonts', '/cdn-cgi', '/favicon'];

const visitadas = new Set();
const cola = ['/'];
const rotas = [];
const ok = [];
/** Dónde se encontró cada href, para poder arreglarlo sin buscarlo a ciegas. */
const origen = new Map();

const esPagina = (h) =>
  h.startsWith('/') &&
  !IGNORAR.some((p) => h.startsWith(p)) &&
  !h.split('/').pop().includes('.');

while (cola.length > 0) {
  const ruta = cola.shift();
  if (visitadas.has(ruta)) continue;
  visitadas.add(ruta);

  let res;
  try {
    // ⚠️ `${BASE}${ruta}` TAL CUAL. No se toca la barra final. Ver cabecera.
    res = await fetch(`${BASE}${ruta}`, { redirect: 'manual' });
  } catch (e) {
    rotas.push({ ruta, estado: `sin respuesta (${e.message})` });
    continue;
  }

  if (res.status === 200) {
    ok.push(ruta);
  } else {
    rotas.push({ ruta, estado: String(res.status) });
    continue; // no se rastrea lo que no carga
  }

  const html = await res.text();
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const h = m[1];
    if (!esPagina(h)) continue;
    if (!origen.has(h)) origen.set(h, ruta);
    if (!visitadas.has(h)) cola.push(h);
  }
}

console.log(`\n  ✔ 200 OK:  ${ok.length} URLs`);
console.log(`  ✖ ROTAS:   ${rotas.length}\n`);

if (rotas.length > 0) {
  for (const { ruta, estado } of rotas.sort((a, b) => a.ruta.localeCompare(b.ruta))) {
    console.log(`     HTTP ${estado}  ${ruta}`);
    console.log(`       └─ enlazada desde: ${origen.get(ruta) ?? '(raíz)'}`);
    if (ruta.endsWith('/')) {
      console.log(`       └─ 💡 Lleva barra final y la política es trailingSlash:'never'.`);
      console.log(`             La URL buena es ${ruta.slice(0, -1)} — arréglalo en la FUENTE`);
      console.log(`             (site.ts: ROUTES / productoHref / servicioHref / zonaHref).`);
    }
  }
  process.exit(1);
}

console.log('  Ningún enlace interno roto.\n');
