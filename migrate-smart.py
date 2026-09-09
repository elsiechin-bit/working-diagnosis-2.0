#!/usr/bin/env python3
"""
Smart HTML → Markdown migration with section detection and standardization
"""

import os
import re
import zipfile
from pathlib import Path

def extract_from_html(html_content):
    """Extract and intelligently structure HTML content"""
    try:
        # Extract title
        title_match = re.search(r'<title>([^<]+)', html_content)
        title = title_match.group(1).replace(' - WD', '').strip() if title_match else 'Untitled'
        
        # Extract body
        body_match = re.search(r'<div class="[^"]*-body">(.*?)(?=</div>\s*(?:</main|<footer))', html_content, re.DOTALL)
        if not body_match:
            body_match = re.search(r'<main[^>]*>(.*?)(?=</main>)', html_content, re.DOTALL)
        
        if not body_match:
            return None
        
        body_html = body_match.group(1)
        
        # Identify major sections (clinical structure)
        sections = {}
        
        # Look for common clinical section headers
        clinical_headers = [
            'diagnosis', 'treatment', 'management', 'overview', 'epidemiology',
            'pathophysiology', 'clinical features', 'investigations', 'prognosis',
            'complications', 'prevention', 'references', 'resources'
        ]
        
        for header in clinical_headers:
            # Find section with this header
            pattern = rf'<h2[^>]*>{header}[^<]*</h2>(.*?)(?=<h2|</div|$)'
            match = re.search(pattern, body_html, re.IGNORECASE | re.DOTALL)
            if match:
                section_content = match.group(1)
                sections[header.lower()] = section_content
        
        # If no sections found, treat whole body as overview
        if not sections:
            sections['overview'] = body_html
        
        # Convert HTML to markdown
        markdown_sections = {}
        for section_name, section_html in sections.items():
            # Headers
            section_html = re.sub(r'<h2[^>]*>([^<]+)</h2>', r'## \1', section_html)
            section_html = re.sub(r'<h3[^>]*>([^<]+)</h3>', r'### \1', section_html)
            section_html = re.sub(r'<h4[^>]*>([^<]+)</h4>', r'#### \1', section_html)
            
            # Lists
            section_html = re.sub(r'<ul[^>]*>', '', section_html)
            section_html = re.sub(r'</ul>', '', section_html)
            section_html = re.sub(r'<ol[^>]*>', '', section_html)
            section_html = re.sub(r'</ol>', '', section_html)
            section_html = re.sub(r'<li[^>]*>([^<]*)</li>', r'- \1', section_html)
            
            # Formatting
            section_html = re.sub(r'<(?:b|strong)[^>]*>([^<]+)</(?:b|strong)>', r'**\1**', section_html)
            section_html = re.sub(r'<em>([^<]+)</em>', r'*\1*', section_html)
            section_html = re.sub(r'<code>([^<]+)</code>', r'`\1`', section_html)
            
            # Paragraphs
            section_html = re.sub(r'</p>', '\n', section_html)
            section_html = re.sub(r'<p[^>]*>', '', section_html)
            
            # Remove tags
            section_html = re.sub(r'<br\s*/?>', '\n', section_html)
            section_html = re.sub(r'<[^>]+>', '', section_html)
            
            # Entities
            section_html = section_html.replace('&amp;', '&')
            section_html = section_html.replace('&lt;', '<')
            section_html = section_html.replace('&gt;', '>')
            section_html = section_html.replace('&quot;', '"')
            section_html = section_html.replace('&nbsp;', ' ')
            
            # Clean whitespace
            section_html = re.sub(r'\n\s*\n\s*\n+', '\n\n', section_html)
            section_html = section_html.strip()
            
            if section_html:
                markdown_sections[section_name] = section_html
        
        return {'title': title, 'sections': markdown_sections}
    except Exception as e:
        return None

def build_markdown(data, layout):
    """Build standardized markdown from extracted data"""
    title = data['title']
    sections = data['sections']
    
    # Standardized order
    section_order = ['overview', 'epidemiology', 'pathophysiology', 'clinical features', 
                    'diagnosis', 'investigations', 'treatment', 'management', 
                    'prognosis', 'complications', 'prevention', 'references']
    
    # Front matter
    front_matter = f"""---
layout: {layout}
title: {title}
category: clinical
publishedDate: 2026-01-01
updatedDate: 2026-01-01
draft: false
---

"""
    
    # Build body in standard order
    body_parts = []
    for section_name in section_order:
        if section_name in sections:
            content = sections[section_name]
            # Add section header if not already present
            if not content.startswith('#'):
                body_parts.append(f"\n## {section_name.title()}\n")
            body_parts.append(content)
    
    # Add any sections not in standard order
    for section_name, content in sections.items():
        if section_name not in section_order:
            body_parts.append(f"\n## {section_name.title()}\n")
            body_parts.append(content)
    
    body = '\n\n'.join(body_parts)
    
    return front_matter + body

def slugify(filename):
    name = Path(filename).stem
    for prefix in ['essay--', 'essay-', 'guideline-', 'med-', 'exp-', 'handout-', 'calculator-']:
        if name.startswith(prefix):
            name = name[len(prefix):]
    return name

def get_layout(folder_name):
    mapping = {
        'pages-essays': 'essay',
        'pages-explainers': 'explainer',
        'pages-guidelines': 'topic',
        'pages-calculators': 'calculator',
        'pages-medications': 'medication',
        'pages-procedures': 'procedure',
        'pages-handouts': 'handout',
        'pages-field-notes': 'essay',
        'pages-experiments': 'research',
    }
    return mapping.get(folder_name, 'topic')

# Main
zip_path = r"C:\Users\Li\Downloads\Working Diagnosis GP Website (5).zip"
output_base = r"src\content\topics"

if not os.path.exists(zip_path):
    print(f"ZIP file not found: {zip_path}")
    exit(1)

migrated = 0
failed = []

print("Smart migration with section detection...\n")

os.makedirs(output_base, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as zf:
    for item in zf.namelist():
        if not item.endswith('.html'):
            continue
        
        parts = item.split('/')
        folder = parts[0] if len(parts) > 1 else ''
        filename = parts[-1]
        
        if not folder.startswith('pages-'):
            continue
        
        try:
            html_content = zf.read(item).decode('utf-8', errors='ignore')
            data = extract_from_html(html_content)
            
            if not data:
                failed.append(filename)
                continue
            
            layout = get_layout(folder)
            slug = slugify(filename)
            
            # Build standardized markdown
            markdown = build_markdown(data, layout)
            
            # Write file
            out_file = os.path.join(output_base, f"{slug}.md")
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(markdown)
            
            migrated += 1
            
        except Exception as e:
            failed.append(f"{filename}: {str(e)}")

# Report
print(f"\n✓ Migrated: {migrated} files")
print(f"✗ Failed: {len(failed)}")
print(f"\nFiles in: {output_base}")
print("\nNext: git add src/content && git commit -m 'migration: standardized clinical content' && git push")
