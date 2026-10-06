// content.config.ts — Content Collections (Zod .strict()). Síntesis: MESECI + EVENTECH + SEGURIDADPRIVADA
// ============================================================================
// CANÓNICO D1: toda entidad repetible (producto, servicio, artículo, zona, caso)
// vive en una Content Collection con esquema Zod .strict() — nunca hardcodeada
// en .astro (anti-patrón D3). Astro 6 valida el frontmatter en build-time.
//
// DECISIONES Y SU ORIGEN (cada bloque cita de dónde se extrajo):
//  • .strict() en todas las colecciones → MESECI/src/content.config.ts:70,82
//      (Zod v2 endurecido: rechaza campos desconocidos como "hero_image:" que
//       antes se ignoraban en silencio en 16 archivos).
//  • category como z.enum() cerrado, NUNCA z.string() libre → MESECI:67,79
//      (string libre generó 13 variantes tipográficas; INFLAPY tuvo "Guias" vs
//       "Guías" como categorías distintas → SEO fragmentado).
//  • imagen OBLIGATORIA con regex ^/images/ → MESECI:57-59 (imagePath).
//  • heroSchema reutilizable compartido entre colecciones → EVENTECH/src/content/config.ts:11-29.
//  • faqSchema reutilizable (FAQPage JSON-LD) → EVENTECH (faqs en servicios/eventos/blog).
//  • reference() entre colecciones → patrón canónico D1 (MEDEDULCOM grafo);
//      aquí enlaza artículos↔productos↔servicios↔casos por slug tipado.
//  • Colección `zonas` para SEO local multi-zona → SEGURIDADPRIVADA/src/content.config.ts:228-285
//      + INFLAPY (cobertura por alcaldía).
//  • Colección `casos` (casos de éxito / testimonios) → SEGURIDADPRIVADA (testimonios:171-222).
//  • SIN aggregateRating/reviews fabricados en el schema → patrón B4
//      (EVENTECH/PODIUMEX: si no hay reseñas reales verificables, no se modelan).
//
// MARCADORES: reemplaza los valores de cada z.enum([...]) con la taxonomía real
// del cliente. Los slugs DEBEN coincidir con TAXONOMY en src/config/site.ts.
// ============================================================================

import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// ── Helpers reutilizables ────────────────────────────────────────────────────

// imagePath — imagen obligatoria como ruta absoluta bajo /images/. Origen: MESECI:57-59.
const imagePath = z.string().regex(/^\/images\//, {
  message: 'La imagen debe ser una ruta absoluta bajo /images/ (ej. /images/productos/foo.avif)',
});

// faqSchema — bloque FAQ reutilizable. Lo consume el FAQPage JSON-LD. Origen: EVENTECH.
const faqSchema = z
  .array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  )
  .optional();

// seoSchema — campos SEO comunes. Origen: EVENTECH/SEGURIDADPRIVADA (seoTitle/seoDescription/noindex).
// max(60)/max(160) alineados a la convención de títulos del Master System (≤60) y meta (≤160).
const seoFields = {
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).max(15).optional(),
  noindex: z.boolean().default(false),
};

// ── Enums de taxonomía (CERRADOS) — personaliza con los slugs reales ─────────
// Regla MESECI: category siempre enum cerrado. Mantén estos slugs sincronizados
// con TAXONOMY.categories / .services / .coverageStates de src/config/site.ts.

// Tipos de mosquitero. Espejo EXACTO de TAXONOMY.categories[].slug en site.ts.
export const PRODUCT_CATEGORIES = [
  'enrollables',
  'corredizos',
  'abatibles',
  'plisados',
  'magneticos',
  'fijos',
  'accesorios',
] as const;

// Espejo EXACTO de TAXONOMY.services[].id en site.ts.
export const SERVICE_CATEGORIES = [
  'fabricacion',
  'instalacion',
  'medicion',
  'reparacion',
] as const;

// ⚠️ ESPEJO EXACTO de TAXONOMY.articleCategories[].slug en site.ts. Este enum
// gobierna qué ACEPTA el frontmatter (Zod); allá vive cómo se PRESENTA cada slug
// (label + desc). Agregar una categoría exige tocar los DOS archivos: si solo se
// toca aquí, el blog la ignora; si solo se toca allá, el build revienta.
export const ARTICLE_CATEGORIES = [
  'guias',
  'mantenimiento',
  'tipos-de-malla',
  'instalacion', // cómo se coloca, se fija y se arma (bricolaje incluido) — Tanda K 2026-09-28
  'zancudos', // qué insectos entran, por qué pican, qué los detiene — Tanda K 2026-09-28
  'la-marca', // cómo trabajamos, criterio de compra, qué exigirle a un proveedor
  'novedades',
  'general',
] as const;

export const ZONE_TYPES = ['ciudad', 'estado', 'alcaldia', 'municipio', 'zona'] as const;

export const ZONE_CATEGORIES = ['cdmx', 'edomex'] as const;

const imageSchema = z.object({ src: imagePath, alt: z.string() }).strict();
const gallerySchema = z.object({ main: imageSchema, thumbs: z.array(imageSchema) }).strict();
const faqItemSchema = z.object({ question: z.string(), answer: z.string() }).strict();
const dataItemSchema = z.object({ label: z.string(), value: z.string() }).strict();

