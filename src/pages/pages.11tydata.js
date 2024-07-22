module.exports = {
  layout: "base.njk",
  permalink: ({ page }) => {
    const pagesDir = "pages";

    if (page.fileSlug === pagesDir) {
      return "/index.html";
    }

    if (page.filePathStem.endsWith("index")) {
      return `/${page.filePathStem.slice(
        `/${pagesDir}/`.length,
        -6
      )}/index.html`;
    }

    return `/${page.filePathStem.slice(`/${pagesDir}/`.length)}/index.html`;
  },
};
