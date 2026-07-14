# mosquitero.mx

Sitio de **mosquitero.mx** construido con **Astro 6 (SSG)** + **Markdown** (Content Collections) y CSS vanilla con tokens. Scaffold derivado de `ORIGENLAB-TEMPLATE` (stack canónico OrigenLab).

> ⚠️ **Scaffold inicial — no publicable todavía.** Los datos de contacto (teléfono, WhatsApp, dirección, email, horario), la geolocalización y las imágenes son **placeholders marcados con `TODO:`**. Regla dura OrigenLab: **cero contenido fabricado**. No se publica con un `TODO:` vivo.

---

## Documentación

Antes de tocar código o crear una página nueva:

| Documento | Para qué |
| --- | --- |
| **[docs/PROCEDENCIA.md](./docs/PROCEDENCIA.md)** | De dónde salió cada cosa. Qué está verificado, qué es heredado y **qué escribí sin que nadie del negocio lo confirmara**. Hallazgos abiertos. Empieza aquí. |
| **[docs/CONTRATO-ENCABEZADOS.md](./docs/CONTRATO-ENCABEZADOS.md)** | Cómo DEBE verse un encabezado de sección. Normativo: el build falla si no se cumple. Incluye checklist para páginas nuevas y decisiones ya descartadas. |

> ⚠️ Buena parte del contenido de la home (tipos de mosquitero, servicios, copy, keywords) está marcado **🟠 Sin validar** en PROCEDENCIA.md: lo redacté a partir de conocimiento general del oficio y **nadie del negocio lo confirmó**. Es andamiaje para poder ver y discutir la página, no verdad del negocio.

---

## Estado actual

- ✅ **Home (`/`)** — única página construida.
- ⏳ **Resto de rutas** — `/productos`, `/servicios`, `/cobertura`, `/blog`, `/contacto` ya están declaradas en `NAV` (`src/config/site.ts`) pero **aún no existen**: sus enlaces dan 404 hasta que se construyan.
- ⏳ **Content Collections** — los esquemas Zod están definidos en `src/content.config.ts` (productos, servicios, articulos, zonas, casos) con la taxonomía de mosquiteros, pero las carpetas de `src/content/` están **vacías**.

---

## Cómo correr

Requisitos: **Node ≥ 22.12.0**.

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo (http://localhost:4321)
npm run build    # astro check + build estático → ./dist
npm run preview  # sirve el build de producción localmente
```

Gate real de deploy = **Action verde** (Cloudflare Pages / GitHub Pages), no el build local.

---

## Estructura de carpetas

```
MOSQUITERO/
├── docs/
│   ├── PROCEDENCIA.md        # ★ De dónde salió cada cosa + qué está sin validar
│   └── CONTRATO-ENCABEZADOS.md # ★ Spec normativa del encabezado + checklist
├── astro.config.mjs          # Astro 6 SSG: site=mosquitero.mx, sitemap, mdx, alias @
├── tsconfig.json             # TS strict + path aliases (espejo de astro.config)
├── package.json              # Deps canónicas (astro 6, @astrojs/mdx ^6, sitemap)
├── public/
│   ├── robots.txt            # Allowlist de bots + sitemap (dominio ya apuntado)
│   ├── favicon.svg           # TODO: favicon real
│   ├── site.webmanifest      # Manifest PWA mínimo
│   └── images/               # Vacías (.gitkeep) — brand/ y og/ traen placeholder
├── scripts/
│   └── rewrite-cdn.mjs       # Reescritura de URLs de imagen a CDN (post-build, opcional)
└── src/
    ├── config/
    │   ├── site.ts           # ★ SSoT: SITE, CONTACT, KEYWORDS, TAXONOMY, NAV, SHOWCASE, waUrl()
    │   └── cta-presets.ts    # Presets de copy para <CTABanner>
    ├── content.config.ts     # Esquemas Zod .strict() con la taxonomía de mosquiteros
    ├── content/              # Vacío (.gitkeep) — aquí va el Markdown de cada colección
    ├── lib/
    │   └── seo.ts            # buildMeta() + buildSchema() (metadatos y JSON-LD)
    ├── layouts/              # BaseLayout → PageLayout → {Product,Service,Article}Layout
    ├── components/           # Header, Footer, Hero, cards, FAQ, CTA, SectionMenu, …
    ├── styles/
    │   └── tokens.css        # ★ Fuente única de design tokens (:root)
    └── pages/
        └── index.astro       # Home (pageType="home")
```

---

## Dónde editar

| Quieres cambiar… | Edita… |
| --- | --- |
| Nombre, dominio, contacto, keywords, taxonomía, WhatsApp | `src/config/site.ts` |
| Colores, tipografía, espaciado (tokens) | `src/styles/tokens.css` |
| Catálogo (productos / servicios / blog / zonas / casos) | `src/content/<colección>/*.md(x)` |
| Reglas de validación del contenido | `src/content.config.ts` |
| Metadatos y JSON-LD | `src/lib/seo.ts` |
| Copy de los CTA recurrentes | `src/config/cta-presets.ts` |

---

**Reglas del sistema (canónicas):**

- **Encabezados en 2 columnas** — `SectionHeading` con `body` de 2 párrafos. El build falla si no. Ver [CONTRATO-ENCABEZADOS.md](./docs/CONTRATO-ENCABEZADOS.md).
- **SSoT estricto** — cualquier dato repetido (contacto, taxonomía, WhatsApp) se importa de `site.ts`. Cero hardcode en páginas.
- **Una sola fuente de tokens** — los `:root` viven solo en `tokens.css`, importado una vez en `BaseLayout`.
- **WhatsApp vía `waUrl()`** — nunca un `wa.me/<número>` escrito a mano.
- **Contenido repetible → Content Collection** — validado con Zod `.strict()` en build-time.
- **Blog en `.mdx`** — los artículos viven en `src/content/articulos/*.mdx`, nunca como `.astro` sueltos.
- **Cero contenido fabricado** — sin `aggregateRating`, reseñas, clientes ni cifras inventadas.
- **Cero links a competencia** — solo internas, portafolio o autoridad.

---

## Hoja de ruta

1. **Datos reales** — llenar todos los `TODO:` de `src/config/site.ts` (NAP, WhatsApp, horario, geo). Sin esto nada más importa.
2. **Marca** — `--c-primary` y tipografía en `tokens.css`; logo, favicon y OG real en `public/images/`.
3. **Catálogo** — Markdown en `src/content/productos/` (un `.md` por tipo de mosquitero) + páginas `/productos/` y `/productos/[...slug]`.
4. **Servicios** — Markdown en `src/content/servicios/` + rutas `/servicios/`.
5. **Cobertura** — colección `zonas` + rutas `/cobertura/[slug]` para SEO local.
6. **Blog** — `.mdx` en `src/content/articulos/` + rutas `/blog/`.
7. **Contacto** — página `/contacto/`.
8. **QA + deploy** — `astro check` 0 errores + build verde → deploy → verificar Action verde.

Mientras las rutas 3–7 no existan, los enlaces de `NAV` que apuntan a ellas dan 404.
