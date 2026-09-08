# Working Diagnosis - Claude Maintenance Guide

You are helping Li maintain the Working Diagnosis website, a clinical reference site for NZ GPs built with Eleventy 11ty.

## Project Overview

**Purpose:** Fast, scannable clinical reference for primary care clinicians in Aotearoa New Zealand

**Architecture:** Eleventy (11ty) v3 with Nunjucks templating, deployed via GitHub Actions to GitHub Pages

**Key principle:** Separation of content, structure, design, and functionality. Adding a new page requires only creating a Markdown file in the appropriate content directory.

---

## File Structure

```
src/
├── _data/              # Global data (site.json, nav.json)
├── _includes/
│   ├── base.njk       # Root template
│   ├── layouts/       # 9 page type templates
│   ├── components/    # Reusable components (header, footer, etc.)
│   └── filters/       # Nunjucks filters
├── css/               # Global CSS + design tokens
├── js/                # Global JavaScript
├── assets/            # Images, logos
└── content/           # Markdown content organized by type
    ├── essays/
    ├── explainers/
    ├── topics/
    ├── calculators/
    ├── medications/
    ├── procedures/
    ├── handouts/
    └── research/
```

---

## Adding New Content

### Simple Case: Add an Essay

1. Create a file: `src/content/essays/my-topic.md`

2. Add front matter:
```yaml
---
layout: essay
title: My Clinical Topic
breadcrumb: Field Notes
description: One-line description
publishedDate: 2026-09-07
readTime: 12
tags: [tag1, tag2]
---
```

3. Write Markdown content below the front matter.

4. Build: `npm run build`

The essay automatically:
- Routes through the essay template
- Appears in the essays collection
- Gets counted on the homepage
- Is included in search
- Uses global styling

### All Page Types

Each content directory corresponds to a template:
- `essays/` → uses `layout: essay`
- `explainers/` → uses `layout: explainer`
- `topics/` → uses `layout: topic`
- `calculators/` → uses `layout: calculator`
- `medications/` → uses `layout: medication`
- `procedures/` → uses `layout: procedure`
- `handouts/` → uses `layout: handout`
- `research/` → uses `layout: topic` (same as topics)

### Front Matter Options

```yaml
---
layout: essay                 # Required: page template to use
title: Page Title             # Required
breadcrumb: Section Name      # Optional: appears in breadcrumb
category: essays              # Optional: for collections
description: One-line desc    # Optional
publishedDate: 2026-09-07     # Optional: date object (YYYY-MM-DD)
updatedDate: 2026-09-07       # Optional
readTime: 12                  # Optional: minutes (for essays)
tags: [tag1, tag2]            # Optional
draft: true                   # Optional: set true to hide from build
---
```

---

## Making Design Changes

### Change a colour

Edit `src/css/global.css`. All CSS variables are defined at the top. One change propagates to every page.

Example: change the accent blue
```css
:root {
  --accent: #0284C7;  /* was #1B7AA6 */
}
```

### Change spacing, typography, etc.

Same file. Edit the design token at the top:
```css
:root {
  --space-lg: 24px;   /* was 24px */
  --text-lg: 16px;    /* was 16px */
}
```

### Add/modify a component style

Edit `src/css/components.css`. Do NOT create page-type-specific CSS. If a style applies to multiple pages, it belongs in components.css.

**Do not:**
- Create a new `.css` file for a page type
- Use inline `<style>` tags in templates
- Use page-specific CSS classes

**Do:**
- Add new component classes to `components.css`
- Use semantic BEM naming: `.callout`, `.clinical-pearl`, `.summary-card`
- Ensure styles work on all page types

---

## Adding Reusable Components

Working Diagnosis uses ~10 reusable components:

- `.callout` - highlighted box with left accent bar
- `.clinical-pearl` - italic note with pearl icon
- `.clinical-note` - reference note box
- `.summary-card` - gradient summary card
- `.badge` - inline label/tag
- `.btn` - clickable button
- `.references-section` - citation list styling
- `.back-link` - navigation link

Use these in your Markdown by adding HTML:
```html
<div class="callout info">
**Important:** This is an info callout.
</div>

<div class="clinical-pearl">
Dry cough is ACE-specific; consider ARB if intolerable.
</div>
```

**Before creating a new component, check components.css to see if one already exists.**

---

## Template System

### Page Type Templates (src/_includes/layouts/)

