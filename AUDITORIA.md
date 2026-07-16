# AUDITORÍA COMPLETA — mosquitero.mx

**Fecha:** 2026-07-15 · **Alcance:** todo `src/`, `public/`, `scripts/`, config, contenido MDX y `dist/` compilado (46 páginas verificadas).
**Canon:** Astro 6 SSG estricto + Markdown/MDX, CSS vanilla con tokens, cero framework JS.

**Veredicto general:** el canon se respeta (cero Tailwind, cero framework JS, aliases correctos, SSG puro, build verde). Los problemas son de **código muerto (~950 líneas), contenido fuera de colecciones (~1,250 líneas en TS), CSS duplicado inline (~300 KB en dist) y duplicación de lógica/íconos entre páginas**.

**Métricas dist/:** 46 HTML · 3.47 MB de HTML total · **364 KB son `<style>` inline duplicado** (10.2%) · 76 KB CSS externo · 4.3 KB JS (solo Header). Páginas más pesadas: `mosquiteros/index.html` 123 KB, `index.html` 108 KB, `servicios/index.html` 103 KB.

---

## 🔴 CRÍTICOS

### C1. ~1,250 líneas de contenido editorial viven en `site.ts` — las colecciones equivalentes están VACÍAS
Viola el canon D1 que declara el propio `content.config.ts:3-5` ("toda entidad repetible vive en una Content Collection… nunca hardcodeada"). `src/content/productos`, `servicios`, `zonas`, `casos` solo tienen `.gitkeep`.

| Data | Ubicación real | Debería vivir en |
|---|---|---|
| `AFONDO` (galerías + cuerpos, 7 tipos) | site.ts:652-802 | `content/productos/` |
| `SERVICIOS_AFONDO` (4 fichas, 8 FAQs c/u) | site.ts:855-1209 | `content/servicios/` |
| `FICHAS` (7 fichas L4 completas) | site.ts:1274-1789 | `content/productos/` |
| `ZONAS_AFONDO` | site.ts:1820-1865 | `content/zonas/` |

Consecuencias: editar copy = editar TypeScript; los schemas Zod de productos/servicios/zonas (content.config.ts:109-231) validan **cero archivos** (código muerto); las guardas manuales de `mosquiteros/[categoria].astro:90-206` y `servicios/[servicio].astro:61-138` (~150 líneas de throws) reimplementan lo que Zod haría gratis.

**Fix:** migrar a colecciones `.md/.mdx`, ampliar los schemas existentes (`comoFunciona`, `encajaEn`, `noConviene`, `datos`, `guias: reference('articulos')`), dejar `site.ts` con identidad/NAP/taxonomía (~600 líneas). Es el refactor mayor — planificar aparte.

### C2. Sitemap contradice `noindexAll`: 32 URLs publicadas que responden `noindex,nofollow`
`site.ts:72` (`noindexAll: true`) + `BaseLayout.astro:94` → verificado en `dist/index.html`: `noindex,nofollow` en TODO el sitio. A la vez, `dist/sitemap-0.xml` lista 32 URLs y `robots.txt` anuncia el sitemap. El propio `astro.config.mjs:32-36` documenta que esto degrada la confianza de Google en el sitemap — y el sitio lo comete en producción.

**Fix:** mientras `noindexAll=true`, quitar sitemap de integrations (o filtrar todo) y comentar `Sitemap:` en robots.txt. Reactivar ambos en el mismo commit que apague el gate.

### C3. `favicon.ico` y `apple-touch-icon.png` → 2×46 requests 404
`BaseLayout.astro:144-146` los referencia; `public/` solo tiene `favicon.svg`. **Fix (5 min):** generar ambos archivos o quitar los `<link>`. Revisar también los icons de `site.webmanifest`.

### C4. ~300 KB de CSS scoped duplicado inline en el HTML generado
Astro con `inlineStylesheets: 'auto'` (default, no configurado) inyecta el CSS scoped en CADA página:

