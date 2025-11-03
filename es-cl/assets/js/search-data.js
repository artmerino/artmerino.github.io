
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
    id: "nav-about",
    title: "about",
    section: "Menu de navegação",
    handler: () => {
      window.location.href = "/es-cl/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "publications in reverse chronological order.",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/es-cl/publications/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/es-cl/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Materials for courses you taught. Replace this text with your description.",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/es-cl/teaching/";
          },
        },{id: "news-nuestro-paper-computing-diverse-and-nice-triangulations-ganó-el-premio-al-mejor-artículo-en-fct-2025",
          title: 'Nuestro paper “Computing Diverse and Nice Triangulations” ganó el premio al mejor artículo...',
          description: "",
          section: "Novidades",},{id: "news-participé-en-el-seminario-dagstuhl-precision-in-geometric-algorithms",
          title: 'Participé en el seminario Dagstuhl “Precision in Geometric Algorithms”.',
          description: "",
          section: "Novidades",},{id: "news-visita-de-investigación-a-la-universidad-de-kassel",
          title: 'Visita de investigación a la Universidad de Kassel.',
          description: "",
          section: "Novidades",},{id: "news-nuestro-paper-listing-faces-of-polytopes-fue-aceptado-en-soda-2026",
          title: 'Nuestro paper “Listing faces of polytopes” fue aceptado en SODA 2026! 🎉',
          description: "",
          section: "Novidades",},{id: "news-nuestro-paper-traversing-regions-of-supersolvable-hyperplane-arrangements-and-their-lattice-quotients-fue-aceptado-en-soda-2026",
          title: 'Nuestro paper “Traversing regions of supersolvable hyperplane arrangements and their lattice quotients” fue...',
          description: "",
          section: "Novidades",},{id: "news-nuestro-paper-generating-all-invertible-matrices-by-row-operations-fue-aceptado-en-discrete-mathematics",
          title: 'Nuestro paper “Generating all invertible matrices by row operations” fue aceptado en Discrete...',
          description: "",
          section: "Novidades",},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/9_project/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projetos",handler: () => {
              window.location.href = "/es-cl/projects/es-cl/6_project/";
            },},{
          id: 'lang-en-gb',
          title: 'en-gb',
          section: 'Idiomas',
          handler: () => {
            window.location.href = "" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Muda o tema para claro',
      description: 'Muda o tema do site para claro',
      section: 'Tema',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Muda o tema para escuro',
      description: 'Muda o tema do site para escuro',
      section: 'Tema',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Usa o tema padrão do sistema',
      description: 'Muda o tema do site para o padrão do sistema',
      section: 'Tema',
      handler: () => {
        setThemeSetting("system");
      },
    },];
