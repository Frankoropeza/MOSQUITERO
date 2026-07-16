# Gate de lanzamiento — qué falta para quitar el `noindex`

**Sitio:** mosquitero.mx · **Estado medido:** 2026-07-14 · **Gate:** 🔴 ACTIVO

Este documento existe porque "quitar el noindex" suena a cambiar una línea, y lo es
— pero la línea es lo último, no lo primero. Aquí está lo que falta antes, medido
sobre el sitio real, no sobre el código.

---

## 1. Estado real (medido, no declarado)

| Hecho | Estado |
| --- | --- |
| `mosquitero.mx` resuelve y **sirve este sitio** | 🟢 Sí (Cloudflare). **La condición "el dominio apunta" YA está cumplida** |
| El sitio es **públicamente accesible ahora mismo** | 🟢 Sí. Cualquiera que entre lo ve |
| Google lo indexa | 🔴 No — `noindexAll: true` lo impide. **Es lo único que lo impide** |
| El sitio vivo == el código de este repo | 🔴 No. Lo desplegado va por detrás (proceso de 5 pasos, CTABanner presente) |

> ⚠️ **Corrección importante.** Una versión anterior de `PROCEDENCIA.md` decía que el
> sitio "se despliega solo en mosquitero.pages.dev". Es **falso**: el dominio real
> está vivo y sirviendo. Eso significa que el `noindex` no es una precaución
> teórica — es lo único que separa a Google del contenido placeholder.

---

## 2. ✅ Datos de contacto — CERRADO el 2026-07-14

Frank dio los datos reales. De **377 cadenas `TODO:` visibles** en el HTML a **cero**.

| Antes | Ahora |
| --- | --- |
| `TODO: 55 0000 0000` (203×) | `55 1005 3463` |
| `TODO: hola@mosquitero.mx` (116×) | `ventas@mosquitero.mx` |
| `TODO: calle…` (116×) | Av. Insurgentes Sur 716, Del Valle, Benito Juárez, 03300 CDMX |
| `wa.me/520000000000` (8/página) | `wa.me/525510053463` |
| `geo: 0,0` (Null Island) | **omitido** — ver abajo |

**El negocio es de área de servicio (SAB).** Frank lo confirmó: en Insurgentes Sur 716
no se atiende al público, el contacto es por teléfono/WhatsApp y el trabajo ocurre en
casa del cliente. Por eso:

- `geo` va **omitido**, no en `0,0`. Publicar coordenadas de una oficina donde no
  atiendes le diría a Google "ven aquí".
- `areaServed` (CDMX + Edomex) es el campo que de verdad describe al negocio.
- La dirección se muestra en el footer **sin enlace a Maps**, a propósito.

> 🔴 **PENDIENTE, y el sitio no lo puede resolver.** Si se crea un perfil de Google
> Business, hay que marcarlo como **negocio de área de servicio** y **ocultar la
> dirección**. Google suprime las fichas de SABs que publican domicilio donde no
> atienden, e Insurgentes Sur 716 es una torre de oficinas: si otros negocios se dan
> de alta ahí, Google puede conflictuar las entidades. Esto pasa al dar de alta la
> ficha, no en el código.

### 🔴 Bug del template: el `Product` declaraba precio **$0**

`productSchema()` de `lib/seo.ts` (🔵 heredado) hacía esto cuando NO se le pasaba
precio — justo lo que hay que hacer cuando el negocio cotiza por pieza:

```js
offer.price = '0';
offer.priceSpecification = { price: '0', description: 'Precio bajo cotización…' };
```

Le declaraba a Google que **cada mosquitero cuesta $0 MXN** y está `InStock`. La
`description` era una hoja de parra: Google parsea `price: "0"`, no la frase.
Posible resultado: "$0.00" en el resultado enriquecido, o rechazo del rich result
por precio inválido. Y era falso — tampoco hay "stock" en algo hecho a la medida.

**Corregido:** sin precio no se emite `offers`. Un `Product` sin `Offer` es válido
en schema.org; simplemente no opta al rich result de precio — que es exactamente lo
que debe pasar cuando no hay precio.

