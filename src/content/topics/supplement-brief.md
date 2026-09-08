---
layout: research
title: Supplement Brief - Evidence-graded
category: clinical
publishedDate: 2026-01-01
updatedDate: 2026-01-01
draft: false
---

### ${escapeHtml(s.name)}
        ${escapeHtml(s.alias || '')}
        ${escapeHtml(s.summary)}

          **Goals** · ${escapeHtml(goalsStr)}
          **Dose** · ${escapeHtml(s.dose || '-')}
          **Cost** · ${escapeHtml(s.cost || '-')}
          ${s.vegan ? '**Vegan** · yes' : (s.vegetarian ? '**Vegetarian** · yes' : '**Animal-derived**')}

        ${escapeHtml(s.cost || '')}
        ${sideTags}
      
    `;
    card.addEventListener('click', () => selectSupplement(s.id));
    els.results.appendChild(card);
  }
}

/* ----- Detail panel ----- */
function selectSupplement(id){
  state.selected = id;
  const s = SUPPLEMENTS.find(x => x.id === id);
  if(!s){ closeDetail(); return; }
  els.layout.classList.add('with-detail');
  els.detail.classList.remove('hidden');

  // Active cautions matching state.conditions
  const activeCautions = [];
  for(const c of state.conditions){
    if(s.cautions && s.cautions[c]){
      const label = (CONDITIONS.find(([k]) => k === c) || [c,c])[1];
      activeCautions.push({ key:c, label, text:s.cautions[c] });
    }
  }

  // Build flags
  const flags = [];
  if(s.vegan) flags.push(`Vegan`);
  else if(s.vegetarian) flags.push(`Vegetarian`);
  if(s.cost) flags.push(`${escapeHtml(s.cost)}`);
  for(const g of s.goals){
    const found = GOALS.find(([k]) => k === g);
    if(found) flags.push(`${escapeHtml(found[1])}`);
  }

  // Banners
  const banners = [];
  if(s.grade === 'X'){
    banners.push(`Marked **X** - insufficient evidence or net harm signal in commercial use. Listed here for completeness, not endorsement.`);
  }
  if(activeCautions.length){
    banners.push(`**Heads up** for your selected situations:
${activeCautions.map(c => `· **${escapeHtml(c.label)}:** ${escapeHtml(c.text)}`).join('
')}`);
  }
  if(state.conditions.has('pregnancy') && (s.avoid && s.avoid.pregnancy)){
    banners.push(`Avoid in pregnancy.`);
  }

  const pearlsHtml = (s.pearls || []).map(p => `- ${escapeHtml(p)}`).join('');
  const formsHtml  = (s.forms  || []).map(f => `- ${escapeHtml(f)}`).join('');
  const refsHtml   = (s.refs   || []).map(r => `- ${escapeHtml(r)}`).join('');

  els.detailContent.innerHTML = `
    ## ${escapeHtml(s.name)}
    ${escapeHtml(s.alias || '')}

      ${s.grade}
      
        **${escapeHtml(s.grade)} · evidence grade**
        ${escapeHtml(GRADE_LABEL[s.grade] || '')}

    ${flags.join('')}
    ${banners.join('')}

      #### Summary
      ${escapeHtml(s.summary)}

      #### Mechanism
      ${escapeHtml(s.mechanism || '-')}

      #### Dose & timing
      
        Typical dose${escapeHtml(s.dose || '-')}
        Timing${escapeHtml(s.timing || '-')}

      #### Forms
      ${formsHtml || '- -'}

      #### Practical pearls
      ${pearlsHtml || '- -'}

    ${s.notes ? `#### Notes${escapeHtml(s.notes)}
` : ''}

      #### Cautions & interactions
      
        ${Object.entries(s.cautions || {}).length
          ? Object.entries(s.cautions).map(([k,v]) => {
              const label = (CONDITIONS.find(([kk]) => kk === k) || [k,k])[1];
              const cls = state.conditions.has(k) ? 'warn' : '';
              return `**${escapeHtml(label)}:** ${escapeHtml(v)}`;
            }).join('')
          : '- None of note in healthy adults.'}
        ${Object.entries(s.avoid || {}).length
          ? Object.entries(s.avoid).map(([k]) => {
              const label = (CONDITIONS.find(([kk]) => kk === k) || [k,k])[1];
              return `Avoid in: **${escapeHtml(label)}**`;
            }).join('')
          : ''}

      #### Key evidence (illustrative)
      ${refsHtml || '- -'}

      #### Honest read
      ${escapeHtml(honestRead(s))}

  `;

  renderResults(filterAndRank()); // re-mark selected card
  els.detail.scrollTop = 0;
}

function closeDetail(){
  state.selected = null;
  els.detail.classList.add('hidden');
  els.layout.classList.remove('with-detail');
  renderResults(filterAndRank());
}

function honestRead(s){
  // A short, registrar-tone "what would I actually do" line per grade
  if(s.grade === 'A') return 'Worth taking if the indication fits. Most of these earn their place.';
  if(s.grade === 'B') return 'Reasonable trial, give it 6–8 weeks, then judge honestly.';
  if(s.grade === 'C') return 'Plausible but underpowered. Don’t spend much money before checking sleep, diet, exercise, and stress.';
  if(s.grade === 'D') return 'Mostly marketing. Diet first; spend money on protein and vegetables.';
  if(s.grade === 'X') return 'Listed for completeness. The evidence isn’t there.';
  return '';
}

/* ----- Filter summary line ----- */
function describeFilters(){
  const parts = [];
  if(state.goals.size){
    const names = Array.from(state.goals)
      .map(g => (GOALS.find(([k]) => k === g) || [g,g])[1])
      .join(', ');
    parts.push(`Goal: ${names}`);
  }
  if(state.conditions.size){
    const names = Array.from(state.conditions)
      .map(c => (CONDITIONS.find(([k]) => k === c) || [c,c])[1])
      .join(', ');
    parts.push(`Flagged: ${names}`);
  }
  if(state.diets.size){
    const names = Array.from(state.diets)
      .map(d => (DIETS.find(([k]) => k === d) || [d,d])[1])
      .join(', ');
    parts.push(`Diet: ${names}`);
  }
  return parts.length ? parts.join('  ·  ') : 'Showing all supplements, ranked by evidence.';
}

/* ----- Master render ----- */
function render(){
  const items = filterAndRank();
  renderResults(items);
  els.count.textContent       = `${items.length} shown`;
  els.filterCount.textContent = `${items.length} entries`;
  els.filterSummary.textContent = describeFilters();

  if(state.selected && !items.find(x => x.id === state.selected)){
    closeDetail();
  }
}

/* ----- Utilities ----- */
function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&','':'>','"':'"',"'":'&#39;'}[c]));
}

/* ----- Wire up ----- */
els.clearBtn.addEventListener('click', () => {
  state.goals.clear(); state.conditions.clear(); state.diets.clear();
  renderChips(els.goalChips, GOALS, state.goals, 'goal');
  renderChips(els.condChips, CONDITIONS, state.conditions, 'caution');
  renderChips(els.dietChips, DIETS, state.diets, 'diet');
  render();
});
els.sortSelect.addEventListener('change', e => { state.sort = e.target.value; render(); });
els.closeDetail.addEventListener('click', closeDetail);

document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && state.selected) closeDetail();
});

/* ----- Boot ----- */
renderChips(els.goalChips, GOALS, state.goals, 'goal');
renderChips(els.condChips, CONDITIONS, state.conditions, 'caution');
renderChips(els.dietChips, DIETS, state.diets, 'diet');
render();