// ── Colección: productos ──────────────────────────────────────────────────────
const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z
    .object({
      order: z.number(),
      category: z.enum(PRODUCT_CATEGORIES),
      label: z.string(),
      href: z.string(),
      seoTitle: z.string().max(60).optional(),
      seoDescription: z.string().min(140).max(160).optional(),
      h1: z.string().optional(),
      image: imagePath,
      imageAlt: z.string(),
      badge: z.string().optional(),
      blurb: z.string(),
      subcategories: z.array(z.object({ label: z.string(), href: z.string() }).strict()),
      ctaLabel: z.string().optional(),
      body: z.array(z.string()),
      points: z.array(z.string()),
      gallery: gallerySchema,
      comoFunciona: z.array(z.string()),
      encajaEn: z.array(z.string()),
      noConviene: z.array(z.string()).min(1),
      datos: z.array(dataItemSchema),
      faqs: z.array(faqItemSchema).min(8),
      guias: z.array(reference('articulos')),
      servicios: z.array(reference('servicios')),
    })
    .strict(),
});

// ── Colección: servicios ──────────────────────────────────────────────────────
const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z
    .object({
      order: z.number(),
      id: z.enum(SERVICE_CATEGORIES),
      blurb: z.string(),
      body: z.array(z.string()),
      points: z.array(z.string()),
      limite: z.string().optional(),
      gallery: gallerySchema,
      comoFunciona: z.array(z.string()),
      encajaEn: z.array(z.string()),
      noConviene: z.array(z.string()).min(1),
      datos: z.array(dataItemSchema),
      faqs: z.array(faqItemSchema).min(8),
      guias: z.array(reference('articulos')),
      seoTitle: z.string().max(60).optional(),
      seoDescription: z.string().max(160).optional(),
      h1: z.string().optional(),
      h2ComoFunciona: z.string().optional(),
      h2Faq: z.string().optional(),
    })
    .strict(),
});

// ── Colección: articulos (blog) — SIEMPRE .mdx ───────────────────────────────
// Regla D3: el blog vive en colección .mdx, nunca .astro sueltos. Schema Article
// aguas abajo. Origen: EVENTECH:267-328 (enum de categoría) + SEGURIDADPRIVADA.
// REQUIERE @astrojs/mdx en astro.config.mjs.
const articulos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articulos' }),
  schema: z
    .object({
      title: z.string().min(10).max(70), // ≤70 para SEO (convención de títulos).
      description: z.string().min(70).max(160),
      category: z.enum(ARTICLE_CATEGORIES).default('general'), // enum cerrado — evita "Guias"/"Guías" (INFLAPY).
      heroImage: imagePath, // imagen obligatoria.
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Mosquitero.mx'),
      tags: z.array(z.string()).max(10).optional(),
      // Interlinking blog ↔ catálogo (cross-sell). reference() tipado.
      relatedProducts: z.array(reference('productos')).optional(),
      relatedServices: z.array(reference('servicios')).optional(),
      relatedPosts: z.array(reference('articulos')).optional(),
      faqs: faqSchema,
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      showReferencePrices: z.boolean().optional(),
      ...seoFields,
    })
    .strict(),
});

// ── Colección: zonas ─────────────────────────────────────────────────────────
const zonas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zonas' }),
  schema: z
    .object({
      order: z.number(),
      id: z.enum(ZONE_CATEGORIES),
      blurb: z.string(),
      body: z.array(z.string()),
      points: z.array(z.string()),
      confirmar: z.string(),
      gallery: gallerySchema,
    })
    .strict(),
});

// ── Colección: casos (casos de éxito / testimonios) ──────────────────────────
// Prueba social. NO se emite aggregateRating fabricado (B4): el `rating` por
// caso es dato real verificable y se muestra en página, no se agrega a un
// AggregateRating global inventado. Origen: SEGURIDADPRIVADA testimonios:171-222.
const casos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casos' }),
  schema: z
    .object({
      title: z.string().min(10).max(110),
      clientName: z.string(),
      clientRole: z.string().optional(),
      clientCompany: z.string().optional(),
      clientLocation: z.string().optional(),
      quote: z.string(), // testimonio textual real.
      summary: z.string().optional(), // resumen del caso de éxito.
      image: imagePath,
      rating: z.number().min(1).max(5).optional(), // SOLO si es real y verificable.
      // A qué categoría/servicio/producto pertenece el caso (interlinking).
      relatedServices: z.array(reference('servicios')).optional(),
      relatedProducts: z.array(reference('productos')).optional(),
      date: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      approved: z.boolean().default(true), // gate editorial — SEGURIDADPRIVADA.
      draft: z.boolean().default(false),
    })
    .strict(),
});

// ── Export ────────────────────────────────────────────────────────────────────
// Borra las colecciones que el proyecto no use (un sitio puede no tener `zonas`
// o `casos`). Mantén `articulos` si hay blog (siempre .mdx — D3).
export const collections = {
  productos,
  servicios,
  articulos,
  zonas,
  casos,
};
