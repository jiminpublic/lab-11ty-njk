const tilFilter = require("./src/utils/tils.js");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const markdownIt = require("markdown-it");

const md = markdownIt();

const defaultFenceRender = md.renderer.rules.fence;

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const info = token.info; // "info": "html {2-3}"
  let language = "";
  let filename = ""; // f:index.html -> index.html

  if (info) {
    const arr = info.split(/(\s+)/g);
    language = arr[0];

    for (const str of arr) {
      if (str.startsWith("f:")) {
        filename = str.slice(2);
        break;
      }
    }
  }

  const defaultHtml = defaultFenceRender(tokens, idx, options, env, self);

  const filenameHtml = `<span class="code-block__filename">${filename}</span>`;
  const langHtml = `<span class="lang">${language}</span>`;
  const headerHtml = `<div class="code-block__header">${
    filename ? filenameHtml : langHtml
  }</div>`;

  return `<div class="code-block__wrapper language-${language}">${headerHtml}${defaultHtml}</div>`;
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("tils", function (collectionApi) {
    return collectionApi.getFilteredByGlob(
      process.env.ELEVENTY_RUN_MODE === "build"
        ? "src/pages/content/lab-content/tils/*.md"
        : "src/pages/content/tils/*.md"
    );
  });

  eleventyConfig.addFilter("tilFilter", tilFilter);

  eleventyConfig.addPassthroughCopy({ "src/css/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/css/reset.css": "reset.css" });
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.on("eleventy.before", async () => {
    const Shiki = await import("@shikijs/markdown-it");
    const { transformerMetaHighlight } = await import("@shikijs/transformers");

    md.use(
      await Shiki.default({
        theme: "dark-plus",
        langs: ["javascript", "html", "bash", "astro"],
        transformers: [transformerMetaHighlight()],
      })
    );

    eleventyConfig.setLibrary("md", md);
  });

  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "src/pages",
      output: "dist",
      includes: "../_includes",
      data: "../_data",
    },
  };
};