| CSS scoped | Tamaño | Páginas | Bytes duplicados |
|---|---|---|---|
| SectionHeading `.sech` | 5.6 KB | 19 | **100 KB** |
| FAQAccordion `.faq` (2 variantes compiladas) | 5.3+2.9 KB | 11+13 | **88 KB** |
| Hero `.hero` (2 variantes compiladas) | 6.4+5.7 KB | 11+4 | **81 KB** |
| Grid `.blog` listados | 1.26 KB | 19 | **20 KB** |

Hero/FAQ/SectionHeading se compilan con **dos hashes distintos** (duplicación al cuadrado).
**Fix (1 línea):** `build: { inlineStylesheets: 'never' }` en astro.config.mjs → −300 KB agregados + CSS externo cacheable entre páginas.

### C5. Bug visual/a11y activo: FAQ abierta con fondo morado saturado
`FAQAccordion.astro:113` usa `var(--color-red-light, #FEE2E2)` esperando un tinte pálido, pero `tokens.css:129` mapea ese alias a `#7c66f7` (morado fuerte). Texto tinta sobre morado ≈ 4.2:1 — **falla WCAG AA** y regresión de diseño en las 9 páginas con FAQ.
**Fix:** token semántico `--c-primary-tint` (ej. `color-mix(in srgb, var(--c-primary) 12%, white)`) y purgar `--color-red-light` como fondo.

### C6. ~950 líneas de código muerto que además son trampas activas
0 importadores verificados por grep:

- `layouts/ProductLayout.astro` (222 líneas) — `mosquiteros/[categoria].astro:37` lo declara no usado
- `layouts/ServiceLayout.astro` (452) — vocabulario de OTRO negocio (clínica: `preCare`, `clinicalCases`, "Agendar")
- `components/ProductCard.astro` (69) y `ServiceCard.astro` (70) — 90% idénticos entre sí
- `config/cta-presets.ts` — y **viola la regla dura del sitio**: promete "precios, disponibilidad y tiempos de entrega" (cta-presets.ts:41), exactamente lo que `mosquiteros/[categoria].astro:16` prohíbe. El primer dev que lo importe publica la promesa.

Además los layouts muertos usan clases `.btn btn--primary` que **no existen en ningún CSS** — si alguien los reactiva, CTAs sin estilo.
**Fix:** borrar los 5 archivos.

---

## 🟠 ALTOS

### A1. Sitemap con regex obsoleto tras el rename `/productos` → `/mosquiteros`
`astro.config.mjs:55,60`: regex dice `(productos|servicios|blog|cobertura)` pero la ruta es `/mosquiteros` (site.ts:270). Verificado en `dist/sitemap-0.xml`: el catálogo —las páginas de dinero— tiene priority **0.7** mientras el blog tiene 0.8-0.9. **Fix (2 min):** cambiar ambos regex a `(mosquiteros|servicios|blog|cobertura)`.

### A2. SVG de WhatsApp copiado en 9 archivos + 1 versión distinta
Path de ~1.4 KB duplicado en: Header:51, TopBar:87, Footer:33, Hero:23, CTABanner:22, WhatsAppFloat:18, QuoteForm:126, ServiceCard:42, BlogSidebar:150 — y `SectionMenu.astro:95` usa OTRO ícono de WhatsApp diferente (dos WhatsApps distintos en la home). En páginas: `[categoria].astro:482`, `[servicio].astro:382`, `cobertura/[zona].astro:107`, `contacto.astro:112`. La flecha `M5 12h14M12 5l7 7-7 7` está en 10 archivos (11 ocurrencias). Teléfono y reloj también duplicados con variantes.
**Fix:** `src/config/icons.ts` (mismo patrón que `nav-icons.ts`) con `WA_SVG`, `ARROW_SVG`, `PHONE_SVG`, `CLOCK_SVG`.

### A3. 35 fallbacks de hex ROJOS del template heredado en 9 componentes
`var(--color-red, #C41E24)` etc. en Hero (5), CTABanner (7), ServiceCard (6), ProductCard (5), FAQAccordion (4), RelatedLinks (4), SectionHeading (2), Footer:183, Breadcrumbs:39. Ocultan tokens rotos pintando ROJO en un sitio índigo e inflan el CSS. Peor: cada componente inventa su propio fallback para el MISMO token (`--text-xs` cae a 3 valores distintos; `--container-max` a `1400px`, `1200px` y el real es `90%`).
**Fix:** purga mecánica de todos los fallbacks en `var()` — los tokens los garantiza BaseLayout. Es un sed seguro.

