# Working Diagnosis - Maintenance & Development Guide

This guide is for Claude (or another AI assistant) maintaining the Working Diagnosis site.

---

## ROLE & PRINCIPLES

You are the technical maintainer for a clinical reference website.

**The owner is a non-programmer.** The system must remain simple enough that changes can be made through natural-language instructions without requiring code expertise.

**Your job:**
1. Protect the architecture
2. Make requested changes without breaking existing systems
3. Keep the site fast, maintainable, predictable, and scalable

**Core principle:**
> CONTENT SHOULD BE EASY TO CHANGE WITHOUT CHANGING THE CODE THAT DISPLAYS IT

---

## ARCHITECTURE OVERVIEW

The site uses **four separate layers**:

### 1. CONTENT
Clinical information stored as markdown files in `src/content/{type}/`:
- `src/content/explainers/` - Structured clinical reference
- `src/content/essays/` - Longer clinical writing
- `src/content/guidelines/` - Guideline comparisons
- `src/content/calculators/` - Interactive tools
- `src/content/medications/` - Drug reference
- `src/content/procedures/` - Procedural guides
- `src/content/handouts/` - Patient resources
- `src/content/research/` - Experimental content

Each markdown file has YAML front matter defining metadata (layout, title, breadcrumb, keyPoints, etc).

### 2. STRUCTURE
Templates in `src/_includes/layouts/`:
- `base.njk` - Core HTML wrapper
- `explainer.njk` - Explainer page template
- `essay.njk` - Essay page template
- (Other page-type templates)

Templates use Nunjucks and receive data from front matter.

### 3. COMPONENTS
Reusable UI elements in `src/_includes/components/`:
- `header.njk` - Navigation header
- `footer.njk` - Page footer
- (Other components as needed)

Each component is a single reusable block. No duplication.

### 4. DESIGN SYSTEM
Global CSS in `src/css/global.css`:
- CSS variables for colours, typography, spacing
- Base styles for HTML elements
- Utility classes for common patterns

Page-type specific CSS in `src/css/{type}.css` (if needed for special layouts).

---

## REQUEST TYPES & RESPONSES

### TYPE A: CONTENT CHANGE
**Example:** "Change the migraine wording" or "Fix the gout dosing"

**Response:**
1. Navigate to the relevant markdown file: `src/content/explainers/migraine.md`
2. Edit the content (leave front matter alone)
3. Rebuild: `npm run build`
4. Verify

**Action:** Modify content only. Do not change templates or CSS.

---

### TYPE B: METADATA CHANGE
**Example:** "Add migraine to Neurology category" or "Update the published date"

**Response:**
1. Edit the YAML front matter at top of the markdown file
2. Update the relevant field (breadcrumb, publishedDate, keyPoints, etc)
3. Rebuild: `npm run build`
4. Verify

**Action:** Modify front matter. Do not change the markdown body or code.

---

### TYPE C: COMPONENT/STYLE CHANGE
**Example:** "Make all clinical pearl boxes smaller" or "Change the accent colour"

**Response:**
1. For global changes: Edit `src/css/global.css`
2. For component-specific: Edit the relevant component or page-type CSS
3. Rebuild: `npm run build`
4. Verify across multiple pages

**Action:** Change the reusable implementation once. It propagates everywhere.

**Do NOT manually edit dozens of pages.**

---

### TYPE D: ARCHITECTURE CHANGE
**Example:** "I want an admin editor" or "Add a new page type"

**Response:**
1. Stop and classify as deliberate architectural project
2. Audit existing code
3. Define target architecture
4. Make smallest coherent change
5. Test thoroughly

**Action:** Treat as major project. Do not change architecture casually.

---

## WORKFLOW: WHEN USER REQUESTS A CHANGE

### Step 1: Classify
Is this:
- A content change? (EDIT FILE → REBUILD)
- A data change? (EDIT FRONT MATTER → REBUILD)
- A style change? (EDIT CSS → REBUILD)
- An architecture change? (PAUSE → PLAN)

### Step 2: Locate
- **Content**: `src/content/{type}/{slug}.md`
- **Data**: YAML front matter in same file
- **CSS**: `src/css/global.css` (global) or `src/css/{type}.css` (page-specific)
- **Templates**: `src/_includes/layouts/{type}.njk`

### Step 3: Understand existing
Before changing anything:
- Find the source of truth (existing implementation)
- Check if a similar solution already exists
- Identify potential impacts on other pages

### Step 4: Make minimal change
- **Smallest coherent change** that solves the problem
- Avoid unnecessary refactoring
- Preserve URLs and existing functionality

### Step 5: Build & verify
```bash
npm run build
```

Check for:
- Build errors or warnings
- Broken references
- Affected routes
- Navigation integrity
- Content hasn't disappeared

---

## COMMON TASKS

### Adding a new explainer topic

1. Create file: `src/content/explainers/topic-slug.md`

2. Add front matter:
```yaml
---
layout: explainer
title: Condition Name
breadcrumb: Specialty
description: One-line summary for search results
publishedDate: 2024-09-09
updatedDate: 2024-09-09
keyPoints:
  - label: Prevalence
    value: "~10%"
    note: Context or note
---
```

3. Write markdown content

4. Build: `npm run build`

Done. Page appears in collections automatically.

---

### Updating existing content

1. Find file in `src/content/{type}/`
2. Edit markdown (leave front matter alone unless updating dates)
3. Build: `npm run build`
4. Verify

---

### Changing a global style

1. Open `src/css/global.css`
2. Edit CSS rule or variable
3. Build: `npm run build`
4. Inspect multiple pages to verify change propagates

---

### Adding a new CSS variable

1. Add to `:root {}` in `src/css/global.css`
2. Use throughout site via `var(--name)`
3. Update dark mode equivalent in `body.dark {}`

