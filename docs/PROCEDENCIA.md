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
| ~~Solo la home por ahora~~ → **generar las secciones** (2026-07-14) | Nuevas: `/contacto`, `/cobertura` (+ CDMX y Edomex), `/servicios`, `/productos`. De 5 a 35 páginas. Las colecciones `productos`/`servicios`/`zonas`/`casos` siguen vacías: estas páginas son data-driven desde `site.ts`, no desde Markdown |
| Datos de contacto como placeholders marcados | 40 `TODO:` en `src/config/site.ts` |
| Encabezados en 2 columnas: título + 2 párrafos | Contrato duro en `SectionHeading.astro` |
| Centrar verticalmente las dos columnas | `align-items: center` |
| Eyebrow pegado al título | Eyebrow movido dentro de la columna 1 |
| Proceso: cards con imagen, filas de 4, 8 pasos | Grid `repeat(4,1fr)` + `public/images/proceso/paso-1..8.svg` (🔴). Los 3 pasos añadidos son 🟠 — ver §5 |
| **Sitio sin animaciones, salvo botones** | **CONTRATO DE MOVIMIENTO** en `tokens.css`. Ver abajo |
| Registrar `/mosquiteros/enrollables` como **plantilla L4** | [CONTRATO-L4.md](./CONTRATO-L4.md). `/servicios/<id>` y `/cobertura/<zona>` quedan pendientes de homologar contra ella (§9 del contrato dice cómo) |
| Quitar el CTA final de WhatsApp de la home | `<CTABanner>` eliminado de `index.astro` (el componente sigue en uso en layouts y `/blog`). Con él murieron el import y `const waLink` |
| Segundo `<SectionMenu>` antes del footer, para SEO | 4 botones a artículos del blog + CTA a `/blog`. Enlaza **solo a rutas que existen**, con guarda que rompe el build si un slug deja de generar ruta |

### Criterio mío (revisable)