### A4. ~200 líneas de lógica duplicada entre las dos plantillas L4 (y listados de blog)
Pares idénticos verificados:

- Guarda `norm()` + dedupe FAQs: `[categoria].astro:134-156` ≡ `[servicio].astro:92-113`
- Guarda `MIN_FAQS=8`: `[categoria]:120-130` ≡ `[servicio]:77-87`
- Guarda de guías publicadas: 3 copias (`[categoria]:164-182`, `[servicio]:118-135`, `index:81-96`)
- Script scroll-spy IntersectionObserver: `[categoria].astro:659-702` ≡ `[servicio].astro:527-561` (~40 líneas)
- Sort del blog: 3 copias (`blog/[...page]:44-49`, `categoria/[categoria]:32-37`, `tag/[tag]:33-38`)
- Bloques `<style>` de `blog/categoria/` y `blog/tag/` con **md5 idéntico**; `blog/[...page]` casi igual

**Fix:** `src/lib/guards.ts`, `src/lib/blog.ts` (`sortPosts()`), `src/scripts/toc-spy.ts` importado por ambas L4, y un `BlogListLayout.astro` para las 3 rutas de listado.

### A5. Frontmatter SEO de artículos es contrato muerto
`content.config.ts:62-67` define `noindex`, `seoTitle`, `seoDescription`, `keywords` para artículos, pero `blog/[slug].astro:54-67` no pasa ninguno a `ArticleLayout`. Un editor que marque `noindex: true` en un .mdx **no obtiene noindex** (y el artículo entra a sitemap y RSS).
**Fix:** cablear los campos en `[slug].astro` o borrarlos del schema.

### A6. Cero previews sociales funcionales
Los 9/9 artículos usan `heroImage: '/images/placeholder.svg'`; `og:image`/`twitter:image` global es `/images/og/default.svg` — **SVG, formato que Facebook/WhatsApp/LinkedIn no renderizan**. **Fix:** OG real 1200×630 PNG/JPG (ya hay TODO en site.ts:32); guarda de build que verifique existencia en `public/`.

### A7. No existe `404.astro`
robots.txt hace `Disallow: /404` y el sitemap lo filtra — infraestructura para una página que no existe. Cloudflare sirve un 404 genérico sin navegación. **Fix:** `src/pages/404.astro` con PageLayout + noindex + enlaces al catálogo.

### A8. Receta "container" replicada en 9 componentes (13 ocurrencias)
`max-width + margin-inline:auto + padding-inline` copiado en Header (×2), TopBar (×2), Footer (×3), Hero, CTABanner, Breadcrumbs, FAQAccordion, RelatedLinks, ArticleLayout — que además **redeclara `.container` scoped** (ArticleLayout:228) violando la advertencia explícita de `layout.css:13-15`.
**Fix:** clase global `.container` (ya existe) o utilitaria `.inner-container` en layout.css.

### A9. Gradiente oscuro y verde WhatsApp hardcodeados y divergentes
- `Hero.astro:60` ≡ `CTABanner.astro:65`: mismo gradiente copiado, con `#180A0D` (negro-rojizo heredado de MESECI, no cuadra con marca índigo). Footer define su propia paleta oscura (3 "oscuros" distintos sin token).
- `#25D366` en 5 archivos con DOS hovers distintos (`#1ebe57` en ficha.css:324/ServiceCard:67 vs `#1ebe5d` en WhatsAppFloat:37).

**Fix:** tokens `--gradient-dark`, `--c-dark-bg`, `--c-wa`, `--c-wa-dark` en tokens.css.

### A10. `ROUTES` y `metaAudit` exportados y nunca usados
`site.ts:288-298` pide "impórtalo en vez de escribir la cadena" — 0 imports; las rutas se escriben a mano en los `menuSecciones` de 7 páginas (con labels ya divergentes: "Tipos y catálogo" vs "Catálogo completo"). `metaAudit()` (seo.ts) detectaría el título repetido de la home ("Mosquiteros… | mosquiteros…") — 0 consumidores.
**Fix:** adoptar `ROUTES` + helper `menuFor()` en site.ts, o borrar.

