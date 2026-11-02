/* Veli panelindeki ilerleme özeti. Var olan öğrenci kayıtlarını yalnızca okur. */
(() => {
  'use strict';
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const progress = () => courses.map(([name, icon]) => {
    const count = (topics[name] || []).length;
    const completed = Array.from({length: count}, (_, index) => index)
      .filter(index => !!state.done[name + '|' + index] && !state.requiredExtraV651?.[name + '|' + index]?.required).length;
    const requiredExtra = Array.from({length: count}, (_, index) => index)
      .filter(index => !!state.requiredExtraV651?.[name + '|' + index]?.required).length;
    const gtt = Object.keys(state.generalPassed || {})
      .filter(key => key.startsWith(name + '|') && !!state.generalPassed[key]).length;
    const newQuestions = window.__DURU_V651_TEST__?.wrongPool(name).filter(item => item.newInV6513).length || 0;
    return {name, icon, count, completed, requiredExtra, gtt, newQuestions,
      percent: count ? Math.round(100 * completed / count) : 0};
  });
  function decorate() {
    const actions = document.querySelector('.teacher-parent-card .teacher-parent-actions');
    if (!actions || document.getElementById('veli-ilerleme-v6513')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pastel-blue';
    button.textContent = '📈 İlerleme';
    button.setAttribute('aria-controls', 'veli-ilerleme-v6513');
    button.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('section');
    panel.id = 'veli-ilerleme-v6513';
    panel.className = 'card';
    panel.hidden = true;
    panel.innerHTML = '<h2>📈 Ders ilerlemesi</h2><p>Oran, konu testi biten ve zorunlu Ekstra Testi beklemeyen konuların dersin tüm konularına bölümüdür. İsteğe bağlı GTT ve kaynak soruları ayrıca gösterilir.</p>' +
      progress().map(row => `<div class="veli-progress-row"><div class="veli-progress-head"><strong>${row.icon} ${escapeHtml(row.name)}</strong><b>${row.percent}%</b></div><div class="veli-progress-track" role="progressbar" aria-label="${escapeHtml(row.name)} ilerlemesi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.percent}"><span style="width:${row.percent}%"></span></div><small>${row.completed}/${row.count} konu tamamlandı · ${row.requiredExtra} zorunlu ekstra test bekliyor · ${row.gtt} konu için GTT tamamlandı · ${row.newQuestions} yeni kaynak sorusu GTT'de bekliyor</small></div>`).join('');
    actions.appendChild(button);
    actions.closest('.teacher-parent-card').after(panel);
    button.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
    });
  }
  const before = window.parentView;
  if (typeof before === 'function') window.parentView = parentView = function() {
    const result = before.apply(this, arguments);
    decorate();
    return result;
  };
  if (typeof view !== 'undefined' && view === 'parent') decorate();
  window.__DURU_PROGRESS_V6513_TEST__ = { progress, decorate };
})();