| Decisión | Razón | Riesgo si estaba mal |
| --- | --- | --- |
| Guarda que **rompe el build** si el contrato de encabezado se viola | Mismo criterio que Zod `.strict()`: el error se ve en build, no en producción | Si resulta molesto, se degrada a `console.warn` — pero entonces el contrato deja de ser contrato |
| FAQPage vía `schemaData={{ faqs }}` y no `emitSchema` del acordeón | `lib/seo.ts` centraliza el JSON-LD (anti-patrón B3: doble FAQPage) | Ninguno; verificado: 1 solo `FAQPage` en el render |
| `FAQAccordion` con `title=""` y H2 desde `SectionHeading` | Un solo H2 por sección; `aria-labelledby` apunta al H2 real vía `id` | Ninguno; verificado en el render |
| `placeholder.svg` neutral para las tarjetas | El OG del template filtraba branding "EJEMPLOS · DEMO" | Ninguno |
| Taxonomía de mosquiteros y todo el copy | Conocimiento general del oficio | 🟠 **Alto — ver sección 5** |
| Al quitar animaciones, **quitar también el efecto** (no solo la `transition`) | Un `:hover { transform: translateY(-3px) }` sin transición no queda "más rápido": la tarjeta pega un brinco seco de 3px. Se fueron las alzas, los zooms de foto y los barridos de filete — quedó el cambio de color, que es feedback, no movimiento | Si Frank quería conservar los efectos "pero instantáneos", esto los eliminó de más. Se revierte por componente |
| Eliminar el compactado del header **y su maquinaria** | Sin animación de altura era un brinco a media página. Al irse se llevó el sentinel + `IntersectionObserver`, `.is-scrolled`, `--header-height-sm` y `--shadow-header-lift` | Ninguno funcional; el header es de altura fija |
| `--transition`/`--transition-base` **eliminados**, no apuntados a `none` | `transition: background var(--transition)` con `--transition: none` es CSS **inválido** igualmente — el alias no hacía lo que su comentario prometía. Sin la variable, la declaración se tira igual, pero sin fingir que hay un contrato | Un componente copiado del template puede traer un `var(--transition)` muerto. Efecto: no anima — que es lo que queremos |
| El menú de guías enlaza al **blog**, no a `/productos`·`/servicios`·`/cobertura` | Frank lo pidió "para mejorar el SEO". Esas 3 rutas **no existen todavía**: enlazarlas es enlazar 404s, que resta en vez de sumar. El blog es lo único construido — 9 artículos, 4 categorías | Si Frank quería la barra como *anticipo* de las rutas futuras, esto no es lo que pidió. Se cambia el array `GUIAS_MENU` |
| Guarda que **rompe el build** si un slug del menú no genera ruta | Mismo criterio que la guarda de encabezados: un enlace roto debe verse en build, no en producción. Usa el mismo filtro `draft !== true` que `blog/[slug].astro`, así que un artículo en draft también la dispara | Ninguno; **probado**: con un slug falso el build falla con el mensaje esperado |
| `MenuCta.icon` nuevo en `SectionMenu` (`"wa"`\|`"arrow"`\|`"none"`, default `"wa"`) | El ícono de WhatsApp estaba hardcodeado: el botón destacado solo podía ser un CTA de WhatsApp. El de la barra de guías lleva a `/blog` — pintarle un WhatsApp sería mentir sobre el destino | Ninguno; el default preserva el uso existente. Verificado en el render: menú 1 con ícono WA, menú 2 sin él |
| **NO escribir las fichas de `/productos/<tipo>` y `/servicios/<id>`**; enlazar a anclas del índice vía `productoHref()`/`servicioHref()` | El sitio tenía **1.358 enlaces rotos** en 11 rutas (el mega-menú los repite en cada página). Escribir 11 fichas hoy = 11 páginas clonando la misma frase con otro título, porque materiales/mallas/precios NO están validados. Eso es thin content y pesa contra el dominio entero. Un índice con anclas reales es mejor que 11 fichas huecas | Si Frank quería las fichas ya, esto no es lo que pidió. **Se revierte cambiando 2 funciones** en `site.ts` — por eso son funciones y no strings |
| Quitar `/nosotros` del footer | No existe, y el footer lo enlazaba desde las **35** páginas. Un 404 en el footer global aparece en todas partes | Se repone cuando exista. Necesita historia real del negocio |
| La L2 `/productos` lleva una **tabla de decisión** que la home no tiene | Sin ella, la L2 sería la home con 3 tarjetas más: mismo contenido compitiendo consigo mismo por la misma búsqueda. La intención de *"qué mosquitero necesito"* no se resuelve con una vitrina. La columna **"Piénsalo si…"** (cuándo un tipo NO conviene) es lo que la hace útil: un catálogo donde todo sirve para todo no ayuda a decidir | 🟠 La tabla es oficio general, no specs del cliente. Si él tiene criterios propios, se corrigen |
| **Una FAQ distinta por página** (0 solapadas entre las tres) | Dos `FAQPage` con las mismas preguntas compiten: Google elige uno y descarta el otro. Home = aterrizaje · `/mosquiteros` = qué tipo elijo · `/servicios` = cómo trabajan | Ninguno; **verificado**: home 8 · mosquiteros 6 · servicios 6 · **solapadas 0 en los tres cruces** |
| **Una keyword por L2**: kw1 `mosquiteros a medida` → `/mosquiteros`; kw3 `instalación de mosquiteros` → `/servicios` | Dos páginas peleando por la misma keyword se canibalizan. Cada L2 abre su title con la suya | Si el volumen real desmiente la tripleta (sigue 🟠, sin datos), se reasignan |
| Las L4 llevan **sidebar**, las L2 no — y eso ES homologar | Una L2 es un índice (secciones anchas: Hero → menú → vitrina → tabla → a fondo). Una L4 es una página de LECTURA: alguien que ya eligió y viene a informarse. Para eso el patrón correcto es contenido + sidebar sticky — y es el que el sitio YA usa en los artículos (`ArticleLayout` + `BlogSidebar`). La L4 sigue el patrón de las páginas de lectura, no el de las de índice | Si se quiere el mismo ritmo que las L2, se pierde el índice lateral y el CTA siempre visible |
| **NO se usó `ProductLayout`** (existe, y trae sidebar) | Su `<CTABanner>` final promete *"precio, disponibilidad y **tiempos de entrega**"* — y los tiempos de entrega son justo uno de los tres datos que nadie ha validado. Copiarlo habría metido en 7 páginas una promesa que el cliente paga. Además trae bloques de "Certificaciones y normas" que no aplican | `ProductLayout` sigue en el repo sin usar. Si algún día se usa, hay que arreglarle ese CTA primero |
| Sidebar de **2 widgets**, sin scroll interno | Tenía 5 y no cabían, así que le puse `max-height:100vh` + `overflow-y:auto` — **un scroll dentro del scroll de la página**. Eso no arregla que sobre contenido: lo esconde, y obliga al usuario a descubrir que ese bloque scrollea aparte. Frank lo detectó. La causa eran 2 widgets que **duplicaban**: "De un vistazo" era `datos.slice(0,3)`, un subconjunto literal de la tabla que está 300px más abajo; "Dónde instalamos" repetía las zonas que el footer ya lista en las 46 páginas. Borrados. "Otros tipos" bajó al final del artículo, donde además se lee cuando decides si era el tuyo | Lo que queda (~460px) cabe en cualquier viewport. **Regla:** si vuelve a no caber, quita un widget — no le pongas overflow |
| Sidebar: **5 widgets con enlaces contextuales**, y se soltó el sticky | Frank pidió "más widgets y más enlaces para SEO". **Más enlaces por sí solos no mueven SEO**: Google descuenta el boilerplate —los enlaces idénticos repetidos en todas las páginas son navegación, no recomendación— y el footer ya los tiene. Lo que sí pesa es el enlace **contextual**, que cambia por página. Por eso `FICHAS.guias` y `FICHAS.servicios`: cada tipo elige los suyos. **Verificado: 7/7 combinaciones distintas** entre las fichas. Con 5 widgets el sticky ya no cabe → se soltó (columna que fluye), NO se repuso el `overflow` | **Se pierde** el CTA siempre visible. Se compensa con el CTA del hero, el WhatsAppFloat y el formulario del módulo FAQ. Para recuperar el sticky hay que bajar a 2 widgets — nunca meter overflow |
| **Guardas de build** para el enlazado contextual (`guias` → colección, `servicios` → `TAXONOMY.services`) | Son slugs escritos a mano que salen en el sidebar de las 7 fichas: un renombre de `.mdx` serviría 404s en todas ellas sin que nadie se entere. Usa el mismo filtro `draft !== true` que `blog/[slug].astro`: que el archivo exista no basta, un draft no tiene ruta | **Probadas las dos**: slug inexistente → nombra la ficha y lista los publicados; id de servicio inválido → nombra la ficha y lista los válidos |
| **Guarda de build** para las FAQ de las fichas: mínimo 8 y cero duplicadas entre tipos | Hasta el 2026-07-14 la unicidad la comprobaba **yo a mano** después de cada cambio. Eso no escala y no sobrevive a la siguiente persona que edite `site.ts`: acabaría con dos páginas peleando por la misma pregunta —Google elige un `FAQPage` y descarta el otro— sin que nadie se entere hasta ver caer el tráfico. Normaliza tildes y mayúsculas: la misma pregunta con otra tilde sigue siendo la misma para Google | **Probadas las dos**: con una pregunta duplicada dice en qué dos tipos está; con 7 preguntas dice cuál está bajo el mínimo. **Límite conocido:** solo cruza entre `FICHAS`. La home, las L2 y los artículos hay que revisarlos a mano |
| Scroll-spy en el índice con `IntersectionObserver` | Marca la sección activa. **No viola el contrato de movimiento**: solo conmuta una clase, el color cambia al instante y sin transición. Observer y no listener de scroll: el listener corre en cada frame y es justo lo que hace que una página se sienta pesada | Ninguno; degrada solo (sin JS, el índice sigue siendo enlaces) |
| `FICHAS` con campo **`noConviene`** en las 7 | Sin él, la L4 sería la L2 recortada: contenido duplicado compitiendo con su propio padre. Y en un producto **a medida no hay devolución** — decirle a alguien "esto no es para ti" antes de fabricar vale más que venderle la pieza equivocada | 🟠 Oficio general. Si el cliente tiene criterios propios, se corrigen |
| Las tres L2 **comparten esqueleto, no palabras** | Tres intenciones distintas: `/mosquiteros` = "¿qué tipo?" (lo define tu marco) · `/servicios` = "¿qué me hacen?" (lo define en qué punto estás) · `/cobertura` = "¿llegan a mi casa?". Si el copy converge, vuelven a competir | Revisar al editar. **Verificado**: 26 preguntas de FAQ, 6 cruces, 0 solapadas |
| `/cobertura` es L2 completa **pero con solo 2 zonas y sin listar colonias** | Es la sección más importante de un negocio de área de servicio (es la cara pública de `areaServed`, el campo que decide a quién le apareces). Pero clonar la ficha por colonia son **doorway pages**: Google las penaliza y puede caer el dominio ENTERO, no solo esas páginas. Dos zonas con sustancia posicionan; cincuenta clonadas hunden el sitio | **Verificado**: 0 menciones de colonias. Si el cliente da datos reales por municipio (tiempos, condiciones, trabajos hechos ahí), esa zona sí gana su página |
| `/cobertura` lleva **comparativa**, no tabla de decisión | En las otras dos el usuario elige; aquí no — vive donde vive. La pregunta real es "¿y qué cambia según dónde estoy?". La respuesta honesta: el trabajo es idéntico, solo cambia si hay que confirmar municipio | 🟠 Sin tiempos ni costos de visita: nadie los ha validado |
| `SHOWCASE` extendido a 7 + `SHOWCASE_HOME` (corte de 4) | El catálogo L2 debe mostrar los 7 o no es catálogo; la home presenta, no cataloga. El corte vive en `site.ts` y es explícito: sin él, añadir una categoría alargaría la home sola, sin que nadie lo decidiera | Ninguno; **verificado**: /productos 7 tarjetas, home 4 |
| `/cobertura/<zona>` sobrias, sin listar colonias | Clonar la plantilla por colonia ("Mosquiteros en Coyoacán"…) son **doorway pages** y Google las penaliza explícitamente. Una página de zona se gana su sitio solo si dice algo que las otras no pueden: tiempos, condiciones, trabajos hechos ahí — nada validado hoy | Si el cliente da datos por zona, las páginas crecen con sustancia real |