---

## 🟡 MEDIOS

**M1. Taxonomías espejo mantenidas a mano.** `PRODUCT_CATEGORIES` existe con el mismo nombre y distinto shape en `content.config.ts:74-82` y `site.ts:384`. Igual `SERVICE_CATEGORIES` y `ARTICLE_CATEGORIES` vs `TAXONOMY`. Fix: derivar en content.config con `TAXONOMY.categories.map(c=>c.slug)`.

**M2. Contrastes que fallan AA.** `Footer.astro:231` copy `rgba(255,255,255,.3)` sobre `#000` ≈ 2.4:1; `:227` `.45` ≈ 3.5:1; `CTABanner.astro:97` badge `.5` sobre primario < 3:1. Fix: alphas ≥ .65.

**M3. Sin skip-link.** `<main id="main-content">` existe (PageLayout:94) pero nadie lo enlaza; header con ~40 enlaces tabulables. Fix: `<a class="skip-link" href="#main-content">`.

**M4. Fuentes fantasma.** `tokens.css:35-36` declara Outfit/Inter sin `@font-face` (BaseLayout los tiene comentados) — el sitio renderiza en system-ui. Fix: self-host woff2 o quitar los nombres del token.

**M5. `as any` que anulan el tipado.** `seo.ts:415-579` (cadena de `(b as any)` sobre `SITE.business` perfectamente tipado), `BaseLayout:104-105`, `Footer:25,54,106,138`, `RelatedLinks:25`. Fix: tipar contra los tipos exportados de site.ts.

**M6. Meta description de L4 corta a mitad de palabra.** `[categoria].astro:219`: `slice(0,150)+'…'` incondicional antes de que `truncateMetaDescription()` (seo.ts:138, corta por oración) pueda actuar. Fix: pasar el párrafo completo.

**M7. IDs fijos que colisionan con 2 instancias.** `CTABanner.astro:31` `id="cta-banner-heading"`, `QuoteForm.astro:66` `id="qform"` + getElementById. Fix: derivar id de prop.

**M8. RSS `author` inválido.** `rss.xml.ts:48` emite "Mosquitero.mx"; RSS 2.0 exige formato email. Fix: `` `${CONTACT.email} (${autor})` `` o `dc:creator`.

**M9. `cobertura/[zona].astro` ignora `ZONAS_AFONDO`** (reconocido en :5) y su getStaticPaths no valida existencia como sus hermanas. El campo `confirmar` (site.ts:1815) no lo lee nadie.

**M10. TopBar arrastra ~100 líneas de "modo guía" de la plantilla a producción** (TopBar:34-59, 94-119, 162-201) — el CSS `.tbg*` se compila aunque `guia=false` siempre. Fix: borrar en sitio de cliente.

**M11. SectionMenu:** default `href="#"` con `external:true` (:62) — botón WhatsApp que abre `#` si falta el prop; `:75` renderiza `it.icon` como texto plano (SVG saldría escapado); `:89` `noopener` sin `noreferrer`.

**M12. FAQAccordion mete HTML de bloque en `<p>`** (`:73` `<p set:html>`) — una respuesta con `<ul>` rompe el párrafo y los estilos `:global(p)`. Fix: `<div set:html>`.

**M13. Contrato frágil `split('  ')`** en `Footer.astro:92-94` sobre `CONTACT.schedule.weekdays` (doble espacio como separador). Un espacio simple = `undefined` en 46 páginas. Fix: estructurar `{day, hours}` en site.ts.

**M14. Comentarios-doc que ya mienten** (repo gobernado por comentarios): `blog/[...page]:10` dice "4 artículos" (hay 9); `categoria/[categoria]:10` dice 5 categorías (hay 6); `nav-icons.ts:11` dice "sin lector" (lo consumen 2 páginas); nota editorial de `tipos-de-mosquitero-cual-elegir.mdx` desactualizada; `cobertura/[zona]:33` cita línea equivocada de seo.ts.

