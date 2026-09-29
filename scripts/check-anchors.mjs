import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
const PRIORIDAD_ENLACES = ['/mosquiteros/para-puertas/', '/mosquiteros/magneticos/', '/mosquiteros/enrollables/', '/mosquiteros/corredizos/', '/mosquiteros/fijos/', '/mosquiteros/abatibles/', '/mosquiteros/plisados/', '/mosquiteros/accesorios/'];

const forbiddenStart = /^(ver|ir|leer|más|mas|conoce|conocer|explora|explorar|descubre|saber|consulta|visita|entra|clic|click)(?![\p{L}])/iu;
const forbiddenHere = /(^|[^\p{L}])aqu[ií]([^\p{L}]|$)/iu;
const clean = (value) => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
async function files(dir) { const out = []; for (const entry of await readdir(dir, { withFileTypes: true })) entry.isDirectory() ? out.push(...await files(join(dir, entry.name))) : entry.name.endsWith('.html') && out.push(join(dir, entry.name)); return out; }
const counts = new Map(); const errors = [];
for (const file of await files('dist')) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = match[1].match(/\bhref=["']([^"']+)/i)?.[1];
    if (!href?.startsWith('/') || href.startsWith('//')) continue;
    const text = clean(match[2]); const aria = match[1].match(/\baria-label=["']([^"']+)/i)?.[1] ?? '';
    if (forbiddenStart.test(text) || forbiddenStart.test(aria) || forbiddenHere.test(text) || forbiddenHere.test(aria)) errors.push(`${file}: ${href} — ${text || aria}`);
  }
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  for (const match of main.matchAll(/<a\b[^>]*\bhref=["'](\/[^"'#?]*)/gi)) { const href = match[1] === '/' ? '/' : `${match[1].replace(/\/+$/, '')}/`; counts.set(href, (counts.get(href) ?? 0) + 1); }
}
console.log('Enlaces entrantes en <main>');
for (const [href, count] of [...counts].sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`${String(count).padStart(4)}  ${href}`);
console.log('Prioridad'); for (const href of PRIORIDAD_ENLACES) console.log(`${String(counts.get(href) ?? 0).padStart(4)}  ${href}`);
if (errors.length) { console.error(`Infracciones (${errors.length})\n${errors.join('\n')}`); process.exit(1); }
console.log('Infracciones: 0');