---

## 5. Estado del contenido

**Lo que sigue es el punto importante de este documento.**

> 🔴 **GATE DE LANZAMIENTO ACTIVO.** `SITE.noindexAll = true` en `src/config/site.ts`: todo el sitio emite `noindex, nofollow`. **No debe indexarse** hasta cerrar los 🔴 y validar los 🟠. Quitar el gate es el último paso de publicación, no el primero. Checklist accionable: [GATE-LANZAMIENTO.md](./GATE-LANZAMIENTO.md).
>
> ⚠️ **CORREGIDO 2026-07-14.** Este párrafo decía que el sitio "se despliega solo en `mosquitero.pages.dev`". **Era falso y nadie lo había comprobado**: `mosquitero.mx` resuelve (Cloudflare) y sirve el sitio. Consecuencia de la corrección: el `noindex` **no** es una precaución teórica sobre un dominio de staging — es lo único que separa a Google de las 29 páginas que hoy muestran `TODO: 55 0000 0000` (203 apariciones) y un `geo: 0,0`. La condición «(3) el dominio real apunta al sitio» **ya está cumplida**; lo que bloquea son (1) los `TODO:` y (2) la validación del cliente.

| Contenido | Estado | Nota |
| --- | --- | --- |
| **Teléfono, WhatsApp, email, dirección, horario** | 🟢 **Dados por Frank** (2026-07-14) | `55 1005 3463` (mismo nº para voz y WhatsApp) · `ventas@mosquitero.mx` · Av. Insurgentes Sur 716, Del Valle, Benito Juárez, 03300 CDMX · Lun–Vie 9–18, Sáb 9–14. **Matiz:** verificados como "lo que dijo Frank" — nadie marcó el número ni fue al domicilio |
| **Naturaleza del negocio: área de servicio (SAB)** | 🟢 **Confirmado por Frank** | "No se atiende, solo es con llamada". En Insurgentes Sur 716 NO hay atención al público. Consecuencias aplicadas: `geo` OMITIDO (no `0,0`), `areaServed` = CDMX + Edomex como el campo que describe al negocio, y la dirección se muestra sin enlace a Maps. **Pendiente fuera del sitio:** si se crea ficha de Google Business, marcarla como SAB y ocultar el domicilio |
| **Cobertura (CDMX, Edomex)** | 🟢 **Confirmado por Frank** | Ya no es "heredado del template": Frank lo confirmó |
| Estructura, componentes, layouts, SEO lib | 🔵 Heredado | Probado en otros sitios del portafolio, no auditado para este |
| Versiones y build | 🟢 Verificado | Medido, no declarado |
| Contrato de encabezados | 🟢 Verificado | Guarda probada; alineación medida a 0.00px / centros ±0.01px |
| **Contrato de movimiento** (sitio sin animaciones) | 🟢 Verificado | Medido sobre el **CSS compilado**, no sobre el fuente: 15 `transition`, las 15 con `--transition-btn` (botones); 0 `@keyframes`; 0 `animation`; 0 `:hover{transform}`; 0 `var()` huérfanos. `astro check` 0/0 |
| ~~Teléfono, WhatsApp, email, dirección, geo, horario~~ | ✅ **CERRADO 2026-07-14** | Ver la fila 🟢 de arriba. De **377 cadenas `TODO:` visibles** en el HTML a **cero** |
| Logo, favicon, OG, fotos de producto | 🔴 Placeholder | `placeholder.svg` + logo heredado del template |
| **Fotos del proceso de 8 pasos** | 🔴 Placeholder | `public/images/proceso/paso-1..8.svg`, mismo patrón que `showcase/*.svg`. Son la **lista de tomas** para la sesión de fotos: contacto por WhatsApp · flexómetro sobre el vano · tipos lado a lado · muestras de malla · cotización por pieza · armado en taller · colocación en el vano · prueba de corredera. **Bloquean publicación.** El `alt` real vive en `proceso[]` de `index.astro`, no en el SVG — al sustituir por la foto (4:3, AVIF/WebP < 200 KB) no hay que reescribirlo |
| Color de marca `--c-primary` | 🔴 Placeholder | Índigo `#5b3df5` del template, no de mosquitero.mx |
| **Tipos de mosquitero** (los 6 + accesorios) | 🟢 **Confirmado por Frank** (2026-07-14) | "Sí" a la pregunta directa de si fabrica los 6 tipos y vende accesorios. **Alcance del 🟢:** confirma que se fabrican — NO valida materiales, tipos de malla en stock, acabados ni factores de precio. Nadie ha preguntado eso |
| **Servicios** (fabricación, instalación, medición, reparación) | 🟢 **Confirmado por Frank** (2026-07-14) | Presta los cuatro. **Sigue sin saberse si cobra la medición a domicilio y cuánto** — por eso ninguna página lo afirma |
| **Copy del hero, blurbs, FAQ** | 🟠 **Sin validar** | Redacción mía sobre conocimiento general. Descripciones de oficio (cómo medir, cuándo cambiar malla), sin plazos, precios ni garantías inventados |
| **Proceso de 8 pasos** | 🟠 **Sin validar — y 3 pasos añadidos por diseño** | El scaffold tenía 5 pasos 🟠. El 2026-07-14, a petición de Frank («filas de 4 cards, complementa a 8»), desglosé a 8: **Tipo de mosquitero** (3), **Malla** (4) y **Revisión y cuidado** (8) son nuevos. No son servicios inventados — la asesoría de tipo/malla ya estaba embutida en Cotización y la revisión en Instalación; lo que hice fue partirlos. **Pero el corte lo pidió la retícula, no el cliente.** Nadie confirmó que su flujo real tenga 8 momentos ni que asesore antes de cotizar. Si el cliente dice que cotiza en el mismo mensaje, vuelve a 5-6 pasos y la retícula lo aguanta. **Validar antes de publicar** |
| **Keywords** (`mosquiteros a medida` / `mosquiteros para ventanas` / `instalación de mosquiteros`) | 🟠 **Sin validar** | Elegidas por criterio, **sin datos de volumen ni intención**. Validar antes de escalar contenido sobre ellas |
| Módulo blog: rutas, componentes, `typography.css`, RSS | 🟢 Verificado | Construido 2026-07-14. Build 29 páginas, 0 errores / 0 warnings. Enlaces internos del blog verificados uno a uno: cero 404. Spec en [CONTRATO-BLOG.md](./CONTRATO-BLOG.md) |
| Categoría de blog `la-marca` | 🟢 Verificado | Decisión de Frank (2026-07-14). Enum ampliado en `content.config.ts` **y** `site.ts` |
| **Los 9 artículos del blog** | 🟠 **Sin validar** | Redacción mía sobre conocimiento general del oficio, igual que el copy de la home. **Nadie del negocio confirmó nada.** Sin precios, plazos, garantías, cifras ni clientes: pasaron auditoría adversarial (ver H7). Cada `.mdx` lleva su nota editorial en el frontmatter |
| **`pubDate` de los 9 artículos** | 🟢 Verificado | Todos `2026-07-14`, la fecha real en que se escribieron. **No se escalonaron para simular historial**: `pubDate` alimenta `datePublished` del JSON-LD y el RSS — es el único dato que el blog le afirma a Google de forma estructurada (ver H8) |
| **Artículos que describen magnéticos, fijos y 4 tipos de malla como línea propia** | 🟠 **Sin validar — hereda el riesgo de la fila de arriba** | `tipos-de-mosquitero-cual-elegir.mdx` vende los 6 tipos con "Va bien si…" y `tipos-de-malla-mosquitero.mdx` describe 4 mallas. Si el cliente no ofrece alguna, **hay que borrarla del artículo, no solo del catálogo** |
| **Artículos que ofrecen medición a domicilio y reparación de herrajes** | 🟠 **Sin validar** | `como-trabajamos…` y `reparar-o-reponer…` los prometen. `TAXONOMY.services` los marca sin confirmar. ¿Repara marcos y herrajes o **solo cambia tela**? |
| **Proceso de 8 pasos — versión blog** | 🟠 **Sin validar (espejo de la home)** | `como-trabajamos-de-la-medida-a-la-instalacion.mdx` replica los 8 pasos de `proceso[]`. **Contrato: mismo número, mismos títulos, mismo orden.** Si el cliente corrige el flujo, se corrigen los DOS (ver H9) |
| Páginas de tag (`/blog/tag/*`) | 🟢 Verificado | `noindex` deliberado + excluidas del sitemap. Razonamiento completo en [CONTRATO-BLOG.md](./CONTRATO-BLOG.md) |

