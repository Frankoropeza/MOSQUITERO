# Contrato del módulo blog

**Sitio:** mosquitero.mx · **Construido:** 2026-07-14 · **Estado del build:** 29 páginas, 0 errores / 0 warnings.

Documento **normativo**, hermano de [CONTRATO-ENCABEZADOS.md](./CONTRATO-ENCABEZADOS.md). Lo que dice aquí no es preferencia: casi todo lo hace cumplir el build (Zod `.strict()`, guardas que lanzan `throw`) y lo que no, ya rompió una vez y está documentado como hallazgo en [PROCEDENCIA.md](./PROCEDENCIA.md).

> **Cómo leerlo:** si vas a escribir un artículo, salta al [checklist](#8-checklist-de-artículo-nuevo). Si vas a tocar el código del blog, lee [§4 Trampas](#4-trampas-errores-ya-cometidos) — cada una es un error real que ya se cometió en este repo, no una hipótesis.

---

## 1. Rutas

| Ruta | Archivo | `pageType` | robots | Sitemap |
| --- | --- | --- | --- | --- |
| `/blog`, `/blog/2`… | `pages/blog/[...page].astro` | `directory` | index | ✅ |
| `/blog/<slug>` | `pages/blog/[slug].astro` | `article` | index | ✅ |
| `/blog/categoria/<slug>` | `pages/blog/categoria/[categoria].astro` | `directory` | index | ✅ |
| `/blog/tag/<tag>` | `pages/blog/tag/[tag].astro` | `page` | **noindex** | ❌ |
| `/rss.xml` | `pages/rss.xml.ts` | endpoint | — | — |

**Sin slash final.** `trailingSlash: 'never'` (astro.config + `SITE.trailingSlash`): la URL canónica es `/blog` y `astro dev` responde **404 a `/blog/`**. El enlace del RSS debe ser idéntico al canonical del artículo o los agregadores duplican.

### `[...page]` y `[slug]` no colisionan

Astro prioriza **estático > dinámico > rest**, así que `/blog/como-medir…` lo resuelve `[slug]`, no `[...page]`. Y en SSG cada ruta solo emite los paths de su `getStaticPaths`: los conjuntos son disjuntos por construcción.

`[...page]` se usó desde el principio aunque hoy 9 artículos caben en una página (`pageSize: 9`, `paginate` no llega a pintar la barra). Migrar de `index.astro` a `[...page]` después obliga a un redirect de una URL ya indexada.

### Por qué las páginas de tag van `noindex`

**Tag ≠ categoría, y se tratan distinto a propósito:**

- La **categoría** es un enum cerrado que valida Zod → es taxonomía: pocas, estables, con intención de búsqueda propia. **Indexable.**
- El **tag** es string libre (máx. 10 por artículo) → es etiqueta: muchas, efímeras, se solapan. Cada tag genera una página con casi los mismos artículos que su categoría: **contenido duplicado**.

9 artículos × ~4 tags = 11 páginas de archivo casi idénticas contra 1 blog real. Se rastrean (los enlaces reparten equity hacia los artículos) pero **no se indexan**.

Y por lo mismo **no van al sitemap**: listar una URL que responde `noindex` es una contradicción — el sitemap dice "indexa" y la página dice "no". Google obedece al noindex **y anota el sitemap como poco fiable**, lo que degrada la confianza en el resto de URLs del archivo. Un sitemap solo debe contener URLs canónicas e indexables.

---

## 2. Contrato de datos

### Dos archivos, un pacto

Añadir o quitar una categoría exige tocar **los dos**:

| Archivo | Qué gobierna | Si solo tocas éste |
| --- | --- | --- |
| `src/content.config.ts` → `ARTICLE_CATEGORIES` | Los **slugs válidos** (enum de Zod) | El blog la ignora |
| `src/config/site.ts` → `TAXONOMY.articleCategories` | La **presentación** (label + desc) | **El build revienta** |

Categorías vivas: `guias` · `mantenimiento` · `tipos-de-malla` · `la-marca` · `novedades` · `general`.

`BLOG_CATEGORIES` (site.ts) ≠ `ARTICLE_CATEGORIES` (content.config.ts). **Nombres distintos a propósito:** si se llamaran igual, importar ambas en la misma página sería una colisión y acabaríamos tapándola con un `as any`.

### Límites que fallan el build

| Campo | Regla | Por qué |
| --- | --- | --- |
| `title` | 10–70 chars | ≤70 para SEO |
| `description` | 70–160 chars | Meta description |
| `category` | enum cerrado | INFLAPY tuvo "Guias" vs "Guías" como categorías distintas → SEO fragmentado |
| `heroImage` | regex `^/images/` | Imagen obligatoria |
| `.strict()` | rechaza campos desconocidos | MESECI: `hero_image:` se ignoraba en silencio en 16 archivos |

### `relatedProducts` / `relatedServices`: NO usar todavía

Están en el schema, pero las colecciones `productos` y `servicios` están **vacías**. Un `reference()` a una entry inexistente **revienta el build**. Solo se usa `relatedPosts` hasta que exista el catálogo.

### Orden de los listados

Las **3** rutas de listado ordenan igual: `pubDate desc → featured → título (localeCompare 'es')`.

- **`featured`** estaba declarado en el schema y **ninguna ruta lo leía**. Un campo que el frontmatter pide y el sitio ignora es una mentira del contrato: el editor lo marca, no pasa nada, y no hay error que se lo diga.
- **El desempate por título no es cosmético.** Sin él, con fechas iguales el destacado de `/blog` **cambia entre builds** según el orden en que el loader lea el disco.

### Drafts

`draft !== true` se filtra en **las 4 rutas + el sidebar + el RSS**. Redundante a propósito.

En `[slug].astro` el filtro va en `getStaticPaths`: no basta con ocultar el draft del listado — si la página existe, se llega por URL directa y Google la puede indexar.

---

## 3. Componentes

| Componente | Rol | Contrato |
| --- | --- | --- |
| `BlogCard.astro` | Tarjeta de listado | Recibe **datos planos** (strings), NO la entry. No sabe de `astro:content`. |
| `BlogSidebar.astro` | Columna lateral, 5 widgets | **Hace sus propias `getCollection`.** |
| `ArticleLayout.astro` | Ficha del artículo | Importa `typography.css`. Usa `BlogSidebar`, no un aside propio. |

### La asimetría BlogCard / BlogSidebar es deliberada

- `BlogCard` se dibuja **N veces** por página → recibe props. Que consultara la colección por tarjeta sería absurdo.
- `BlogSidebar` se dibuja **1 vez** y sus datos (recientes, conteos, tags) son los **mismos en las 4 vistas** → consulta solo. Si los pasara cada página, las 4 repetirían el mismo bloque de filtrado y ordenado, y bastaría que **una** olvidara excluir drafts para publicar un borrador.

`BlogCard` recibe datos planos por lo mismo: si mañana el schema renombra `heroImage`, se toca la página que mapea, no la tarjeta.

### El sidebar no se posiciona a sí mismo

El `position: sticky` lo pone **la página**, no el componente. Un componente que decide su propia posición no se puede reutilizar en otra retícula. Requiere `:global(.bsb)` porque `.bsb` es clase de otro componente y el scope no la alcanza.

### `typography.css` no puede vivir en el `<style>` del layout

Los estilos de un `.astro` son **scoped**: Astro les añade un hash y **no alcanzan al HTML que entra por `<slot/>`** desde el `.mdx` (que llega sin clases: `<p>`, `<h2>`, `<ul>`). Meterlos ahí obligaría a `:global()` en cada regla — ruido y fuga silenciosa de scope. Por eso es hoja propia, importada desde `ArticleLayout`.

Y **nada de `@tailwindcss/typography`**: el CSS canónico es vanilla + tokens `:root` (regla C1). El plugin fue anti-patrón confirmado en FIREFIGHTERMX.

### Jerarquía de encabezados

- El **H1 lo pone el layout** (`post__title`). Dentro del `.mdx` la jerarquía **arranca en H2**.
- Los **listados** pasan `as="h1"` a `SectionHeading` (no tienen `<Hero>`).
- **Nunca dos H1.** Si hay Hero, `SectionHeading` va en `h2`.

---

## 4. Trampas (errores ya cometidos)

Cada una tiene su hallazgo en [PROCEDENCIA.md](./PROCEDENCIA.md) §6.

### Las cards no aparecen en dev pero el build sí las genera (H11)

**Causa:** el dev server arrancó con `src/content/articulos/` vacía. El glob loader cacheó "no hay archivos" y no vuelve a escanear una colección que estaba vacía al boot. `.astro/data-store.json` se queda congelado.

**Síntoma:** `/blog` muestra el estado vacío y el sidebar sale sin categorías ni recientes — **aunque el código sea correcto** y el build genere las 9 páginas.

**Fix:**
```bash
cd ~/Documents/Claude/Projects/MOSQUITERO && rm -rf .astro && npm run dev
```
Desde la **raíz del repo**, no desde `~`.

### `slot="head"` no llega a BaseLayout solo (silencioso)

`PageLayout` necesita `<slot name="head" slot="head" />` explícito. Sin esa línea, cualquier `<Fragment slot="head">` de una página se pierde **en silencio, sin error**.

### FAQ y breadcrumbs: quién emite el JSON-LD

- **BreadcrumbList** lo emite `buildSchema`, **una sola vez**. El componente `<Breadcrumbs>` solo pinta microdata visible (anti-patrón B3: doble BreadcrumbList, confirmado en BOMBERO y RENTADEILUMINACION).
- **FAQPage** lo emite `buildSchema` desde `schemaData.faqs`. `<FAQAccordion>` va con `emitSchema=false` (su default).

---

## 5. Contenido: cero fabricación

Regla dura del portafolio, y en este sitio **no es teórica**: `site.ts` está lleno de `TODO:` — no hay teléfono, dirección, años de operación, garantía ni clientes validados.

**Prohibido en un artículo:**

- Cifras de negocio: años operando, piezas instaladas, porcentajes, "la mayoría de nuestros clientes"
- **Claims de volumen propio**: "la reparación más común que hacemos", "la pregunta que más nos llega" — describen una distribución de trabajos que solo existe si hay historial operativo
- Plazos de entrega, garantías, políticas de cancelación
- Precios, "desde $X"
- Estadísticas de mercado sin fuente
- Superlativos verificables: "los mejores", "líderes en"
- **Precisión falsa**: "cinco minutos", "un centímetro de más en 1.20 m", "dos minutos por pieza"

**`pubDate` es un dato, no decoración.** Alimenta `datePublished` del JSON-LD Article **y** el `rss.xml`: es lo único que el blog le afirma a Google de forma estructurada. Escalonar fechas para simular historial editorial es fabricar (H8). **Fecha real de publicación, siempre.**

**Si describes un producto o servicio, tiene que existir.** Los artículos venden magnéticos, fijos, 4 mallas, medición a domicilio y reparación de herrajes — todos marcados `TODO: validar` en `site.ts`. Cada `.mdx` afectado lleva su nota editorial en el frontmatter. Describir una línea que no vendes es una promesa que no sostienes.

---

## 6. Espejos: si tocas uno, toca el otro

| A | B | Qué comparten |
| --- | --- | --- |
| `content.config.ts` → `ARTICLE_CATEGORIES` | `site.ts` → `TAXONOMY.articleCategories` | Los slugs |
| `index.astro` → `proceso[]` | `como-trabajamos-de-la-medida-a-la-instalacion.mdx` | **Mismo número de pasos, mismos títulos, mismo orden** |

El segundo ya se rompió (H9): la home se desglosó de 5 a 8 pasos y el artículo se quedó en 5 **declarando ser espejo de `index.astro`**. El cliente leía un flujo en la home y otro en el blog. El contrato ahora está escrito en el frontmatter del `.mdx`.

---

## 7. Interlinking

- `relatedPosts` (frontmatter) → resuelto en `[slug].astro`, descarta drafts (enlazarían a 404).
- Enlaces en prosa `/blog/<slug>` — **sin slash final**.
- Los tags al pie del artículo duplican los del sidebar **a propósito**: en móvil el sidebar cae al final y éstos quedan pegados al texto, que es donde se buscan.

---

## 8. Checklist de artículo nuevo

- [ ] `title` 10–70 chars · `description` 70–160 (Zod los valida; el build falla)
- [ ] `category` existe en **los dos** archivos del enum
- [ ] `heroImage` bajo `/images/` — y **que la imagen exista**
- [ ] `pubDate` = fecha **real** de publicación
- [ ] `relatedPosts` apuntan a slugs existentes y no-draft
- [ ] Sin `relatedProducts` / `relatedServices` (colecciones vacías → build roto)
- [ ] La jerarquía del cuerpo arranca en `##` (el H1 lo pone el layout)
- [ ] Enlaces internos sin slash final
- [ ] **Cero** cifras, plazos, garantías, precios o claims de volumen
- [ ] Si describe un producto/servicio: ¿el cliente lo ofrece? Si no está validado → nota editorial en el frontmatter
- [ ] Si toca el proceso: ¿coincide con `proceso[]` de `index.astro`?
- [ ] `npm run build` → **0 errores, 0 warnings**
- [ ] Verificar en `dist/`: 1 `<h1>` por página, cero enlaces internos rotos
