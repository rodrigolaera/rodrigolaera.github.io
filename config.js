// Configuración del sitio. Completá estos valores (ver README.md).
window.SITE = {
  siteUrl: "https://rodrigolaera.github.io",               // URL final del sitio, ej. "https://rodrigolaera.com" (activa canonical, hreflang y datos estructurales)
  scholarUrl: "",            // Google Académico
  profiles: {                // Perfiles académicos (dejá vacío lo que no uses)
    orcid: "",               // https://orcid.org/0000-0000-0000-0000
    philpapers: "",          // https://philpeople.org/profiles/...
    repec: "",               // https://ideas.repec.org/f/...
    conicet: ""              // https://ri.conicet.gov.ar/ ... o tu perfil en CONICET Digital
  },
  giscus: {
    repo: "",                // "usuario/repositorio"
    repoId: "",              // ID del repositorio (giscus.app)
    category: "Foro",        // categoría de Discussions
    categoryId: ""           // ID de la categoría (giscus.app)
  }
};
// PDFs en acceso abierto: en data.js agregá la ruta o URL del PDF como 8.º elemento de cada artículo,
// por ejemplo: ["epi",2025,"Título","Revista","25, pp. 45-71","10.18270/rcfc.4828","","pdf/laera-2025-virtud.pdf"]