---

## 🔵 BAJOS

- **B1.** `layout.css:34-42`: `.section--surface` ≡ `.section--faq` (misma declaración).
- **B2.** `Header.astro:56` `role="banner"` redundante; casts `as string | undefined` innecesarios (Header:49, TopBar:31).
- **B3.** `Footer:80` `mapsUrl ?? '#'` link muerto; `:44` logo apunta a placeholder marcado TODO.
- **B4.** `BlogCard:70` dos imágenes `fetchpriority=high` por listado compiten por LCP.
- **B5.** Tipos inline repetidos (`related` re-declarado en 3 layouts); `Cert`/`Branch` viven en Footer y no en site.ts.
- **B6.** `check-voz.mjs` solo mide site.ts — no los 9 MDX (el texto más largo del sitio); umbral `n<4000` muere si C1 se ejecuta. `check-links.mjs` no distingue redirects ni escanea `src=` de imágenes.
- **B7.** `rewrite-cdn.mjs` no está cableado en package.json y no reescribe JSON-LD (hoy inofensivo, aborta con `REEMPLAZA`).
- **B8.** robots.txt: `Host:` (deprecada), `Crawl-delay` (Google la ignora), `Disallow: /gracias` para página inexistente.
- **B9.** Los 9 artículos comparten `pubDate: 2026-07-14` — el orden del blog es alfabético de facto. `WA_MESSAGES.urgente` sin consumidor.
- **B10.** `tags` sin regex kebab-case en schema (URLs de tag feas posibles); `faqSchema` sin `min(1)`.

---

## ✅ Lo que está BIEN (no re-auditar)

Filtro de drafts consistente en los 6 puntos de consumo. 141 FAQs, 0 duplicadas site-wide (verificado programáticamente). FAQPage emitido una sola vez por página. `productSchema` sin `offers` fantasma, sin `geo` 0,0, sin ratings fabricados, `@graph` con `@id` correctos. Canonicals absolutos sin slash. Trío noindex-tags/sitemap/pageType impecable. Aliases tsconfig↔astro.config espejados. 18/18 componentes y 5/5 layouts con `interface Props`. JS del Header y QuoteForm sin duplicación ni `is:inline` innecesario. Cero Tailwind/framework/imports rotos.

---

## PLAN DE REMEDIACIÓN PRIORIZADO

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Fix regex sitemap `/productos`→`/mosquiteros` (A1) + favicon.ico/apple-touch (C3) | 10 min | SEO + 404s |
| 2 | Resolver contradicción sitemap↔noindexAll (C2) | 15 min | Confianza Google |
| 3 | `inlineStylesheets: 'never'` (C4) | 1 línea | **−300 KB HTML**, CSS cacheable |
| 4 | Borrar 5 archivos muertos: ProductLayout, ServiceLayout, ProductCard, ServiceCard, cta-presets (C6) | 15 min | −950 líneas, elimina trampas |
| 5 | Fix FAQ morada — token `--c-primary-tint` (C5) | 20 min | Bug visible en 9 páginas |
| 6 | Purga de 35 fallbacks rojos (A3) — sed seguro | 30 min | CSS limpio |
| 7 | `config/icons.ts` compartido WA/flecha/tel (A2) + tokens `--c-wa`/`--gradient-dark` (A9) | 1-2 h | −peso, consistencia |
| 8 | `lib/guards.ts` + `lib/blog.ts` + `scripts/toc-spy.ts` + `BlogListLayout` (A4) | 2-3 h | −200 líneas duplicadas |
| 9 | Cablear frontmatter SEO de artículos (A5) + OG images PNG (A6) + 404.astro (A7) | 2 h | Desbloquea des-noindex |
| 10 | Adoptar `ROUTES`/`menuFor()` (A10) + medios M1-M14 | 3-4 h | Mantenibilidad |
| 11 | **Migración C1: contenido de site.ts → content collections** | 1-2 días | Arquitectura canónica |

Los pasos 1-6 caben en una sesión corta y eliminan todos los críticos salvo C1.
