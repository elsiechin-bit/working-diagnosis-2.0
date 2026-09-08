# Working Diagnosis

A clinical reference website for general practitioners and primary care clinicians in Aotearoa New Zealand.

**Built with:** Eleventy 11ty · Nunjucks templating · GitHub Pages

**Live site:** https://workingdiagnosis.xyz

## Quick Start

### Setup
```bash
git clone https://github.com/[your-username]/working-diagnosis.git
cd working-diagnosis
npm install
```

### Local development
```bash
npm run serve
# Opens at http://localhost:8080
```

### Build for production
```bash
npm run build
# Creates dist/ folder
```

## Adding Content

Create a Markdown file in the appropriate content directory:

```bash
# Essay
src/content/essays/my-essay.md

# Explainer
src/content/explainers/topic-name.md

# Guideline/Topic
src/content/topics/condition-name.md

# Calculator
src/content/calculators/tool-name.md
```

Add front matter (required fields: `layout`, `title`):

```yaml
---
layout: essay
title: My Clinical Topic
breadcrumb: Field Notes
description: One-line description
publishedDate: 2026-09-07
readTime: 12
---

# Your Markdown content here
```

Build and it appears automatically:
```bash
npm run build
```

## Architecture

- **Content:** Markdown files with YAML front matter
- **Templates:** 9 Nunjucks layouts (essay, explainer, topic, calculator, etc.)
- **Components:** Reusable CSS components (callout, pearl, note, etc.)
- **Styles:** Global design tokens + component CSS
- **Build:** Eleventy collections, automatic navigation, zero manual counts

See `CLAUDE.md` for detailed maintenance guide.

## Design System

All design tokens in `src/css/global.css`:

- **Colours:** Semantic system (accent, danger, warn, info, ok) + dark mode
- **Typography:** Outfit (display) + IBM Plex Mono (metadata)
- **Spacing:** 8px-based scale (xs, sm, md, lg, xl, etc.)
- **Components:** ~10 reusable classes

To change a style globally, edit one CSS variable.

## Development

```bash
npm run serve      # Dev server with hot reload
npm run build      # Production build
npm run watch      # Watch mode without server
npm run debug      # Verbose build output
```

## Deployment

Automatic via GitHub Actions on push to `main` branch. Site deploys to GitHub Pages.

## License

CC-BY-NC-SA-4.0 (Creative Commons Attribution-NonCommercial-ShareAlike)

## About

Working Diagnosis is a personal project by Li, a GP registrar in Christchurch, NZ. Clinical interests include dermatology, medico-legal writing, aged care, and LGBTQ+ health.

---

**For maintenance & development guidance, see `CLAUDE.md`**
