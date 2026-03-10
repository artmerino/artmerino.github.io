
const currentUrl = window.location.href;
const siteUrl = "https://amerino.cl"; 
let updatedUrl = currentUrl.replace("https://amerino.cl", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("".length > 0) {
  updatedUrl = updatedUrl.replace("/", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation menu",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Publications in reverse chronological order.",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-short-cv",
          title: "Short CV",
          description: "",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "news-our-paper-computing-diverse-and-nice-triangulations-got-the-best-paper-award-at-fct-2025",
          title: 'Our paper “Computing Diverse and Nice Triangulations” got the best paper award at...',
          description: "",
          section: "News",},{id: "news-attended-in-the-dagstuhl-seminar-precision-in-geometric-algorithms",
          title: 'Attended in the Dagstuhl Seminar “Precision in Geometric Algorithms”.',
          description: "",
          section: "News",},{id: "news-research-visit-to-university-of-kassel",
          title: 'Research visit to University of Kassel.',
          description: "",
          section: "News",},{id: "news-our-paper-listing-faces-of-polytopes-was-accepted-at-soda-2026",
          title: 'Our paper “Listing faces of polytopes” was accepted at SODA 2026! 🎉',
          description: "",
          section: "News",},{id: "news-our-paper-traversing-regions-of-supersolvable-hyperplane-arrangements-and-their-lattice-quotients-was-accepted-at-soda-2026",
          title: 'Our paper “Traversing regions of supersolvable hyperplane arrangements and their lattice quotients” was...',
          description: "",
          section: "News",},{id: "news-our-paper-generating-all-invertible-matrices-by-row-operations-was-accepted-in-discrete-mathematics",
          title: 'Our paper “Generating all invertible matrices by row operations” was accepted in Discrete...',
          description: "",
          section: "News",},{id: "news-gave-a-talk-on-our-paper-listing-faces-of-polytopes-at-the-workshop-on-optimization-and-algorithms",
          title: 'Gave a talk on our paper “Listing Faces of Polytopes” at the Workshop...',
          description: "",
          section: "News",},{id: "news-i-moved-to-the-cs-department-at-u-chile",
          title: 'I moved to the CS department at U. Chile!',
          description: "",
          section: "News",},{id: "news-visit-by-benjamin-berendsohn",
          title: 'Visit by Benjamin Berendsohn',
          description: "",
          section: "News",},{id: "news-new-preprint-combinatorial-perpetual-scheduling",
          title: 'New preprint: Combinatorial Perpetual Scheduling!',
          description: "",
          section: "News",},{id: "news-participated-in-the-workshop-algorithms-combinatorics-and-geometry",
          title: 'Participated in the workshop “Algorithms, Combinatorics and Geometry”.',
          description: "",
          section: "News",},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/en-gb/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/en-gb/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/en-gb/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/en-gb/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/en-gb/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/en-gb/6_project/";
            },},{
          id: 'lang-es-cl',
          title: 'es-cl',
          section: 'Languages',
          handler: () => {
            window.location.href = "/es-cl" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
