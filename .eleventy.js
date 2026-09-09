const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Configure Markdown
  let markdownLibrary = markdownIt({ html: true, linkify: true })
    .use(markdownItAnchor);
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Collections
  eleventyConfig.addCollection("essays", function(collection) {
    return collection.getFilteredByGlob("src/content/essays/*.md").sort((a, b) => {
      return new Date(b.data.publishedDate) - new Date(a.data.publishedDate);
    });
  });

  eleventyConfig.addCollection("explainers", function(collection) {
    return collection.getFilteredByGlob("src/content/explainers/*.md").sort((a, b) => {
      return a.data.title.localeCompare(b.data.title);
    });
  });

  eleventyConfig.addCollection("calculators", function(collection) {
    return collection.getFilteredByGlob("src/content/calculators/*.md");
  });

  eleventyConfig.addCollection("medications", function(collection) {
    return collection.getFilteredByGlob("src/content/medications/*.md");
  });

  eleventyConfig.addCollection("procedures", function(collection) {
    return collection.getFilteredByGlob("src/content/procedures/*.md");
  });

  eleventyConfig.addCollection("handouts", function(collection) {
    return collection.getFilteredByGlob("src/content/handouts/*.md");
  });

  eleventyConfig.addCollection("guidelines", function(collection) {
    return collection.getFilteredByGlob("src/content/guidelines/*.md");
  });

  eleventyConfig.addCollection("research", function(collection) {
    return collection.getFilteredByGlob("src/content/research/*.md");
  });

  // Filters
  eleventyConfig.addNunjucksFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addNunjucksFilter("dateShort", dateObj => {
  return new Date(dateObj).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

  eleventyConfig.addNunjucksFilter("count", (arr) => {
    return arr ? arr.length : 0;
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
