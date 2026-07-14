# Contrato de encabezados — especificación normativa

**Ámbito:** todas las páginas de mosquitero.mx, presentes y futuras.
**Estado:** vigente desde 2026-07-14. Implementado y obligado en `src/components/SectionHeading.astro`.
**Procedencia:** ver [PROCEDENCIA.md](./PROCEDENCIA.md). El layout `duo` viene de PROYECTORED (`SectionHeaderDuo.astro`) vía ORIGENLAB-TEMPLATE; volverlo obligatorio y el resto del diseño son decisiones de esta sesión.

> Este documento es **normativo**: describe cómo DEBE verse un encabezado, no cómo podría verse. El componente rompe el build si no se cumple, así que la especificación y el código no pueden divergir en silencio.

---

## 1. La regla

**Todo encabezado de sección va en dos columnas: a la izquierda el título, a la derecha exactamente dos párrafos.**

```
──────────────────────────────────────────────────────────  ← regla (hairline)
┌────────────────────────┬─┬─────────────────────────────┐
│ COLUMNA 1  ·  5fr      │ │ COLUMNA 2  ·  7fr           │
│                        │ │  párrafo 1 — qué resuelve   │
│  ▬▬ EYEBROW            │ │                             │
│  H2 display  ←centrado→│ │  párrafo 2 — beneficio      │
│  (title + accent)      │ │                             │
└────────────────────────┴─┴─────────────────────────────┘
                          ↑ filete vertical
```

```astro
<SectionHeading
  eyebrow="Catálogo"
  title="Tipos de mosquitero"
  body={[
    "Párrafo 1 — qué es / qué resuelve la sección.",
    "Párrafo 2 — beneficio concreto o siguiente paso.",
  ]}
/>
```

Es el mismo patrón del `<Hero>` (`descRight[]`, dos párrafos) extendido a todas las secciones: cada bloque abre igual — a la izquierda **qué es**, a la derecha **por qué te importa**.

---

## 2. Anatomía y por qué

| Pieza | Decisión | Por qué |
| --- | --- | --- |
| **Regla superior** | Hairline que cruza el bloque completo | Ancla ambas columnas al mismo borde. Da el ritmo editorial: toda sección del sitio abre igual. |
| **Eyebrow** | **Dentro** de la columna 1, pegado al título (12px) | Etiqueta al **título**, no al bloque. Si se saca a una fila propia que cruce las columnas, queda clavado arriba mientras el título se centra → hueco muerto. **Ya pasó una vez.** |
| **Retícula** | Asimétrica **5fr / 7fr** | El H2 es display: pesa por tamaño, no por ancho, y respira en la columna corta. Los párrafos necesitan medida de lectura (máx. 62ch) → columna larga. |
| **Alineación vertical** | `align-items: center` | La fila mide lo que mida la columna más alta (casi siempre la de texto). El título se centra contra ella: el peso del display queda a media altura del párrafo. |
| **Filete vertical** | 1px entre columnas | Refuerza que son DOS columnas, no un párrafo suelto. |
| **Título** | `text-wrap: balance`, tracking −0.03em, `line-height` 1.05, weight 800 | Display grande pide leading corto y tracking negativo. `balance` evita la viuda suelta. |
| **Párrafos** | p1 más oscuro y ×1.06; p2 tenue | Jerarquía interna: p1 carga el mensaje, p2 acompaña. |
| **Móvil (≤768px)** | Apila, vuelve a `start`, sin filete | Con una columna no hay nada que alinear ni que separar. |

---

## 3. Por qué exactamente dos párrafos

- **Uno** deja la columna derecha corta y descuadra la retícula.
- **Tres o más** convierten el encabezado en cuerpo de texto y le roban peso al H2.
- **Dos** permiten la estructura de venta canónica:
  - **párrafo 1 → qué es / qué resuelve.** Aquí entra la keyword de la sección, natural.
  - **párrafo 2 → cómo se traduce en beneficio o siguiente paso.**

### Cómo escribirlos

- Habla de la persona, no de la empresa. **Hechos, no adjetivos.**
- ~180–320 caracteres por párrafo (2–4 líneas en escritorio).
- La keyword de la sección entra **una vez**, natural. No la apiles.
- **Cero promesas sin dato verificado** — nada de plazos, cifras ni garantías que el negocio no pueda sostener (regla dura OrigenLab).
- Léelo en voz alta. Si suena a folleto, reescríbelo.

---

## 4. El contrato se obliga solo

`SectionHeading.astro` **rompe el build** en tres casos:

| Violación | Mensaje |
| --- | --- |
| `body` sin exactamente 2 párrafos | `layout 'duo' exige EXACTAMENTE 2 párrafos en body, llegaron N` |
| `desc` mezclado con `duo` | `en layout 'duo' no se usa desc → muévelo a body` |
| `body` pasado a `simple` | `layout 'simple' no usa body` |

El error nombra la sección y dice qué hacer. Mismo criterio que Zod `.strict()` en las Content Collections: **el error se ve en build, no en producción**.

Verificado el 2026-07-14 con una página de prueba: el build falla con el mensaje esperado.

