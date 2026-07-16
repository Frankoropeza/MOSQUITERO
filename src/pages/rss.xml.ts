// ============================================================================
// rss.xml.ts — FEED RSS 2.0 del blog. Ruta: /rss.xml
// ----------------------------------------------------------------------------
// Endpoint estático (no .astro): devuelve XML, no HTML. Astro lo emite en build
// como un archivo suelto en /dist/rss.xml.
//
// POR QUÉ /rss.xml Y NO /blog/rss.xml: la convención de descubrimiento apunta a
// la raíz, y es la ruta que asumen los lectores y los agregadores. Además el
// <link rel="alternate"> del <head> apunta aquí (ver PageLayout → slot "head").
//
// CERO DATOS FABRICADOS: cada campo sale de la colección o de SITE. No se
// inventa autor, categoría ni fecha.
//
// EL FEED NO LLEVA EL CUERPO DEL ARTÍCULO. `content` exigiría renderizar el MDX
// a HTML por post (sanitizado, con rutas de imagen absolutizadas). Un feed con
// el texto completo también quita al lector cualquier motivo para entrar al
// sitio. Se sirve título + descripción + enlace: el patrón de un blog de
// negocio, donde el feed es un aviso, no el producto.
// ============================================================================
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, blogCategoryLabel } from '@config/site';

export async function GET(context: APIContext) {
  // Mismo filtro de draft que el resto del blog: un borrador no se anuncia.
  const posts = (await getCollection('articulos', ({ data }) => data.draft !== true)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: `Blog de ${SITE.name}`,
    description:
      'Guías para elegir, medir y mantener mosquiteros a medida: qué tipo va con cada ventana, qué malla conviene y cómo alargar la vida de la pieza.',
    // context.site sale de `site` en astro.config.mjs. El fallback a SITE.url
    // evita que el feed salga con enlaces relativos si alguien toca la config.
    site: context.site?.toString() ?? SITE.url,
    // stylesheet: sin hoja XSL, el navegador muestra el XML crudo. No se declara
    // una que no existe: un 404 en el stylesheet rompe el render en algunos
    // lectores. Si se añade /rss/styles.xsl, se declara aquí.
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      // Sin slash final: política B5 (trailingSlash 'never'). El enlace del feed
      // debe ser IDÉNTICO al canonical del artículo, o los agregadores duplican.
      link: `/blog/${post.id}`,
      author: post.data.author,
      categories: [blogCategoryLabel(post.data.category), ...(post.data.tags ?? [])],
    })),
    customData: `<language>${SITE.lang}</language>`,
    trailingSlash: false,
  });
}
