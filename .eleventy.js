//
const { tilContentFilter } = require("./src/utils/tils-filters.js");
const { markdownToTilsData } = require("./src/utils/tils-collection.js");

//
const {
  EleventyHtmlBasePlugin,
  EleventyRenderPlugin,
} = require("@11ty/eleventy");

//
const markdownIt = require("markdown-it");

//
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssNesting = require("postcss-nesting");
const path = require("path");

//
const md = markdownIt({
  linkify: true,
});

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

const defaultLinkOpenRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  // Add a new `target` attribute, or replace the value of the existing one.
  tokens[idx].attrSet("target", "_blank");

  // Pass the token to the default renderer.
  return defaultLinkOpenRender(tokens, idx, options, env, self);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("tilContentFilter", tilContentFilter);

  eleventyConfig.addCollection("tils", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(
        process.env.ELEVENTY_RUN_MODE === "build"
          ? "src/content/lab-content/tils/*.md"
          : "src/content/mock-tils/*.md"
      )
      .map((item) => {
        const rawMarkdown = item.template.frontMatter.content;
        const date = item.fileSlug.slice(0, 10);
        const { tags, title, newRawMarkdown } = markdownToTilsData(rawMarkdown);
        item.data = { date, tags, title, newRawMarkdown };
        return item;
      })
      .toSorted((a, b) => b.data.date.localeCompare(a.data.date));
  });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.on("eleventy.before", async () => {
    const Shiki = await import("@shikijs/markdown-it");
    const { transformerMetaHighlight } = await import("@shikijs/transformers");

    md.use(
      await Shiki.default({
        theme: "dark-plus",
        langs: [
          "txt",
          "bash",
          "json",
          "yaml",
          "html",
          "css",
          "javascript",
          "jsx",
          "tsx",
          "astro",
          "scss",
        ],
        defaultLanguage: "txt",
        fallbackLanguage: "txt",
        transformers: [transformerMetaHighlight()],
      })
    );

    eleventyConfig.setLibrary("md", md);
  });

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",

    compile: async function (inputContent, inputPath) {
      if (path.parse(inputPath).name !== "index") {
        return;
      }

      return async () => {
        const output = await postcss([
          postcssImport,
          autoprefixer,
          cssnano,
          postcssNesting,
        ]).process(inputContent, { from: inputPath });

        return output.css;
      };
    },
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
