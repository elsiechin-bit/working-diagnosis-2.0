const markdownIt = require('markdown-it');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItAnchor = require('markdown-it-anchor');

module.exports = function(eleventyConfig) {
  // ============================================================
  // MARKDOWN SETUP
  // ============================================================
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  })
    .use(markdownItFootnote)
    .use(markdownItAnchor, {
      permalink: true,
      permalinkClass: 'anchor-link',
      permalinkSymbol: '#'
    });

  eleventyConfig.setLibrary('md', markdownLibrary);

  // ============================================================
  // COLLECTIONS
  // ============================================================

  // All published content
  eleventyConfig.addCollection('all', function(collection) {
    return collection
      .getFilteredByGlob('src/content/**/*.md')
      .filter(item => !item.data.draft);
  });

  // Essays/Field Notes
  eleventyConfig.addCollection('essays', function(collection) {
    return collection
      .getFilteredByGlob('src/content/essays/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => (b.data.publishedDate || new Date()) - (a.data.publishedDate || new Date()));
  });

  // Explainers
  eleventyConfig.addCollection('explainers', function(collection) {
    return collection
      .getFilteredByGlob('src/content/explainers/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Topics/Guidelines
  eleventyConfig.addCollection('topics', function(collection) {
    return collection
      .getFilteredByGlob('src/content/topics/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Calculators
  eleventyConfig.addCollection('calculators', function(collection) {
    return collection
      .getFilteredByGlob('src/content/calculators/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Medications
  eleventyConfig.addCollection('medications', function(collection) {
    return collection
      .getFilteredByGlob('src/content/medications/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Procedures
  eleventyConfig.addCollection('procedures', function(collection) {
    return collection
      .getFilteredByGlob('src/content/procedures/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Handouts
  eleventyConfig.addCollection('handouts', function(collection) {
    return collection
      .getFilteredByGlob('src/content/handouts/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  // Research
  eleventyConfig.addCollection('research', function(collection) {
    return collection
      .getFilteredByGlob('src/content/research/**/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => (b.data.publishedDate || new Date()) - (a.data.publishedDate || new Date()));
  });

  // ============================================================
  // FILTERS
  // ============================================================

  // Format date
  eleventyConfig.addFilter('dateFormat', function(date) {
    if (!date) return '';
    return date.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Format date (short)
  eleventyConfig.addFilter('dateShort', function(date) {
    if (!date) return '';
    return date.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  // Count items in collection
  eleventyConfig.addFilter('count', function(collection) {
    return collection ? collection.length : 0;
  });

// Pad string with leading zeros
  eleventyConfig.addFilter('padStart', function(str, length, char) {
    return String(str).padStart(length, char);
  });
  
  // ============================================================
  // PASSTHROUGH COPY
  // ============================================================

  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/css');

  // ============================================================
  // ELEVENTY CONFIG
  // ============================================================

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_includes/layouts',
      data: '_data'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    pathPrefix: '/',
    templateFormats: ['md', 'njk', 'html']
  };
};