**Regla:** nada 🟠 debe tratarse como verdad del negocio. Es andamiaje para que la página se pueda ver y discutir. La conversación con el cliente lo confirma o lo tira.

---

## 6. Hallazgos abiertos

Bugs detectados al medir, **no introducidos por este scaffold**:

| # | Hallazgo | Evidencia | Estado |
| --- | --- | --- | --- |
| H1 | **Las fuentes nunca se cargan.** `tokens.css` declara Outfit e Inter; no hay `@font-face` ni link en todo el proyecto. El sitio renderiza en `system-ui` | `document.fonts` vacío; Outfit mide idéntico a system-ui (759.3px en la misma cadena de prueba) | 🔴 Abierto — heredado del template. Cargarlas cambia el look del sitio entero: **decisión de Frank** (self-host vs Google Fonts) |
| H2 | **Overflow horizontal de 118px a 390px.** El mega-menú del Header (`.mega-col`) se maqueta aunque esté oculto y empuja el `scrollWidth` a 508px | Medido en iframe a 390px. `hereda_sech: false` — no es del encabezado | 🔴 Abierto — heredado del template |
| H3 | Las tarjetas mostraban "EJEMPLOS · DEMO" | Apunté `SHOWCASE` al OG del template | ✅ **Cerrado** — bug mío; sustituido por `placeholder.svg` neutral |
| H4 | **Los enlaces del blog que el `ArticleLayout` ya emitía eran 404.** El layout enlazaba `/blog/categoria/*` y `/blog/tag/*` desde antes de que esas rutas existieran: cada artículo publicado exportaba enlaces rotos al rastreador | Verificado en `dist/` tras el build | ✅ **Cerrado** 2026-07-14 — rutas construidas |
| H5 | **Páginas `noindex` listadas en el sitemap.** Las de tag iban al `sitemap-0.xml` siendo `noindex`. El sitemap dice "indexa esto" y la página dice "no": Google obedece al noindex **y anota el sitemap como poco fiable**, degradando la confianza en el resto de URLs | `dist/sitemap-0.xml` traía las 11 URLs de tag | ✅ **Cerrado** 2026-07-14 — `filter` en `astro.config.mjs`. Las **categorías sí van** (enum cerrado, indexables): la diferencia es deliberada |
| H6 | **Los 3 listados del blog tenían cero `<h1>`.** `SectionHeading` default `as="h2"` — correcto con `<Hero>` (pone el H1), pero los listados no tienen Hero: el outline arrancaba en nivel 2 | `grep '<h1'` = 0 en `blog/index.html`, `categoria/*`, `tag/*` | ✅ **Cerrado** 2026-07-14 — contrato de `SectionHeading` ampliado a `'h1'\|'h2'\|'h3'` |
| H7 | **Contenido fabricado en los artículos.** Auditoría adversarial encontró: claims de volumen sin historial ("la reparación más común que hacemos"), contradicción entre dos artículos ("la pregunta que más nos llega" en ambos), estadística de mercado sin fuente, garantías comerciales ("no hay cargos que aparezcan después"), precisión falsa ("un centímetro de más en 1.20 m") y **un error técnico real**: recomendaba silicón en aerosol como "lubricante en seco" — no lo es, los secos son PTFE/grafito | Auditoría con subagente sobre los 9 `.mdx`; barrido posterior sobre el HTML de `dist/` | ✅ **Cerrado** 2026-07-14 — 37 correcciones |
| H8 | **`pubDate` fabricados.** Los 9 artículos se escribieron el 2026-07-14 pero llevaban fechas de marzo a julio: cuatro meses de historial editorial inventado, servido a Google como `datePublished` y en el RSS | `stat` de los `.mdx` vs su frontmatter | ✅ **Cerrado** 2026-07-14 — todos a la fecha real |
| H9 | **Deriva home ↔ blog en el proceso.** La home se desglosó de 5 a 8 pasos; `como-trabajamos….mdx` se quedó en 5 **declarando ser espejo de `index.astro`**. Un cliente leía un flujo en la home y otro en el blog | `proceso[]` de `index.astro` = 8 pasos vs 5 `##` en el artículo | ✅ **Cerrado** 2026-07-14 — artículo alineado a 8. **El contrato de espejo ahora está escrito en el frontmatter del `.mdx`** |
| H10 | **`featured` declarado en el schema y leído por nadie.** Un campo que el frontmatter pide y el sitio ignora: el editor lo marca, no pasa nada y no hay error que se lo diga. Además, sin desempate por título el destacado de `/blog` **cambiaba entre builds** con fechas iguales | Revisión del orden tras igualar los `pubDate` | ✅ **Cerrado** 2026-07-14 — las 3 rutas ordenan `pubDate → featured → título` |
| H11 | **El dev server no ve artículos nuevos en una colección que arrancó vacía.** El glob loader cachea "no hay archivos" y no vuelve a escanear; `.astro/data-store.json` se congela. `/blog` muestra el estado vacío aunque el build genere las 9 páginas | `data-store.json` de las 11:44 vs `.mdx` de las 13:30 | ⚠️ **Comportamiento de Astro, no bug del sitio.** Workaround: `rm -rf .astro && npm run dev` desde la raíz del repo. Documentado en CONTRATO-BLOG.md |
| H12 | **El texto sonaba a plantilla, y era medible.** Frank lo detectó leyendo; al medir salieron dos tics reales: **«te lo decimos» 52 veces** (era el cierre de casi todas las FAQ) y **34 "rayas solas"** — la coletilla enganchada al final de la frase (`…la pieza está mal — y en un producto a medida…`). La franqueza que prometía el texto estaba bien; el problema es que la MISMA promesa llegaba con las MISMAS palabras 52 veces, y a la tercera deja de leerse como honestidad y se lee como plantilla | `scripts/check-voz.mjs` sobre la prosa de `site.ts` | ✅ **Cerrado** 2026-07-15 — 77 textos reescritos. «te lo decimos» fuera del top de muletillas; rayas 60 → 26 (solo quedan las de inciso, que son correctas) |
| H13 | **Mi propio medidor contaba código como prosa y reporté números falsos.** La v1 de `check-voz.mjs` usaba `/'([^'\\]\|\\.){60,}'/`: el regex no distingue la comilla que ABRE de la que CIERRA, así que emparejaba desde el cierre de un string hasta la apertura del siguiente y se tragaba el TypeScript de en medio. Le dije a Frank **"885 dos puntos, uno cada 19 palabras"** como si fuera el tic dominante. **Era mentira**: el top de "palabras antes de `:`" eran `answer:`, `question:`, `label:` — nombres de campo. Real: 120, uno cada 64, dentro de lo tolerable. Casi mando a reescribir lo que no estaba roto | El propio script delató el bug al desglosar qué palabra precedía a cada `:` | ✅ **Cerrado** 2026-07-15 — `\n` excluido de la clase negada + guarda de autotest que mata el script si vuelve a entrar código. **Probada reinyectando el bug: exit=1 con él, exit=0 sin él** |

