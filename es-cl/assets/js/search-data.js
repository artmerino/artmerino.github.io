
const currentUrl = window.location.href;
const siteUrl = "https://amerino.cl"; 
let updatedUrl = currentUrl.replace("https://amerino.cl", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("es-cl".length > 0) {
  updatedUrl = updatedUrl.replace("/es-cl", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-sobre-mí",
    title: "Sobre mí",
    section: "Menú de navegación",
    handler: () => {
      window.location.href = "/es-cl/";
    },
  },{id: "nav-publicaciones",
          title: "Publicaciones",
          description: "Publicaciones en orden cronológico inverso.",
          section: "Menú de navegación",
          handler: () => {
            window.location.href = "/es-cl/publications/";
          },
        },{id: "nav-docencia",
          title: "Docencia",
          description: "",
          section: "Menú de navegación",
          handler: () => {
            window.location.href = "/es-cl/teaching/";
          },
        },{id: "news-nuestro-paper-computing-diverse-and-nice-triangulations-ganó-el-premio-al-mejor-artículo-en-fct-2025",
          title: 'Nuestro paper “Computing Diverse and Nice Triangulations” ganó el premio al mejor artículo...',
          description: "",
          section: "Noticias",},{id: "news-participé-en-el-seminario-dagstuhl-precision-in-geometric-algorithms",
          title: 'Participé en el Seminario Dagstuhl “Precision in Geometric Algorithms”.',
          description: "",
          section: "Noticias",},{id: "news-realicé-una-visita-de-investigación-a-la-universidad-de-kassel",
          title: 'Realicé una visita de investigación a la Universidad de Kassel.',
          description: "",
          section: "Noticias",},{id: "news-nuestro-paper-listing-faces-of-polytopes-fue-aceptado-en-soda-2026",
          title: 'Nuestro paper “Listing faces of polytopes” fue aceptado en SODA 2026! 🎉',
          description: "",
          section: "Noticias",},{id: "news-nuestro-paper-traversing-regions-of-supersolvable-hyperplane-arrangements-and-their-lattice-quotients-fue-aceptado-en-soda-2026",
          title: 'Nuestro paper “Traversing regions of supersolvable hyperplane arrangements and their lattice quotients” fue...',
          description: "",
          section: "Noticias",},{id: "news-nuestro-paper-generating-all-invertible-matrices-by-row-operations-fue-aceptado-en-discrete-mathematics",
          title: 'Nuestro paper “Generating all invertible matrices by row operations” fue aceptado en Discrete...',
          description: "",
          section: "Noticias",},{id: "news-dí-una-charla-sobre-nuestro-paper-listing-faces-of-polytopes-en-el-workshop-on-optimization-and-algorithms",
          title: 'Dí una charla sobre nuestro paper “Listing Faces of Polytopes” en el Workshop...',
          description: "",
          section: "Noticias",},{id: "news-me-moví-al-dcc-en-la-u-de-chile",
          title: 'Me moví al DCC en la U. de Chile!',
          description: "",
          section: "Noticias",},{id: "news-visita-de-benjamin-berendsohn",
          title: 'Visita de Benjamin Berendsohn',
          description: "",
          section: "Noticias",},{id: "news-nuevo-preprint-combinatorial-perpetual-scheduling",
          title: 'Nuevo preprint: Combinatorial Perpetual Scheduling!',
          description: "",
          section: "Noticias",},{id: "news-participé-en-el-workshop-algorithms-combinatorics-and-geometry",
          title: 'Participé en el workshop “Algorithms, Combinatorics and Geometry”.',
          description: "",
          section: "Noticias",},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/9_project/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/1_project%20copy/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/2_project%20copy/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/3_project%20copy/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/4_project%20copy/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/5_project%20copy/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Proyectos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/6_project%20copy/";
            },},{
          id: 'lang-en-gb',
          title: 'en-gb',
          section: 'Idiomas',
          handler: () => {
            window.location.href = "" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Cambiar tema a claro',
      description: 'Cambiar el tema del sitio a claro',
      section: 'Tema',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Cambiar tema a oscuro',
      description: 'Cambiar el tema del sitio a oscuro',
      section: 'Tema',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Usar tema predeterminado del sistema',
      description: 'Cambiar el tema del sitio a predeterminado del sistema',
      section: 'Tema',
      handler: () => {
        setThemeSetting("system");
      },
    },];
