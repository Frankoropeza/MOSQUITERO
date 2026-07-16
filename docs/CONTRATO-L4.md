# Contrato L4 — la ficha de detalle

**Referencia canónica:** `src/pages/mosquiteros/[categoria].astro` → `/mosquiteros/enrollables`
**Registrada como plantilla:** 2026-07-14, por decisión de Frank.

Una L4 es la página más profunda del sitio: alguien que **ya eligió** y viene a
leer. No es un índice. Este documento fija qué la hace válida, para que las L4 que
faltan salgan iguales sin tener que redescubrir por qué cada cosa está donde está.

**Estado de las L4 del sitio:**

| Ruta | Plantilla | Estado |
| --- | --- | --- |
| `/mosquiteros/<tipo>` × 7 | `mosquiteros/[categoria].astro` | ✅ **Canónica** |
| `/servicios/<id>` × 4 | `servicios/[servicio].astro` | ✅ Homologada (2026-07-14) |
| `/cobertura/<zona>` × 2 | `cobertura/[zona].astro` | 🔴 Patrón viejo — pendiente |

**Estado de las FAQ del sitio:** 141 preguntas en 24 páginas, **cero repetidas**.
Verificado tras cada tanda con el script de §8.

---

## 1. Estructura

El orden no es negociable: cada bloque existe porque el anterior dejó una pregunta
abierta.

```
1) Hero                    → H1 único. SIN ctas.
2) SectionMenu             → la franja de botones, como el index
3) <section> 2 columnas
     article               → galería · cómo funciona · encaja/no conviene ·
                             datos · cómo se pide
     aside                 → índice · CTA · guías · servicios · cobertura
4) Otros <hermanos>        → ancho completo, tarjetas con icono y desc
5) FAQ + QuoteForm         → módulo de 2 columnas (el del index)
6) SectionMenu             → cierre
```

### Por qué sidebar y no el ritmo de las L2 — esto **es** homologar

Las L2 son secciones anchas (Hero → menú → vitrina → tabla → a fondo → FAQ). Una
L4 es una página de **lectura**, y para eso el patrón correcto es contenido +
sidebar — que es el que el sitio **ya usa en los artículos del blog**
(`ArticleLayout` + `BlogSidebar`). La L4 no rompe la homologación: sigue el patrón
de las páginas de lectura en vez del de las de índice.

### ⚠️ NO uses `ProductLayout`

Existe, tiene sidebar y parece hecho para esto. No se usa por dos motivos:

1. Su `<CTABanner>` final promete *"precio, disponibilidad y **tiempos de
   entrega**"* — y los tiempos de entrega son uno de los tres datos que **nadie ha
   validado** (ver §4). Copiarlo mete en 7 páginas una promesa que el cliente paga.
2. Trae bloques de *"Certificaciones y normas"* que no aplican a este negocio.

Si algún día se usa, hay que arreglarle ese CTA primero.

---

## 2. Contrato de datos

Todo sale de `src/config/site.ts`. **Cero literales de negocio en la página.**

```ts
FichaTipo = {
  comoFunciona: string[]   // el mecanismo. Lo que la gente no sabe y por lo que busca.
  encajaEn:     string[]   // en qué ventana va. La pregunta de compra real.
  noConviene:   string[]   // cuándo NO. ← el campo que justifica la página
  datos:        {label,value}[]  // hechos del OFICIO, no specs del cliente
  faqs:         {question,answer}[]  // mínimo 8, únicas en todo el sitio
  guias:        string[]   // slugs de artículos — contextual, distinto por ficha
  servicios:    string[]   // ids de SERVICES — contextual
}
```

Más la galería y los 2 párrafos de cabecera, que salen de `AFONDO[slug]`.

### `noConviene` es obligatorio, y es el punto

Sin él la L4 sería la L2 recortada: **contenido duplicado compitiendo con su propio
padre** por la misma búsqueda. Y hay una razón de negocio encima de la de SEO: en un
producto **a medida no hay devolución**. Decirle a alguien "esto no es para ti"
antes de fabricar vale más que venderle la pieza equivocada.

Ejemplos de la ficha canónica:

- *"Si no hay espacio libre arriba del vano para el cajón"*
- *"Si buscas la opción más económica: el mecanismo cuesta más que un bastidor fijo"*
- Fijos: *"Si esa ventana es tu salida de emergencia, no pongas fijo"*
- Abatibles: *"No es una puerta de seguridad y no la vendemos como tal"*

### `datos` NO es una tabla de specs

Son hechos del oficio: por dónde abre, dónde se monta, qué exige del vano. **No metas
medidas máximas, materiales concretos ni precios** — nadie los ha validado. La ficha
lo dice de frente en vez de dejar al lector buscándolos:

> *"¿Echas en falta medidas y materiales? Es a propósito: cada pieza se fabrica a las
> dimensiones de tu vano, así que el único dato que importa es el tuyo."*

---

## 3. Enlazado: contextual, no boilerplate

**Más enlaces en el sidebar NO mejora el SEO.** Google descuenta el *boilerplate* —
los enlaces idénticos repetidos en todas las páginas son navegación, no
recomendación— y el footer ya los tiene todos.

Lo que pesa es el enlace **contextual**: el que cambia según la página. Por eso
`guias` y `servicios` son por ficha.

**Regla dura:** si acabas poniendo los mismos slugs en todas las fichas, has vuelto a
fabricar boilerplate. Elige por relevancia real.

**Verificación:** las 7 fichas de `/mosquiteros` dan **7/7 combinaciones distintas**.
Accesorios enlaza solo `reparacion` —quien compra una refacción no necesita medición
ni instalación—; enrollables enlaza `medicion` porque el cajón hay que medirlo.

Los **títulos de las guías salen de la colección**, nunca copiados: si alguien
reescribe un artículo, el enlace lo refleja solo.

---

## 4. Reglas duras del contenido

🟢 Frank confirmó (2026-07-14) que se fabrican los 6 tipos + accesorios y se prestan
los 4 servicios. 🟠 **Todo lo demás es oficio general, no specs del cliente.**

**NUNCA escribas, en ninguna L4:**

| Prohibido | Por qué |
| --- | --- |
| Precios | Se cotiza por pieza. No hay lista validada |
| Plazos de entrega | Nadie ha preguntado cuánto tarda |
| Garantías | Nadie ha preguntado si hay y de qué |
| *"gratis"*, *"sin costo"* | No se sabe si la medición se cobra |
| Materiales, medidas máximas | No validados |

> Ya pasó una vez: escribí *"es gratis preguntar"* en accesorios. En contexto hablaba
> del mensaje, no del servicio — pero si alguien lo lee rápido entiende que el
> diagnóstico no se cobra. Fuera. Cuando dudes, quita el gancho.

Ver `docs/GATE-LANZAMIENTO.md` §3 para lo que falta preguntarle al cliente.

---

## 5. Las 5 guardas de build

Todas en `getStaticPaths`. **Rompen el build, no la página** — mismo criterio que la
guarda de `SectionHeading`: un error se ve en build, no en producción.

| # | Comprueba | Mensaje |
| --- | --- | --- |
| 1 | Cada tipo tiene `AFONDO` y `FICHAS` | Dice cuál falta por slug |
| 2 | `faqs.length >= 8` | Dice qué ficha y cuántas tiene |
| 3 | Ninguna FAQ repetida **entre fichas** | Dice la pregunta y los dos tipos |
| 4 | `guias` → artículos que generan ruta | Dice la ficha y lista los publicados |
| 5 | `servicios` → ids de `TAXONOMY.services` | Dice la ficha y lista los válidos |

La #3 normaliza tildes y mayúsculas: la misma pregunta con otra tilde sigue siendo la
misma para Google. La #4 usa el filtro `draft !== true` — que el `.mdx` exista no
basta, un draft no genera ruta.

> **Límite conocido de la #3:** solo cruza entre `FICHAS`. Las FAQ de la home, las L2
> y los artículos **no** se cruzan ahí — eso sigue siendo revisión manual al escribir
> preguntas nuevas.

Las 5 están **probadas**: se inyectó cada fallo a propósito y todas reportaron lo
esperado.

---