H1 y H2 afectan **a todos los sitios del portafolio** que salgan de este template, no solo a mosquitero.mx.

**H13 es la lección que más caro sale:** un medidor roto es peor que no medir, porque manda a reescribir lo que está bien y da falsa confianza sobre lo que está mal. Es el mismo fallo que el verificador de enlaces que hacía `rstrip('/')` y enmascaró 1.358 enlaces rotos. **Regla que sale de aquí: toda herramienta de medida se prueba inyectándole el fallo que debe detectar.** Si no se puede hacer fallar a propósito, no es una prueba.

H5, H6, H10 y H11 son **genéricos del módulo blog**: cualquier sitio del portafolio que monte un blog con este patrón los va a repetir. Están en [CONTRATO-BLOG.md](./CONTRATO-BLOG.md) para que no haya que redescubrirlos.

---

## 7. Cómo mantener este documento

- Al cambiar una decisión, edita la fila — no agregues una nota al final.
- Al validar un 🟠 con el cliente, súbelo a 🟢 y di quién lo confirmó y cuándo.
- Al cerrar un `TODO:`, quita la fila 🔴 correspondiente.
- **Al crear una página nueva**, no repitas criterio: sigue [CONTRATO-ENCABEZADOS.md](./CONTRATO-ENCABEZADOS.md) y registra aquí lo que sea específico de esa página.
