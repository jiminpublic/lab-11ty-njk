const tilFilter = require("./src/utils/tils.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("tils", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/content/tils/*.md");
  });

  eleventyConfig.addFilter("tilFilter", tilFilter);

  eleventyConfig.addPassthroughCopy({ "src/css/style.css": "style.css" });
  eleventyConfig.addWatchTarget("src/css/");

  return {
    dir: {
      input: "src/pages",
      output: "dist",
      includes: "../_includes",
      data: "../_data",
    },
  };
};