## 6. Decisiones de layout que ya se pagaron

No las redescubras: estas tres se probaron y se corrigieron.

### El sidebar NO lleva scroll interno. Nunca.

Empezó con 5 widgets + sticky. No cabían → le puse `max-height:100vh` +
`overflow-y:auto`: **un scroll dentro del scroll de la página**. Eso no arregla que
sobre contenido — lo esconde, y obliga al usuario a descubrir que ese bloque scrollea
aparte. Frank lo detectó.

La causa eran **dos widgets que duplicaban**: uno repetía la tabla del cuerpo 300px
más abajo; otro, las zonas que el footer ya lista en las 46 páginas.

**Si el sidebar no cabe: quita un widget o suelta el sticky. No le pongas overflow.**

### Sticky vs. número de widgets — es un intercambio

| Widgets | Sticky | Qué pasa |
| --- | --- | --- |
| 2 (índice + CTA ≈ 460px) | ✅ Sí | CTA siempre visible |
| 5 (el actual) | ❌ No | Columna que fluye. **Se pierde el CTA fijo** |

Hoy está en 5 sin sticky (decisión de Frank: más widgets y enlaces). La pérdida del
CTA fijo se compensa con el CTA del hero, el WhatsAppFloat y el formulario del módulo
FAQ.

### FAQ y formulario van JUNTOS

> *Resolver la duda y no tener dónde actuar es perder el lead; poner el formulario
> antes de resolverla es pedirle datos a alguien que todavía no sabe qué pedir.*

Antes la FAQ vivía dentro de la columna de contenido y el formulario iba suelto 400px
más abajo. Usa el módulo del index: `<FAQAccordion flush>` con `<QuoteForm
slot="aside">`.

---

## 6·bis. Dónde vive el CSS — y por qué NO en la página

**Todo el CSS de la plantilla está en `src/styles/ficha.css`. Una sola definición.**

Antes estaba copiado en el `<style>` de las dos L4: **200 líneas idénticas**, el 78%
del CSS de servicios era copia literal del de mosquiteros. En los dos archivos había
escrito *"si cambias una, cambia la otra"*. Eso no es un contrato: es una promesa que
nadie cumple. La primera vez que alguien ajuste un padding, las dos L4 dejan de verse
igual y este documento pasa a mentir.

| Archivo | Qué contiene | Lo importa |
| --- | --- | --- |
| `src/styles/layout.css` | `.container`, `.section*` | `BaseLayout` (todo el sitio) |
| `src/styles/ficha.css` | Todo lo de la plantilla L4 | Las 2 L4, por ruta relativa |

**Reglas:**

- Los nombres de `ficha.css` están **reservados**: `.bloque`, `.galeria`, `.duo`,
  `.datos`, `.pasos`, `.widget`, `.toc`, `.enlace`, `.sidebar`, `.ficha`, `.otros-l4`.
- **NUNCA redeclares** una de esas clases en el `<style>` de una página: el scoped gana
  por especificidad y vuelves a tener dos verdades. Si necesitas variar algo, usa un
  **modificador propio** (`.bloque--compacto`).
- **NO redeclares `.container` ni `.section`.** Estaban en 9 archivos. Ahora en uno.
- CSS por **ruta relativa**, no alias: es la convención del repo (`BaseLayout`,
  `ArticleLayout`), y `astro.config.mjs` avisa de que un alias a medias revienta el
  build.

**Lo único legítimamente propio de cada página** es la retícula de "otros", porque el
número de hermanos cambia: `/mosquiteros` tiene 6 (1→2→3 columnas), `/servicios` tiene
3 (1→3; a 2 quedaría una huérfana). Cada una declara solo su
`grid-template-columns`.

> **Al refactorizar, verifica la paridad del CSS compilado, no el código fuente.**
> Se hizo así: snapshot de los selectores efectivos de `dist/_astro/*.css` (quitando
> los `[data-astro-cid]`) antes y después. Resultado: 518 selectores comunes, 0
> cambios de propiedades reales — la única baja fue un `border-color` de
> `.widget--cta` que repetía el valor que `.widget` ya ponía.

---

## 7. Reglas de código

