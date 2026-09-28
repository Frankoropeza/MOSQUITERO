# mosquitero.mx

Sitio estático de Mosquitero.mx para catálogo, servicios, cobertura, blog y contacto.

## Stack

- Astro 6 SSG + TypeScript estricto
- Content Collections con Markdown/MDX y Zod
- CSS vanilla con tokens

## Comandos

```sh
npm ci
npm run dev
npm run build
```

`npm run build` ejecuta validación de Astro, build estático, `build-id` y el verificador offline de enlaces sobre `dist/`.

## Mapa de `src/`

```text
src/
├── config/site.ts          SSoT de identidad, rutas, contacto y taxonomía
├── content/articulos/*.mdx Artículos del blog
├── content.config.ts       Esquemas de Content Collections
├── pages/                  Rutas estáticas y dinámicas del sitio
├── lib/seo.ts              Metadatos y JSON-LD centralizados
└── styles/tokens.css       Tokens de diseño
```

## Reglas del sistema

- La política de URLs es `trailingSlash: 'always'`: toda página interna termina en `/`.
- `config/site.ts` es la fuente única de datos compartidos; no se duplican datos de negocio.
- Todo enlace de WhatsApp se construye con `waUrl()`.
- Cero contenido fabricado: no se inventan precios, reseñas, teléfonos, direcciones ni certificaciones.
- Las fuentes son self-hosted.

La documentación del proyecto vive fuera del repo, en el vault local de Obsidian.