- `base.njk` - root HTML wrapper
- `essay.njk` - two-column essay layout
- `explainer.njk` - single-column explainer
- `topic.njk` - full-width topic/guideline
- `calculator.njk` - calculator tool layout
- `medication.njk` - medication reference
- `procedure.njk` - procedural guide
- `handout.njk` - patient handout
- `home.njk` - homepage with navigation
- `index.njk` - collection index (essays list, etc.)

### Adding a Template

Only if a new page type genuinely differs from all existing templates. Most new content fits one of the 9 existing templates.

To add: create `src/_includes/layouts/newtype.njk` with:
```nunjucks
---
layout: base
layoutCss: layouts.css
---

<div class="article">
  {# Your template here #}
  {{ content | safe }}
</div>
```

Then use in front matter: `layout: newtype`

---

## Build & Deployment

### Local development
```bash
npm install
npm run serve        # Builds and serves at localhost:8080
```

### Build for production
```bash
npm run build        # Creates dist/ folder
```

### Deploy to GitHub Pages
Automatic via GitHub Actions (`.github/workflows/deploy.yml`). Just push to main branch.

---

## Collections & Navigation

The homepage navigation (`nav.json`) is:
- Manually defined
- Maps to collections in `.eleventy.js`
- Shows item counts automatically: `{{ collections[collection] | count }}`

**When adding a new page type:**
1. Create content directory
2. Add collection in `.eleventy.js`
3. Add navigation entry to `src/_data/nav.json`

---

## Maintenance Rules

### Before Making Changes

1. **Read existing files** - understand the pattern before modifying
2. **Check if it already exists** - CSS classes, components, templates
3. **Never duplicate** - if a component or style exists, modify it

### Content Changes

- Edit only the Markdown file
- Do not modify templates or CSS
- If you need a template change, ask first

### CSS Changes

- Check `global.css` for design tokens
- Check `components.css` for existing component
- Never create page-type-specific CSS
- All CSS is global (applies to all pages)

### Adding Features

- Use existing components first
- Ask: "Does this fit an existing template or component?"
- If no, consider if it's truly necessary
- If yes, add it to the shared system (not page-specific)

### Testing

After any change:
1. Build: `npm run build`
2. Serve locally: `npm run serve`
3. Check the page visually
4. Check related pages to ensure no breakage

### Do Not

- Use Claude Design on this codebase (it breaks Nunjucks)
- Create hardcoded counts (generate from collections)
- Hard-code content into templates
- Create duplicate CSS
- Use inline styles
- Create page-specific overrides

### Do

- Separate content from structure
- Use design tokens for colors/spacing
- Extend existing templates
- Modify global CSS for changes that affect multiple pages
- Keep templates simple
- Write clean, readable Markdown

---

## Common Tasks

### Change wording on a page
Edit the Markdown file only. Example:
```bash
src/content/essays/gout-example.md
```
Edit the text, build, push.

### Make clinical pearl boxes slightly smaller
Edit `src/css/components.css`:
```css
.clinical-pearl {
  padding: var(--space-sm) var(--space-md);  /* was var(--space-md) var(--space-lg) */
}
```

### Add a new clinical topic
Create: `src/content/topics/iron-deficiency.md`
Add YAML front matter, write content, build, push.

### Change the header logo
Replace the image in `src/assets/`, update the reference in `src/_includes/components/header.njk` if needed.

### Add a new callout style (e.g., "success")
Add to `src/css/components.css`:
```css
.callout.success {
  border-left-color: var(--ok);
  background: var(--ok-soft);
}
```
Use in Markdown: `<div class="callout success">...</div>`

---

## Troubleshooting

### Build fails
Run: `npm run debug` (shows more errors)

### Page doesn't appear on homepage
Check front matter: `draft: true` hides pages. Set to `draft: false` or remove the line.

### Styling looks wrong
Check: 
1. Is the layout correct in front matter?
2. Did you edit a page-specific CSS file? (You shouldn't have)
3. Run `npm run build` again

### Collections not showing counts
Check `nav.json` has the right `collection` name that matches `.eleventy.js`

---

## When Something is Unclear

Always prefer:
- Asking for clarification over guessing
- Preserving existing content over deleting
- Adding new files over modifying working ones
- Minimal changes over large refactors

This is a clinical site. Accuracy and stability matter more than clever code.
