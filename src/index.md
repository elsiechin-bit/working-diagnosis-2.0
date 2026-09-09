---
layout: base
title: Home
---

<div class="wrap">
  <div class="hero">
    <h1>Working <em>Diagnosis</em></h1>
    <p style="font-size: 18px; color: var(--ink-soft); line-height: 1.6; max-width: 600px; margin-top: 14px;">A clinical reference website for general practitioners and primary care clinicians in Aotearoa New Zealand.</p>
    <div class="hero-search" style="margin-top: 20px; display: flex; align-items: center; gap: 10px; border: 1px solid var(--border); border-radius: 0; padding: 10px 14px; background: var(--bg2); max-width: 480px; cursor: text;" onclick="document.querySelector('.wd-search-input').focus()">
      <span class="ico">🔍</span>
      <input class="wd-search-input" type="text" placeholder="Search clinical topics..." style="flex: 1; border: none; background: transparent; outline: none; font-family: 'IBM Plex Mono', monospace; font-size: .85rem; color: var(--ink); padding: 0;">
    </div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 48px 0;">
    <div style="border: 1px solid var(--border); border-radius: 2px; padding: 24px; background: var(--surface);">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">Essays</div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 28px; color: var(--accent-ink); line-height: 1.1;">{{ collections.essays | count }}</div>
      <p style="font-size: 13px; color: var(--ink-soft); margin: 8px 0 0; line-height: 1.45;">Field notes on clinical practice, evidence and systems</p>
    </div>

    <div style="border: 1px solid var(--border); border-radius: 2px; padding: 24px; background: var(--surface);">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">Explainers</div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 28px; color: var(--accent-ink); line-height: 1.1;">{{ collections.explainers | count }}</div>
      <p style="font-size: 13px; color: var(--ink-soft); margin: 8px 0 0; line-height: 1.45;">Concise clinical reference for common conditions</p>
    </div>

    <div style="border: 1px solid var(--border); border-radius: 2px; padding: 24px; background: var(--surface);">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">Guidelines</div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 28px; color: var(--accent-ink); line-height: 1.1;">{{ collections.guidelines | count }}</div>
      <p style="font-size: 13px; color: var(--ink-soft); margin: 8px 0 0; line-height: 1.45;">Comparison of evidence-based clinical guidelines</p>
    </div>

    <div style="border: 1px solid var(--border); border-radius: 2px; padding: 24px; background: var(--surface);">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">Calculators</div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 28px; color: var(--accent-ink); line-height: 1.1;">{{ collections.calculators | count }}</div>
      <p style="font-size: 13px; color: var(--ink-soft); margin: 8px 0 0; line-height: 1.45;">Clinical decision support tools</p>
    </div>

    <div style="border: 1px solid var(--border); border-radius: 2px; padding: 24px; background: var(--surface);">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">Handouts</div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 28px; color: var(--accent-ink); line-height: 1.1;">{{ collections.handouts | count }}</div>
      <p style="font-size: 13px; color: var(--ink-soft); margin: 8px 0 0; line-height: 1.45;">Patient handouts and resources</p>
    </div>

    <div style="border: 1px solid var(--border); border-radius: 2px; padding: 24px; background: var(--surface);">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;">Procedures</div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 28px; color: var(--accent-ink); line-height: 1.1;">{{ collections.procedures | count }}</div>
      <p style="font-size: 13px; color: var(--ink-soft); margin: 8px 0 0; line-height: 1.45;">Minor surgical procedures and techniques</p>
    </div>
  </div>

  <div style="border-top: 1px solid var(--border); padding: 32px 0; margin-top: 48px;">
    <h2 style="font-size: 22px; margin-bottom: 16px;">About Working Diagnosis</h2>
    <p style="font-size: 15px; line-height: 1.65; color: var(--ink-soft); max-width: 800px;">Working Diagnosis is a clinical reference resource built for general practitioners in Aotearoa New Zealand. It contains essays on clinical evidence and practice, structured clinical explainers, guideline comparisons, calculators, patient handouts and procedural guides.</p>
    <p style="font-size: 15px; line-height: 1.65; color: var(--ink-soft); max-width: 800px; margin-top: 12px;">By {{ site.author.name }}, {{ site.author.role }}, {{ site.author.location }}.</p>
  </div>
</div>
