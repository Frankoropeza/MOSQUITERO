import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const ALLOWLIST_PATH = path.resolve('scripts/check-dist-content.allow.json');

if (!existsSync(DIST)) {
  console.error('check-dist-content: falta el directorio dist/');
  process.exit(1);
}

let allowlist = new Set();
if (existsSync(ALLOWLIST_PATH)) {
  try {
    const entries = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
    if (!Array.isArray(entries) || !entries.every((entry) => typeof entry === 'string')) {
      throw new Error('debe contener un arreglo de rutas exactas');
    }
    allowlist = new Set(entries.map((entry) => entry.replaceAll('\\', '/').replace(/^\//, '')));
  } catch (error) {
    console.error(`check-dist-content: allowlist inválido: ${error.message}`);
    process.exit(1);
  }
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(file);
    return entry.isFile() && entry.name.endsWith('.html') ? [file] : [];
  });
}

function isVerificationFile(file) {
  const name = path.basename(file);
  return /^(google.*|yandex_.*|BingSiteAuth.*)\.html$/i.test(name);
}

function isRedirect(html) {
  return /<meta\b[^>]*http-equiv\s*=\s*(["'])refresh\1[^>]*>/i.test(html)
    || /location\.replace\s*\(/i.test(html);
}

function visibleBodyText(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1] ?? '';
  return body
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const failures = [];
let checked = 0;

for (const file of htmlFiles(DIST)) {
  const relativePath = path.relative(DIST, file).replaceAll(path.sep, '/');
  if (allowlist.has(relativePath) || isVerificationFile(file)) continue;

  const html = readFileSync(file, 'utf8');
  // Una redirección sólo queda exenta del mínimo de texto; <slot y comentarios se revisan siempre.
  const redirect = isRedirect(html);
  checked++;

  const reasons = [];
  if (html.includes('<slot')) reasons.push('contiene <slot sin procesar');

  const openComments = (html.match(/<!--/g) ?? []).length;
  const closeComments = (html.match(/-->/g) ?? []).length;
  // Solo un comentario sin cerrar oculta contenido; un "-->" suelto en texto o código no.
  if (openComments > closeComments) reasons.push(`comentario HTML sin cerrar (${openComments} abiertos, ${closeComments} cerrados)`);

  // Redirecciones y páginas 404 quedan exentas solo del mínimo de texto.
  const exemptFromMinimum = redirect || /(^|\/)404(\/index)?\.html$/.test(relativePath);
  const visibleCharacters = visibleBodyText(html).length;
  if (!exemptFromMinimum && visibleCharacters < 200) reasons.push(`texto visible del body insuficiente (${visibleCharacters}/200 caracteres)`);

  if (reasons.length) failures.push(`${relativePath}: ${reasons.join('; ')}`);
}

for (const failure of failures) console.error(`check-dist-content: ${failure}`);
console.log(`check-dist-content: ${checked} páginas revisadas, ${failures.length} fallos`);
if (failures.length) process.exit(1);