> ⚠️ **Este bug afecta a todo sitio del portafolio que copie el template.**

### 🔴 El menú llevaba a un 404 — y mi verificador decía que todo estaba bien

`trailingSlash: 'never'` (astro.config + `SITE.trailingSlash`), pero el sitio emitía
**~53 hrefs con barra final**: `NAV`, `Footer`, `SectionMenu`, `cta-presets` y las
páginas nuevas. El **primer botón del menú** —"Mosquiteros" → `/productos/`— daba 404.

Cloudflare redirige en producción, así que solo se veía en local. Lo encontró Frank
abriendo la página; no mi verificación.

**Por qué no se detectó.** El checker hacía esto antes de comprobar:

```python
links[h.rstrip('/')] += 1     # ← EL BUG
```

Normalizaba la barra final y preguntaba si existía `/productos`. Existía. Pero nadie
visita `/productos`: se visita **lo que dice el href**, que era `/productos/`.
**Comprobaba una URL que nadie abre** y reportaba "0 enlaces rotos" con el menú roto.
Un test que no puede fallar no es un test.

**Corregido en la fuente**, no href por href:

| Antes | Ahora |
| --- | --- |
| `/productos/${slug}/` | `productoHref()` → `/productos/${slug}` |
| `/servicios/${id}/` | `servicioHref()` → `/servicios/${id}` |
| `` `/cobertura/${slug}/` `` a mano en 6 archivos | `zonaHref()` |
| `'/productos/'` literal en 14 archivos | `ROUTES.productos` |

**Verificador nuevo:** `scripts/check-links.mjs` → `npm run check:links`. Rastrea desde
la home, pide cada URL **tal cual aparece en el href** (sin normalizar), reporta desde
dónde se enlaza y sale con código 1 si algo rompe — sirve en CI. **Probado que falla:**
reinyectando la barra en `productoHref` caza las 7 rutas y sugiere la URL correcta.

### Bugs de datos encontrados y corregidos de paso

| Bug | Impacto |
| --- | --- |
| `saturday: undefined` en el JSON-LD mientras el footer decía "Sábado 9:00–14:00" | Google leía "cerrado el sábado". Alguien buscando *"mosquiteros abierto ahora"* un sábado **no te veía** |
| `schedule.display` decía solo `Lun–Vie 9:00–18:00` | TopBar y Header —lo primero que se ve— se comían el sábado. Un cliente entrando un sábado leía "Lun–Vie" y asumía cerrado |
| La dirección solo existía dentro del JSON-LD | **Invisible** para una persona. Ahora se muestra en el footer |
| `<h3>Sectores</h3>` se pintaba con `SECTORS = []` | Encabezado con nada debajo, visible en producción |

Los 3 espejos del horario (TopBar/Header · Footer · JSON-LD) ahora coinciden.
Si cambia el horario, hay que tocar `CONTACT.hours`, `CONTACT.schedule` y
`SITE.business.openingHours`. Está anotado en los tres.

---

## 3. Lo que FALTA pedirle al cliente

Los datos de contacto ya están (§2). Queda esto — y **es el cuello de botella real**:
no es trabajo de código, son cosas que solo el negocio tiene.

```
QUÉ VENDES REALMENTE  ← bloquea la validación 🟠
 1. ¿Fabricas estos 6 tipos? enrollables · corredizos · abatibles ·
    plisados · magnéticos · fijos. ¿Y vendes accesorios/refacciones?
    (El sitio HOY los describe los 6 como producto propio.)
 2. ¿Prestas estos 4 servicios? fabricación · instalación ·
    medición a domicilio · reparación/cambio de malla
 3. ¿Cobras la medición a domicilio? ¿Cuánto?
 4. El proceso de 8 pasos del sitio, ¿es tu proceso real? En concreto:
    ¿asesoras el tipo y la malla ANTES de cotizar, o va todo en el mismo
    mensaje? (3 de los 8 pasos los añadimos por diseño, no porque nadie
    los confirmara.)

MARCA  ← es lo que más hace que el sitio se vea "de plantilla"
 5. Logo en vectorial (SVG/AI/PDF)
 6. Color de marca en hex (o mándame el logo y lo saco)
 7. Fotos de trabajos reales — ver la lista de tomas abajo

LEGAL / SCHEMA
 8. Razón social legal (hoy dice "Mosquitero.mx", que es la marca)
 9. Año de fundación (opcional; si no, se omite)
10. Perfiles oficiales: Facebook / Instagram / etc. (solo verificables)
```

