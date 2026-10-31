# Sitio de Rodrigo Laera

Sitio estático (sin build para el visitante). Páginas: `index.html` (español) y `en.html` (inglés).
Datos del CV en `data.js`, textos y traducciones en `i18n.js`, ajustes en `config.js`.
Nota: en esta carpeta de Drive están los archivos del sitio listos para publicar. Los archivos `body.html` y `build.py` (solo para regenerar las dos páginas HTML) están en el zip original.

## Publicarlo gratis (GitHub Pages)
1. Creá un repositorio público en GitHub y subí todos estos archivos.
2. Settings → Pages → Deploy from branch → main / root. Queda en https://TU-USUARIO.github.io/REPO/
3. Dominio propio (recomendado, ej. rodrigolaera.com): Settings → Pages → Custom domain.

## Visibilidad (completar en config.js)
- `siteUrl`: la URL final del sitio, sin barra al final. Activa los enlaces canonical, hreflang (es/en) y la dirección en los datos estructurados.
- `scholarUrl` y `profiles`: Google Académico, ORCID, PhilPapers, RePEc y CONICET Digital. Aparecen como botones en Contacto y se publican como `sameAs` en los datos estructurados, que ayuda a los buscadores a unir tus perfiles.
- Buscadores: cada artículo se publica con marcado schema.org (ScholarlyArticle) y el sitio incluye metadatos para redes sociales. Cuando tengas dominio, registralo en Google Search Console y enviá `https://TU-DOMINIO/index.html` y `en.html`.

## PDFs de acceso abierto
1. Creá una carpeta `pdf/` y subí los PDFs que tengas derecho a publicar (preprint o versión aceptada; revisá la política de cada revista).
2. En `data.js`, agregá la ruta como 8.º elemento del artículo:
   `["epi",2025,"Título","Revista","25, pp. 45-71","10.18270/rcfc.4828","","pdf/laera-2025-virtud.pdf"]`
3. Ese artículo muestra la etiqueta "Acceso abierto", el botón PDF y entra en el filtro "Solo con PDF".

## Botón "Citar"
Cada artículo genera su cita en APA 7 y BibTeX a partir de `data.js`. Si una cita sale mal (por ejemplo, volumen o páginas), corregí el campo de detalle del artículo (5.º elemento).

## Activar el foro (giscus, usa GitHub Discussions)
1. En el repo: Settings → General → Features → activar Discussions. Crear una categoría "Foro" (tipo Announcements).
2. Instalá la app https://github.com/apps/giscus en el repo.
3. Entrá a https://giscus.app, poné "usuario/repositorio" y elegí la categoría; copiá repoId y categoryId.
4. Pegalos en `config.js`.
Los hilos se identifican por el título del paper, así que son los mismos en español e inglés.
Moderación: desde la pestaña Discussions del repo podés ocultar, borrar o bloquear comentarios.