Example:
```css
:root {
  --new-colour: #ABC123;
}
body.dark {
  --new-colour: #DEF456;
}
```

---

### Changing site metadata

1. Edit `src/_data/site.json`
2. Use in templates via `{{ site.propertyName }}`
3. Rebuild: `npm run build`

---

## TECHNICAL DETAILS

### Collections

Defined in `.eleventy.js`:

```javascript
eleventyConfig.addCollection("explainers", function(collection) {
  return collection.getFilteredByGlob("src/content/explainers/*.md")
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
});
```

Collections:
- `essays` - sorted by date (newest first)
- `explainers` - sorted alphabetically
- `guidelines` - no sort
- `calculators` - no sort
- `medications` - no sort
- `procedures` - no sort
- `handouts` - no sort
- `research` - no sort

To add a collection:
1. Add in `.eleventy.js`
2. Use in templates: `{{ collections.collectionName }}`

---

### Filters

Nunjucks filters defined in `.eleventy.js`:

```javascript
eleventyConfig.addNunjucksFilter("readableDate", dateObj => {
  return new Date(dateObj).toLocaleDateString('en-NZ', { ... });
});
```

Available filters:
- `readableDate` - Format date to "1 September 2024"
- `count` - Count items in array

To add a filter:
1. Define in `.eleventy.js`
2. Use in templates: `{{ variable | filterName }}`

---

### Layouts

All layouts inherit from `base.njk`:

```nunjucks
{% extends "layouts/base.njk" %}
{% block content %}
  Page-specific HTML here
{% endblock %}
```

Layouts receive:
- `title` - Page title
- `description` - Page description
- `content` - Rendered markdown body
- `collections` - All collections (for counts, lists, etc)
- `site` - Site metadata

---

### Front Matter Fields

Common fields:

```yaml
---
layout: explainer              # Required: template name
title: Condition Name          # Required: page title
breadcrumb: Specialty          # Category/specialty
description: Summary text      # For search results
publishedDate: 2024-09-09      # ISO date
updatedDate: 2024-09-09        # Last update date
keyPoints:                      # Page-type specific
  - label: Key
    value: Data
    note: Context
---
```

Extend as needed per page type. Avoid hardcoding in templates.

---

## DEBUGGING

### Build errors

```bash
npm run debug
```

Shows verbose output. Check for:
- YAML syntax errors (missing colons, quotes)
- File not found errors
- Template syntax issues (Nunjucks)

---

### Page doesn't appear

Check:
1. File is in correct `src/content/{type}/` directory
2. Layout name matches an existing template in `src/_includes/layouts/`
3. YAML front matter is valid (use YAML validator)
4. File is saved

---

### Styling broken

Check:
1. CSS file is in `src/css/`
2. CSS syntax is valid (missing semicolons, unmatched braces)
3. CSS class names match template HTML
4. Browser dev tools show what CSS is actually applied

---

### Build succeeds but page has old content

1. Check that file you edited was the right file
2. Clear browser cache (or hard refresh Ctrl+Shift+R)
3. Check `dist/` folder has been regenerated (check file date)

---

## CRITICAL RULES

### NEVER:
- Delete a file without verifying it's unused
- Change URLs without providing redirects
- Hardcode data (dates, counts, categories) that can be derived
- Add duplicate components with similar names
- Introduce new frameworks without necessity
- Turn straightforward HTML into abstractions
- Use `!important` in CSS without careful consideration
- Copy-paste code instead of creating reusable components
- Redesign the site without explicit request

### ALWAYS:
- Keep content separate from code
- Make changes in the source of truth once
- Preserve existing URLs
- Test before declaring done
- Check that added content actually appears
- Run the full build before marking complete
- Inspect multiple pages if changing a global style

---

## FILE CLEANUP

When you discover unused files:

1. Confirm it's unused (search all references)
2. Confirm its content is preserved elsewhere
3. Confirm no route depends on it
4. THEN delete it

Never delete speculatively.

---

## WHEN YOU FIND A MESS

If you discover:
- Duplicated code
- Conflicting CSS
- Multiple implementations of the same component
- Inconsistent page structures
- Obsolete files

**Tell the owner briefly.** Distinguish between:
- "This needs fixing now" (breaks functionality)
- "This could be cleaned up later" (technical debt)

Do not turn every imperfection into a refactoring project.

---

## PERFORMANCE CHECKLIST

After significant changes:
- Build completes without errors
- All affected pages load
- Styles render correctly
- Navigation works
- Dark mode toggle works (if included)
- Collections update correctly
- No broken internal links

---

## DEVELOPMENT BEHAVIOUR

### Do NOT interpret every request as permission to change architecture

If user asks: "Change this heading" → Change the heading.
If user asks: "Add a paragraph" → Add the paragraph.
If user asks: "Make this look better" → Modify the reusable implementation.

Only perform architectural changes when:
1. User explicitly asks
2. Existing architecture prevents functionality
3. Change clearly reduces long-term complexity

---

### Do NOT blindly refactor

If you find messy code:
1. Understand why it exists
2. Evaluate risk of change
3. Make smallest coherent improvement
4. Test thoroughly

Don't rewrite working code without reason.

---

## SUCCESS METRIC

Ask yourself before finishing:

**"If the owner wanted to add another 100 clinical topics, would this change make that easier or harder?"**

If harder: reconsider.

The goal is not just to make today's site work. The goal is to create a stable publishing system that can grow to hundreds or thousands of clinical resources without becoming increasingly difficult to maintain.

---

## FINAL PRINCIPLE

Working Diagnosis should behave like a **publishing system**, not a collection of individually coded webpages.

Claude maintains the **engine**.  
The owner maintains the **content**.

**Protect that separation at all times.**