### La excepción

`layout="simple"` (1 columna con `desc`) existe para bloques angostos o CTA. **Es la excepción, no el default.**

> Si te descubres usando `simple` por no querer escribir el segundo párrafo: escribe el segundo párrafo.

---

## 5. Un solo H2 por sección

Los componentes que traen encabezado propio (p. ej. `FAQAccordion`) se neutralizan con `title=""` y el H2 lo pone `SectionHeading`:

```astro
<SectionHeading id="faq-heading" eyebrow="Dudas" title="Preguntas frecuentes" body={[ /* … */ ]} />
<FAQAccordion items={faqs} title="" />   {/* el aria-labelledby apunta a #faq-heading */}
```

⚠️ **`title={undefined}` NO funciona**: dispara el valor por defecto del componente y duplica el H2. Tiene que ser `""`.

---

## 6. Decisiones descartadas (no volver a intentarlas)

Registro de lo que ya se probó y por qué se cayó. Antes de "mejorar" la alineación, lee esto.

| Alternativa | Por qué se descartó |
| --- | --- |
| `align-items: start` | Alinea las **cajas**, no el texto. La primera línea del párrafo flota muy por encima de la del título → el bloque se lee torcido. |
| `align-items: baseline` | Tipográficamente fino (alinea primera línea del H2 con la del párrafo 1, medido a 0.00px), pero deja el título colgado del techo con el hueco muerto debajo cuando el texto es más alto. Descartado a favor de `center`. |
| **`padding-top` calculado con métricas** | **Vetado.** Necesita la ratio de ascendente de la fuente real, que cambia con cada familia y cada `font-size`: número mágico que se rompe en silencio. Se intentó con 0.75 → 3.41px de error; la ratio real medida era **0.88**. Además el `calc()` usaba `--sech-body-size` mientras el p1 renderiza a ×1.06: calculaba con una fuente y alineaba otra. |
| Eyebrow con `grid-column: 1 / -1` | Queda clavado bajo la regla mientras el título se centra → hueco muerto entre eyebrow y título. **Este bug ya se corrigió una vez.** |

### El veto al cálculo por métricas, en detalle

Al medir salió que **el sitio no carga sus fuentes**: `tokens.css` declara Outfit e Inter, pero no hay `@font-face` ni link en ningún lado, así que todo renderiza en `system-ui` (ver hallazgo H1 en PROCEDENCIA.md).

Eso significa que **cualquier constante tipográfica calibrada hoy queda calibrada contra la fuente equivocada** y se romperá el día que se carguen las fuentes reales.

`center` no depende de métricas de fuente. Sobrevive a cambios de tipografía, tamaño e interlineado sin tocar nada. **Esa es la razón de fondo por la que es la solución, y no una preferencia estética.**

---

## 7. Checklist para páginas nuevas

Antes de dar por terminada cualquier página:

- [ ] Cada sección abre con `<SectionHeading>` — ninguna con un `<h2>` suelto.
- [ ] Cada `SectionHeading` lleva `body` con **2 párrafos** (p1 = qué resuelve, p2 = beneficio).
- [ ] Ningún `layout="simple"` puesto por pereza de escribir el p2.
- [ ] Un solo `<h1>` en la página; un solo `<h2>` por sección.
- [ ] Componentes con encabezado propio neutralizados con `title=""` (no `undefined`).
- [ ] Copy sin plazos, precios ni garantías sin dato verificado del cliente.
- [ ] `astro check` **0 errores** + `astro build` **verde**. Sin verde no está hecho.
- [ ] Verificado a **390px**: apila, sin overflow horizontal atribuible a la página.

---

## 8. Escala tipográfica

Gobierna todo el bloque. Sobreescribible por instancia desde la página si una sección lo necesita.

```css
--sech-title-size:  clamp(2rem, 1.15rem + 2.9vw, 3.25rem);
--sech-title-lh:    1.05;
--sech-body-size:   1.0625rem;
--sech-body-lh:     1.7;
--sech-lead-scale:  1.06;   /* el párrafo 1 pesa un poco más */
```

---

## 9. Verificación registrada (2026-07-14)

| Prueba | Resultado |
| --- | --- |
| Guarda del contrato (página con 1 párrafo) | Build **falla** con el mensaje esperado ✅ |
| Centros de columna 1 vs columna 2, 4 secciones | **±0.01px** ✅ |
| Caso con título a 2 líneas ("Cómo pedir tu mosquitero", 109px vs 166px) | **0.00px** ✅ |
| Separación eyebrow → título | **12px**, en las 4 secciones ✅ |
| Eyebrow dentro de la columna 1 | `true` en las 4 ✅ |
| Móvil 390px | 1 columna, `align-items: start`, filete 0px ✅ |
| Overflow horizontal atribuible al encabezado | `hereda_sech: false` ✅ (el overflow es del Header — H2 en PROCEDENCIA.md) |
| `astro check` / `astro build` | 0 errores / 0 warnings · verde ✅ |
| H1 en la home | 1 ✅ |
| `FAQPage` JSON-LD | 1 (sin duplicar) ✅ |
