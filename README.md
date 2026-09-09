# Working Diagnosis 2.0 - Source Code

A clinical reference website for general practitioners in Aotearoa New Zealand.

Built with: **Eleventy** · **Nunjucks** · **HTML/CSS**  
Live site: https://workingdiagnosis.xyz

---

## Quick Start

### Setup

```bash
git clone [repo-url]
cd working-diagnosis-src
npm install
```

### Local development

```bash
npm run serve
# Opens at http://localhost:8080 with live reload
```

### Build for production

```bash
npm run build
# Creates dist/ folder for deployment
```

---

## Adding Content

### Create a new explainer

Create a file in `src/content/explainers/`:

```bash
src/content/explainers/migraine.md
```

Add front matter:

```yaml
---
layout: explainer
title: Migraine
breadcrumb: Neurology
description: Pathophysiology, tension vs migraine, current evidence on prophylaxis.
publishedDate: 2024-09-07
updatedDate: 2024-09-07
keyPoints:
  - label: Global prevalence
    value: "~10%"
    note: Third most common disorder globally; higher in women.
  - label: Diagnosis
    value: "Clinical"
    note: No test confirms migraine. ICHD-3 criteria used.
---

## Your content here

Use markdown. Headings become sections automatically.
```

Content appears immediately after build.

### Other content types

Create files in the matching directory:

- **Essays**: `src/content/essays/my-essay.md`
- **Guidelines**: `src/content/guidelines/topic-comparison.md`
- **Calculators**: `src/content/calculators/risk-tool.md`
- **Medications**: `src/content/medications/drug-equivalents.md`
- **Procedures**: `src/content/procedures/technique.md`
- **Handouts**: `src/content/handouts/patient-info.md`
- **Research**: `src/content/research/study-notes.md`

---

## Architecture

### Directories

```
src/
├── _data/           # Configuration & site metadata
├── _includes/       
│   ├── layouts/     # Page templates
│   └── components/  # Reusable UI parts (header, footer, etc)
├── css/             # Global & page-type styles
├── js/              # Client-side scripts
├── content/         # All clinical content (organized by type)
└── assets/          # Images, downloads, etc
```

### Content model

```
Markdown file (with YAML front matter)
         ↓
Layout template (selected by layout property)
         ↓
Components (reusable UI blocks)
         ↓
Global CSS (design tokens + base styles)
         ↓
HTML output
```

### How it works

1. You write markdown with YAML front matter
2. Eleventy routes it through the specified layout template
3. The template includes reusable components (header, footer)
4. Global CSS applies design system tokens
5. Built HTML is generated in `dist/`

---

## Page Types

Working Diagnosis uses 8 core page templates:

1. **Explainer** - Structured clinical reference (assessment, diagnosis, treatment, etc)
2. **Essay** - Longer clinical writing, evidence summaries, systems thinking
3. **Guideline** - Comparison of evidence-based approaches
4. **Calculator** - Interactive clinical decision tools
5. **Medication** - Drug reference, dosing, interactions
6. **Procedure** - Technical instructions for minor surgery or clinical techniques
7. **Handout** - Patient-facing information
8. **Research** - Experimental, exploratory clinical content

---

## Design System

All design decisions in `src/css/global.css`:

### Colours (CSS variables)

```css
--accent: #1B7AA6           /* Primary action colour */
--ok: #2F7D4F               /* Success/safe states */
--warn: #96631A             /* Caution/warning states */
--danger: #B4322A           /* Error/contraindication states */
--info: #1B7AA6             /* Information states */
```

### Typography

```css
--font-display: 'Outfit'        /* Headings, labels */
--font-mono: 'IBM Plex Mono'    /* Code, metadata */
```

### Spacing

8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

### To change globally

Edit **one CSS variable** in `src/css/global.css`.

Example:
```css
--accent: #1B7AA6  →  --accent: #2E5090
```

Changes propagate across the entire site.

---

## Development

### Run in watch mode

```bash
npm run watch
```

Rebuilds on file change but doesn't open browser.

### Debug output

```bash
npm run debug
```

Verbose Eleventy output for troubleshooting.

---

## Deployment

The site deploys automatically via GitHub Actions on push to `main`.

Deployed to GitHub Pages at https://workingdiagnosis.xyz

---

## Performance

- **Fast**: Static HTML generation
- **No database**: Content is files + Git history
- **Mobile-first CSS**: Responsive by default
- **Lean**: ~7KB global CSS, ~165 lines JS
- **Offline-ready**: Site works without JavaScript (graceful degradation)

---

## Key Principles

1. **Simplicity**: No frameworks unless necessary
2. **Maintainability**: Content separate from code
3. **Scalability**: Adding 100 new topics doesn't slow the system
4. **Stability**: URLs don't change; content is versionable
5. **Clarity**: Non-programmers can edit content without touching code

---

## Common Tasks

### Change a style globally

Edit `src/css/global.css`

Example: "Make headings smaller"
```css
h1 { font-size: 40px; } → h1 { font-size: 32px; }
```

Done. Rebuilds automatically on the next build.

### Add a new clinical topic

Create `src/content/explainers/topic-name.md` with front matter. Build. It appears.

### Update existing content

Edit the markdown file. Rebuild. Live.

### Add images

Place in `src/assets/`. Reference in markdown:
```markdown
![Alt text](/assets/image.png)
```

### Change navigation or structure

Update `src/_data/site.json` or collection logic in `.eleventy.js`

---

## Troubleshooting

**Build fails**
```bash
npm run debug
```
Check error output for path issues or YAML syntax errors.

**Page doesn't appear**
- Check file is in correct `src/content/` directory
- Verify layout name matches an existing template
- Check YAML front matter syntax (colons, quotes)

**Styling is broken**
- Verify CSS file is in `src/css/`
- Check CSS syntax (missing semicolons, braces)
- Inspect browser dev tools for CSS class names

---

## License

CC-BY-NC-SA-4.0 (Creative Commons Attribution-NonCommercial-ShareAlike)

---

## Support

For maintenance guidance and development notes, see `CLAUDE.md`