### Lista de tomas para la sesión de fotos

Los placeholders del repo YA son esta lista: cada SVG dice qué foto va en su lugar.

- `public/images/proceso/paso-1..8.svg` → los 8 pasos: contacto por WhatsApp ·
  flexómetro sobre el vano · tipos lado a lado · muestras de malla · cotización ·
  armado en taller · colocación en el vano · prueba de corredera
- `public/images/showcase/*.svg` → un mosquitero de cada tipo instalado
- OG 1200×630 y logo cuadrado para el schema

Formato: **4:3, AVIF o WebP, < 200 KB.** El `alt` ya está escrito en el código —
al sustituir el archivo no hay que tocar nada más.

---

## 4. Orden correcto para levantar el gate

No es opcional el orden: cada paso depende del anterior.

1. ~~**Cerrar los `TODO:` de contacto**~~ ✅ **HECHO** (2026-07-14). Verificar que
   sigue así: en el HTML compilado, cero `TODO:` visibles.
2. **Validar el contenido 🟠** de `PROCEDENCIA.md` §5 con el cliente. Sobre todo:
   los 6 tipos de mosquitero, los 4 servicios, y el proceso de 8 pasos (3 de esos
   pasos los añadimos por diseño, no porque el negocio los confirmara).
   **Este es el bloqueo principal hoy.**
3. **Sustituir los placeholders 🔴**: logo, OG, fotos (20 SVGs "Foto pendiente").
4. **Desplegar y verificar** que lo vivo == el repo. **Hoy NO lo es**: mosquitero.mx
   sirve un build viejo que todavía muestra `TODO: 55 0000 0000`.
5. **Solo entonces:** `noindexAll: false` en `src/config/site.ts`.
6. Tras desplegar, comprobar en el sitio vivo que ya NO emite noindex:
   `curl -s https://mosquitero.mx | grep robots` → no debe salir `noindex`.
7. Dar de alta en Google Search Console y mandar `sitemap-index.xml`.

---

## 5. Deuda técnica encontrada de paso

| Qué | Dónde | Nota |
| --- | --- | --- |
| ~~`theme-color` con un `var()` de CSS~~ | `BaseLayout.astro` | ✅ **ARREGLADO 2026-07-14.** Un `var()` no resuelve en un `<meta>`: el navegador lo ignoraba y la barra en móvil nunca se pintaba. Ahora sale de `SITE.themeColor`. **Pero el hex sigue siendo el índigo del template**: el bug murió, el color de marca no existe todavía. El hex vive en 3 sitios (`tokens.css` `--c-primary` + `--c-primary-rgb` · `site.webmanifest` · `SITE.themeColor`) — al cambiarlo, los tres |
| El menú del hero apunta a `/productos`, `/servicios`, `/cobertura` | `SectionMenu` desde `NAV` | Esas rutas **no existen**: dan 404 hoy. El Header y el Footer también las enlazan. Decisión de Frank (2026-07-14): dejarlas, se construirán |
| `noindexAll` no bloquea con `Disallow: /` | `public/robots.txt` | **Correcto, no lo "arregles".** Bloquear el rastreo impide que Google LEA el `noindex`, y la URL puede indexarse igual si alguien la enlaza. Para no indexar hay que dejar rastrear y servir `noindex`. Los dos juntos se anulan |

---

## 6. La línea

Cuando (y solo cuando) los pasos 1–4 estén cerrados:

```ts
// src/config/site.ts:49
noindexAll: false,
```