- **`as="h1"` NO** si hay `<Hero>`: el Hero ya pone el H1. Dos H1 rompen el outline y
  la regla del checklist SEO. Un H1 por página, siempre.
- **Hero sin `ctas`**: regla canónica «el hero presenta, la franja convierte». El CTA
  va en el `SectionMenu` de abajo.
- **`<FAQAccordion>` SIN `emitSchema`**: el `FAQPage` lo emite `lib/seo.ts` vía
  `schemaData`. Con los dos habría doble FAQPage (anti-patrón B3).
- **`Product` SIN `price`** → sin `offers`. Con el precio omitido, `productSchema()`
  emitía `price: "0"` — le decía a Google que cuesta **$0**. Bug corregido en
  `lib/seo.ts` el 2026-07-14; **afecta a todo sitio del portafolio que copie el
  template**.
- **Sin animaciones**: solo botones. Ver el CONTRATO DE MOVIMIENTO en `tokens.css`.
  El scroll-spy del índice **no** lo viola: conmuta una clase, sin transición.
- **Rutas sin barra final**: `trailingSlash: 'never'`. Usa `productoHref()`,
  `servicioHref()`, `zonaHref()` y `ROUTES` — nunca escribas la ruta a mano.
- **Los comentarios `{/* */}` van FUERA de la lista de atributos** de un componente.
  Dentro rompen el parser de Astro.

---

## 8. Checklist antes de dar una L4 por buena

```
[ ] npx astro check           → 0 errors, 0 warnings
[ ] npx astro build           → verde
[ ] npm run check:links       → 0 rotas
[ ] 1 H1 por página            (Hero, no SectionHeading)
[ ] 1 FAQPage por página
[ ] >= 8 FAQ, únicas en TODO el sitio (incluidos blog y L2 — a mano)
[ ] guias/servicios distintos entre fichas hermanas
[ ] anclas del índice → todos los id existen
[ ] cero: precio, plazo, garantía, "gratis"
[ ] sidebar sin overflow-y ni max-height
```

Comprobación rápida de FAQ duplicadas en todo el sitio (sobre `dist/`):

```bash
npx astro build && python3 - <<'EOF'
import re, json, glob, collections
def faqs(p):
    h = open(p, encoding='utf-8').read()
    for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        d = json.loads(m)
        for n in ([d] if isinstance(d, dict) else d):
            if n.get('@type') == 'FAQPage':
                return [q['name'] for q in n['mainEntity']]
    return []
allq = [q for f in glob.glob('dist/**/*.html', recursive=True) for q in faqs(f)]
norm = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower()).strip()
dups = [q for q, n in collections.Counter(norm(x) for x in allq).items() if n > 1]
print(f"{len(allq)} preguntas · {'OK' if not dups else 'REPETIDAS: ' + str(dups)}")
EOF
```

---

## 9. Cómo aplicar esto a `/servicios` y `/cobertura`

Las dos están en el patrón viejo: `SectionHeading as="h1"`, sin franja, sin sidebar,
FAQ y formulario separados.

Para homologarlas:

1. **Los datos primero.** `SERVICIOS_AFONDO` y `ZONAS_AFONDO` ya tienen `blurb`,
   `body`, `points` y `gallery`. Les falta el equivalente a `FICHAS`: `comoFunciona`,
   `encajaEn`/`noConviene` (en servicios ya existe `limite`, que es el mismo espíritu),
   `datos`, `faqs` (**mínimo 8**) y el enlazado contextual `guias`.
2. **Copia la estructura** de `mosquiteros/[categoria].astro`, no de `ProductLayout`.
3. **Porta las 5 guardas.** Sin ellas el contrato es una sugerencia.
4. **Texto propio.** Las FAQ nuevas no pueden repetir ninguna de las 109 que ya hay.
   `/servicios` responde *"¿cómo trabajan?"*; `/cobertura`, *"¿llegan a mi casa?"*.
5. **`/cobertura` tiene una regla extra:** nada de listar colonias. Clonar la ficha por
   colonia son **doorway pages** y Google puede tumbar el dominio entero. Ver la
   cabecera de `cobertura/[zona].astro`.
