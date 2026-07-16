# Graph Report - src  (2026-07-14)

## Corpus Check
- Corpus is ~49,602 words - fits in a single context window. You may not need a graph.

## Summary
- 226 nodes · 449 edges · 14 communities
- Extraction: 94% EXTRACTED · 4% INFERRED · 2% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.79)
- Token cost: 28,000 input · 13,000 output

## Community Hubs (Navigation)
- Dominio editorial: medida, precio y proceso
- SEO y JSON-LD
- Tipos de mosquitero y mantenimiento
- SSoT: identidad y taxonomia
- Modulo blog: rutas y componentes
- Content Collections (Zod)
- Diagnostico reparar vs reponer
- Layouts de ficha y tipografia
- Chrome del sitio
- Home y vitrina
- Presets de CTA
- Feed RSS

## God Nodes (most connected - your core abstractions)
1. `@config/site` - 46 edges
2. `@layouts/PageLayout.astro` - 19 edges
3. `Reparar o reponer un mosquitero: cómo lo decidimos` - 15 edges
4. `Cómo medir tu ventana para un mosquitero a medida` - 14 edges
5. `Cómo limpiar y mantener tus mosquiteros` - 14 edges
6. `Qué preguntar antes de contratar a alguien que te instale mosquiteros` - 14 edges
7. `Cómo trabajamos: de la medida a la pieza instalada` - 14 edges
8. `./BaseLayout.astro` - 13 edges
9. `Tipos de malla para mosquitero: cuál aguanta tu caso` - 13 edges
10. `Mosquitero a medida` - 12 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `blogCategoryLabel()`  [EXTRACTED]
  pages/rss.xml.ts → config/site.ts
- `Mosquitero magnético` --conceptually_related_to--> `Mosquitero a medida`  [AMBIGUOUS]
  src/content/articulos/tipos-de-mosquitero-cual-elegir.mdx → src/content/articulos/por-que-mosquiteros-a-medida.mdx
- `Mosquitero fijo` --conceptually_related_to--> `Mosquitero a medida`  [AMBIGUOUS]
  src/content/articulos/tipos-de-mosquitero-cual-elegir.mdx → src/content/articulos/por-que-mosquiteros-a-medida.mdx
- `Mosquitero de línea / kit de ferretería` --semantically_similar_to--> `Marco fuera de plano / vencido`  [INFERRED] [semantically similar]
  src/content/articulos/por-que-mosquiteros-a-medida.mdx → src/content/articulos/reparar-o-reponer-un-mosquitero.mdx
- `Medición en tres puntos por lado` --semantically_similar_to--> `Diagnóstico en tres revisiones`  [INFERRED] [semantically similar]
  src/content/articulos/como-medir-ventana-mosquitero.mdx → src/content/articulos/reparar-o-reponer-un-mosquitero.mdx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Los seis tipos de mosquitero y su ventana** — mosquitero_corredizo, mosquitero_abatible, mosquitero_enrollable, mosquitero_plisado, mosquitero_magnetico, mosquitero_fijo [EXTRACTED 1.00]
- **Los cinco pasos: de la medida a la pieza instalada** — contacto_whatsapp, medicion, cotizacion, fabricacion, instalacion, punto_de_no_retorno, verificacion_de_cierre [EXTRACTED 1.00]
- **Las cinco variables que mueven el precio** — variable_tamano_del_vano, variable_tipo_de_mecanismo, variable_malla, variable_estado_del_vano, variable_cantidad_de_piezas [EXTRACTED 1.00]

## Communities (14 total, 0 thin omitted)

### Community 0 - "Dominio editorial: medida, precio y proceso"
Cohesion: 0.08
Nodes (56): Notación en centímetros con un decimal, Cinta metálica / flexómetro, Contacto y cotización por WhatsApp, Corte del aluminio contra la medida, Cotización por pieza (paso 3), Cotización desglosada (mecanismo, malla, instalación), Escuadra del vano, Fabricación (paso 4) (+48 more)

### Community 1 - "SEO y JSON-LD"
Cohesion: 0.10
Nodes (39): CONTACT, ./BaseLayout.astro, jsonLd, meta, absImage(), absUrl(), ArticleData, articleSchema() (+31 more)

### Community 2 - "Tipos de mosquitero y mantenimiento"
Cohesion: 0.13
Nodes (22): Bisagra del abatible, Cajón del enrollable, Cepillo duro abre la trama, Cierre automático, Guías laterales del enrollable, Jabón neutro y trapo suave, Limpieza de la malla, Limpieza del riel (+14 more)

