#!/usr/bin/env node
// Verifica offline el HTML generado en dist/: rutas, slash final, robots, JSON-LD y OG.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = join(process.cwd(), 'dist');
const failures = new Map();
let pages = 0;
let links = 0;

function addFailure(type, page, value) {
  const entries = failures.get(type) ?? [];
  entries.push({ page, value });
  failures.set(type, entries);
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
}

function targetExists(href) {
  const path = href.replace(/^\//, '');
  if (!path) return existsSync(join(dist, 'index.html'));
  const direct = join(dist, path);
  return (existsSync(direct) && statSync(direct).isFile()) || existsSync(join(direct, 'index.html'));
}

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta el build antes de comprobar enlaces.');
  process.exit(1);
}

for (const file of htmlFiles(dist)) {
  pages += 1;
  const page = `/${relative(dist, file)}`;
  const html = readFileSync(file, 'utf8');

  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
    const raw = match[2];
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const href = raw.split(/[?#]/, 1)[0];
    if (!href) continue;
    links += 1;

    if (!targetExists(href)) addFailure('rutas inexistentes', page, raw);
    const lastSegment = href.split('/').filter(Boolean).at(-1) ?? '';
    if (lastSegment && !lastSegment.includes('.') && !href.endsWith('/')) addFailure('páginas sin barra final', page, raw);
  }

  if (!page.endsWith('/404.html') && /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    addFailure('noindex inesperado', page, '<meta name="robots" content="noindex…">');
  }
  if (/<meta\s+property=["']og:image["'][^>]*content=["'][^"']+\.svg(?:["']|[?#])/i.test(html)) addFailure('og:image SVG', page, 'og:image termina en .svg');
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { addFailure('JSON-LD inválido', page, match[1].trim().slice(0, 120)); }
  }
}

console.log(`Páginas revisadas: ${pages}`);
console.log(`Enlaces internos revisados: ${links}`);
if (!failures.size) {
  console.log('Fallos: 0');
  process.exit(0);
}
console.log(`Fallos: ${[...failures.values()].reduce((total, entries) => total + entries.length, 0)}`);
for (const [type, entries] of failures) {
  console.log(`\n${type}: ${entries.length}`);
  for (const { page, value } of entries.slice(0, 5)) console.log(`  ${page} → ${value}`);
}
process.exit(1);
