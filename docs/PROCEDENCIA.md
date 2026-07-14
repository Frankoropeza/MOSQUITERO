# Procedencia — de dónde salió cada cosa de este sitio

**Sitio:** mosquitero.mx · **Scaffold creado:** 2026-07-14 · **Autor del scaffold:** Claude (sesión Cowork), bajo dirección de Frank.

Este documento existe para que nadie tenga que adivinar de dónde salió una decisión, y para separar sin ambigüedad **lo verificado** de **lo heredado** de **lo que escribí yo sin fuente**. Si vas a publicar, empieza por la tabla de [Estado del contenido](#estado-del-contenido).

Convención de estado usada en todo el documento:

| Estado | Significado |
| --- | --- |
| 🟢 **Verificado** | Dato o decisión con fuente comprobable, citada aquí. |
| 🔵 **Heredado** | Viene del template canónico OrigenLab. No lo inventé; tampoco lo auditó nadie para este sitio. |
| 🟠 **Sin validar** | Lo redacté yo a partir de conocimiento general del oficio. **Nadie del negocio lo confirmó.** |
| 🔴 **Placeholder** | Marcador explícito (`TODO:`). No es un dato. Bloquea publicación. |

---

## 1. Fuentes primarias

| # | Fuente | Ruta / identificador | Qué se tomó |
| --- | --- | --- | --- |
| F1 | **ORIGENLAB-TEMPLATE** | `~/Documents/Claude/Projects/ORIGENLAB-TEMPLATE` | Todo el esqueleto: componentes, layouts, `lib/seo.ts`, `tokens.css`, `content.config.ts`, `site.ts`, `astro.config.mjs`, `package.json`, `robots.txt`. Copiado con `rsync` el 2026-07-14, excluyendo `node_modules`, `dist`, `.astro`, `package-lock.json`, `.git`. |
| F2 | **CLAUDE.md del portafolio** | `~/Documents/Claude/Projects/CLAUDE.md` | Reglas duras: stack Astro 6 + Markdown, SSoT en `config/site.ts`, SEO en `lib/seo.ts`, cero contenido fabricado, gate de deploy = Action verde. |
| F3 | **Skill `origenlab:migracion-astro6`** | plugin OrigenLab | Estructura canónica y versiones de dependencias. |
| F4 | **Skill `origenlab:seo-audit`** | plugin OrigenLab | Checklist SEO: title ≤60, meta ≤160, un solo H1, canonical, JSON-LD por pageType, cero `aggregateRating`, CTA WhatsApp-first, cero links a competencia. |
| F5 | **Skill `origenlab:standup-dg`** | plugin OrigenLab | Modo Semi: sin push ni deploy sin aprobación explícita. |
| F6 | **Conocimiento general del oficio** | — (sin fuente citable) | Taxonomía de tipos de mosquitero y redacción del copy. **Todo lo que sale de aquí es 🟠 Sin validar.** |

> ⚠️ **F1 no tiene repo git.** `ORIGENLAB-TEMPLATE` no está versionado, así que no hay commit que citar como punto de corte. La copia es del 2026-07-14; si el template cambia después, no hay forma automática de saber qué divergió. Versionar el template resolvería esto para los próximos sitios.

---

## 2. Linaje del template (F1)

El template no es código original: cada archivo declara en su cabecera de qué sitio del portafolio se extrajo. Esa cadena se conserva intacta en este repo — **no la borres al editar**, es la única trazabilidad hacia el sitio donde el patrón se probó en producción.

| Archivo en este repo | Origen declarado en su cabecera |
| --- | --- |
| `astro.config.mjs` | PROYECTORED + MESECI (`trailingSlash:'never'`) |
| `package.json` · `tsconfig.json` · `src/styles/tokens.css` | PROYECTORED |
| `src/config/site.ts` | PROYECTORED/src/config/site.ts |
| `src/config/cta-presets.ts` | MESECI/src/config/cta-presets.ts |
| `src/content.config.ts` | MESECI + EVENTECH + SEGURIDADPRIVADA |
| `src/lib/seo.ts` | BOMBERO (utilidades) + PODIUMEX (`@graph`, `buildSchema`) + EVENTECH (nodos, regla de reseñas) |
| `src/layouts/BaseLayout · PageLayout · ProductLayout · ArticleLayout` | BOMBERO |
| `src/layouts/ServiceLayout.astro` | CLINICADEBELLEZA |
| **`src/components/SectionHeading.astro`** | **PROYECTORED/src/components/ui/SectionHeader.astro + SectionHeaderDuo.astro** |
| `src/components/FAQAccordion.astro` | MESECI/src/components/FAQ.astro + PROYECTORED (FaqCotizacionIndex) |
| `src/components/Hero · ProductCard · ServiceCard · Footer · RelatedLinks · Breadcrumbs · WhatsAppFloat · CTABanner` | PROYECTORED |
| `public/robots.txt` | BOMBERO + EVENTECH + INFLAPY/PROYECTORED |

**Dato relevante para el contrato de encabezados:** el layout de dos columnas (`duo`) **ya existía** en el template, heredado de `SectionHeaderDuo.astro` de PROYECTORED. No lo inventé — lo que hice fue volverlo obligatorio. Ver [CONTRATO-ENCABEZADOS.md](./CONTRATO-ENCABEZADOS.md).

---

## 3. Entorno verificado (🟢)

Medido en la máquina el 2026-07-14, no declarado:

```
node 25.9.0            (package.json exige >=22.12.0)
astro 6.4.8            (declarado ^6.1.1)
@astrojs/mdx 6.0.3     (peer astro ^6.4 — @astrojs/mdx@^4 ROMPE con astro 6)
@astrojs/sitemap 3.7.3
@astrojs/check 0.9.9
typescript 5.9.3
```

Gate aplicado en cada cambio de esta sesión: `astro check` **0 errores / 0 warnings** + `astro build` **verde**.

---

## 4. Decisiones de esta sesión

Separadas por quién las tomó. Las de Frank son dirección; las mías son criterio técnico y están sujetas a revisión.

### Dirección de Frank

| Decisión | Consecuencia en el código |
| --- | --- |
| Partir del template canónico, no de cero | `rsync` de F1 |
| Solo la home por ahora | Solo existe `src/pages/index.astro`; colecciones definidas pero vacías |
| Datos de contacto como placeholders marcados | 40 `TODO:` en `src/config/site.ts` |
| Encabezados en 2 columnas: título + 2 párrafos | Contrato duro en `SectionHeading.astro` |
| Centrar verticalmente las dos columnas | `align-items: center` |
| Eyebrow pegado al título | Eyebrow movido dentro de la columna 1 |

### Criterio mío (revisable)

| Decisión | Razón | Riesgo si estaba mal |
| --- | --- | --- |
| Guarda que **rompe el build** si el contrato de encabezado se viola | Mismo criterio que Zod `.strict()`: el error se ve en build, no en producción | Si resulta molesto, se degrada a `console.warn` — pero entonces el contrato deja de ser contrato |
| FAQPage vía `schemaData={{ faqs }}` y no `emitSchema` del acordeón | `lib/seo.ts` centraliza el JSON-LD (anti-patrón B3: doble FAQPage) | Ninguno; verificado: 1 solo `FAQPage` en el render |
| `FAQAccordion` con `title=""` y H2 desde `SectionHeading` | Un solo H2 por sección; `aria-labelledby` apunta al H2 real vía `id` | Ninguno; verificado en el render |
| `placeholder.svg` neutral para las tarjetas | El OG del template filtraba branding "EJEMPLOS · DEMO" | Ninguno |
| Taxonomía de mosquiteros y todo el copy | Conocimiento general del oficio | 🟠 **Alto — ver sección 5** |

---

## 5. Estado del contenido

**Lo que sigue es el punto importante de este documento.**

> 🔴 **GATE DE LANZAMIENTO ACTIVO.** `SITE.noindexAll = true` en `src/config/site.ts`: todo el sitio emite `noindex, nofollow`. El sitio se despliega solo en `mosquitero.pages.dev` y **no debe indexarse** hasta cerrar los 🔴 y validar los 🟠. Quitar el gate es el último paso de publicación, no el primero.

| Contenido | Estado | Nota |
| --- | --- | --- |
| Estructura, componentes, layouts, SEO lib | 🔵 Heredado | Probado en otros sitios del portafolio, no auditado para este |
| Versiones y build | 🟢 Verificado | Medido, no declarado |
| Contrato de encabezados | 🟢 Verificado | Guarda probada; alineación medida a 0.00px / centros ±0.01px |
| Teléfono, WhatsApp, email, dirección, geo, horario | 🔴 Placeholder | 40 `TODO:` en `site.ts`. **Bloquean publicación** |
| Logo, favicon, OG, fotos de producto | 🔴 Placeholder | `placeholder.svg` + logo heredado del template |
| Color de marca `--c-primary` | 🔴 Placeholder | Índigo `#5b3df5` del template, no de mosquitero.mx |
| **Tipos de mosquitero** (enrollables, corredizos, abatibles, plisados, magnéticos, fijos, accesorios) | 🟠 **Sin validar** | Categorías estándar del oficio. **Nadie confirmó que el cliente fabrique las siete.** |
| **Servicios** (fabricación, instalación, medición, reparación) | 🟠 **Sin validar** | **Nadie confirmó que preste los cuatro.** ¿Cobra la medición? Se desconoce |
| **Copy del hero, blurbs, proceso de 5 pasos, FAQ** | 🟠 **Sin validar** | Redacción mía sobre conocimiento general. Descripciones de oficio (cómo medir, cuándo cambiar malla), sin plazos, precios ni garantías inventados — pero **el proceso real del cliente puede ser otro** |
| **Keywords** (`mosquiteros a medida` / `mosquiteros para ventanas` / `instalación de mosquiteros`) | 🟠 **Sin validar** | Elegidas por criterio, **sin datos de volumen ni intención**. Validar antes de escalar contenido sobre ellas |
| Cobertura (CDMX, Edomex) | 🟠 **Sin validar** | Heredado del template, no del negocio |

**Regla:** nada 🟠 debe tratarse como verdad del negocio. Es andamiaje para que la página se pueda ver y discutir. La conversación con el cliente lo confirma o lo tira.

---

## 6. Hallazgos abiertos

Bugs detectados al medir, **no introducidos por este scaffold**:

| # | Hallazgo | Evidencia | Estado |
| --- | --- | --- | --- |
| H1 | **Las fuentes nunca se cargan.** `tokens.css` declara Outfit e Inter; no hay `@font-face` ni link en todo el proyecto. El sitio renderiza en `system-ui` | `document.fonts` vacío; Outfit mide idéntico a system-ui (759.3px en la misma cadena de prueba) | 🔴 Abierto — heredado del template. Cargarlas cambia el look del sitio entero: **decisión de Frank** (self-host vs Google Fonts) |
| H2 | **Overflow horizontal de 118px a 390px.** El mega-menú del Header (`.mega-col`) se maqueta aunque esté oculto y empuja el `scrollWidth` a 508px | Medido en iframe a 390px. `hereda_sech: false` — no es del encabezado | 🔴 Abierto — heredado del template |
| H3 | Las tarjetas mostraban "EJEMPLOS · DEMO" | Apunté `SHOWCASE` al OG del template | ✅ **Cerrado** — bug mío; sustituido por `placeholder.svg` neutral |

H1 y H2 afectan **a todos los sitios del portafolio** que salgan de este template, no solo a mosquitero.mx.

---

## 7. Cómo mantener este documento

- Al cambiar una decisión, edita la fila — no agregues una nota al final.
- Al validar un 🟠 con el cliente, súbelo a 🟢 y di quién lo confirmó y cuándo.
- Al cerrar un `TODO:`, quita la fila 🔴 correspondiente.
- **Al crear una página nueva**, no repitas criterio: sigue [CONTRATO-ENCABEZADOS.md](./CONTRATO-ENCABEZADOS.md) y registra aquí lo que sea específico de esa página.