### Community 3 - "SSoT: identidad y taxonomia"
Cohesion: 0.11
Nodes (19): @config/site, AfondoEntry, AfondoImage, BlogCategory, BRANCHES, CoverageState, NavItem, NavLink (+11 more)

### Community 4 - "Modulo blog: rutas y componentes"
Cohesion: 0.23
Nodes (9): @components/BlogCard.astro, @components/BlogSidebar.astro, NAV_ICONS, navIcon(), WA_MESSAGES, breadcrumbs, schemaData, schemaData (+1 more)

### Community 5 - "Content Collections (Zod)"
Cohesion: 0.13
Nodes (14): ARTICLE_CATEGORIES, articulos, casos, collections, faqSchema, heroSchema, imagePath, PRODUCT_CATEGORIES (+6 more)

### Community 6 - "Diagnostico reparar vs reponer"
Cohesion: 0.32
Nodes (13): Ajuste o cambio de herraje, Cambio de tela sobre el mismo marco, Diagnóstico en tres revisiones, Esquinas del marco / escuadra interna, Herraje, Marco de aluminio del mosquitero, Marco fuera de plano / vencido, Pregunta 6: si se rompe la malla, ¿qué hago? (+5 more)

### Community 7 - "Layouts de ficha y tipografia"
Cohesion: 0.36
Nodes (8): @components/CTABanner.astro, @components/FAQAccordion.astro, @components/RelatedLinks.astro, @components/SectionHeading.astro, telUrl(), waUrl(), @layouts/ArticleLayout.astro, ../styles/typography.css

### Community 8 - "Chrome del sitio"
Cohesion: 0.22
Nodes (9): @components/Breadcrumbs.astro, @components/Footer.astro, @components/Header.astro, @components/TopBar.astro, PUNTOS, @components/WhatsAppFloat.astro, href, @layouts/PageLayout.astro (+1 more)

### Community 9 - "Home y vitrina"
Cohesion: 0.22
Nodes (8): @components/CategoryCard.astro, @components/CategoryDetail.astro, @components/Hero.astro, @components/SectionMenu.astro, AFONDO, KEYWORDS, NAV, SHOWCASE

### Community 10 - "Presets de CTA"
Cohesion: 0.22
Nodes (8): BTN_CATALOGO, BTN_CONTACTO, BTN_WA, BtnDef, CTAPreset, PRESET_CATEGORIA, PRESET_CONTACTO, PRESET_GENERAL

### Community 11 - "Feed RSS"
Cohesion: 0.67
Nodes (3): blogCategoryLabel(), SITE, GET()

## Ambiguous Edges - Review These
- `Mosquitero magnético` → `Mosquitero a medida`  [AMBIGUOUS]
  src/content/articulos/tipos-de-mosquitero-cual-elegir.mdx · relation: conceptually_related_to
- `Mosquitero fijo` → `Mosquitero a medida`  [AMBIGUOUS]
  src/content/articulos/tipos-de-mosquitero-cual-elegir.mdx · relation: conceptually_related_to
- `Malla de aluminio (la firme)` → `Mosquitero a medida`  [AMBIGUOUS]
  src/content/articulos/tipos-de-malla-mosquitero.mdx · relation: conceptually_related_to
- `Malla de sombra` → `Mosquitero a medida`  [AMBIGUOUS]
  src/content/articulos/tipos-de-malla-mosquitero.mdx · relation: conceptually_related_to
- `Marco de aluminio del mosquitero` → `Reparación`  [AMBIGUOUS]
  src/content/articulos/reparar-o-reponer-un-mosquitero.mdx · relation: conceptually_related_to
- `Esquinas del marco / escuadra interna` → `Reparación`  [AMBIGUOUS]
  src/content/articulos/reparar-o-reponer-un-mosquitero.mdx · relation: conceptually_related_to
- `Esquinas del marco / escuadra interna` → `Reposición de la pieza`  [AMBIGUOUS]
  src/content/articulos/reparar-o-reponer-un-mosquitero.mdx · relation: conceptually_related_to

## Knowledge Gaps
- **65 isolated node(s):** `@components/Breadcrumbs.astro`, `@components/CategoryCard.astro`, `@components/CategoryDetail.astro`, `@components/Hero.astro`, `@components/SectionMenu.astro` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Mosquitero magnético` and `Mosquitero a medida`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Mosquitero fijo` and `Mosquitero a medida`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Malla de aluminio (la firme)` and `Mosquitero a medida`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Malla de sombra` and `Mosquitero a medida`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Marco de aluminio del mosquitero` and `Reparación`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Esquinas del marco / escuadra interna` and `Reparación`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Esquinas del marco / escuadra interna` and `Reposición de la pieza`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._