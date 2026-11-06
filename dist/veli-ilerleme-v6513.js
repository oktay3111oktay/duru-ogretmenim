/* Veli panelindeki ilerleme özeti. Var olan öğrenci kayıtlarını yalnızca okur. */
(() => {
  'use strict';
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const progress = () => courses.map(([name, icon]) => {
    const count = (topics[name] || []).length;
    const api = window.__DURU_V651_TEST__;
    const turkish = name === 'Türkçe' ? window.__DURU_TURKISH_V6520_TEST__ : null;
    if (turkish) {
      const indexes = Array.from({length: count}, (_, index) => index);
      const testCompleted = indexes.filter(index => turkish.isDone(index)).length;
      const completed = indexes.filter(index => turkish.fullyDone(index)).length;
      const schoolRequired = indexes.reduce((sum, index) => sum + turkish.schoolParts(index).length, 0);
      const schoolCompleted = indexes.reduce((sum, index) => sum + turkish.schoolDoneCount(index), 0);
      const schoolPending = indexes.reduce((sum, index) => sum + (turkish.isDone(index) ? Math.max(0, turkish.schoolParts(index).length - turkish.schoolDoneCount(index)) : 0), 0);
      const gtt = Object.keys(state.generalPassed || {}).filter(key => key.startsWith(name + '|') && !!state.generalPassed[key]).length;
      const newQuestions = window.__DURU_V651_TEST__?.wrongPool(name).length || 0;
      const legacyMebTotal = turkish.legacyTopics?.length || 0;
      const legacyMebCompleted = Array.from({length: legacyMebTotal}, (_, index) => !!state.done[`${name}|${index}`]).filter(Boolean).length;
      const groups = [...new Set(turkish.curriculum.map(topic => topic.group))].map(group => {
        const groupIndexes = turkish.groupIndexes(group);
        const groupCompleted = groupIndexes.filter(index => turkish.fullyDone(index)).length;
        return {name: group, count: groupIndexes.length, completed: groupCompleted,
          percent: groupIndexes.length ? Math.round(100 * groupCompleted / groupIndexes.length) : 0};
      });
      return {name, icon, count, testCompleted, completed, schoolRequired, schoolCompleted, schoolPending, gtt, newQuestions, legacyMebTotal, legacyMebCompleted, groups,
        percent: count ? Math.round(100 * completed / count) : 0,
        testPercent: count ? Math.round(100 * testCompleted / count) : 0,
        legacyMebPercent: legacyMebTotal ? Math.round(100 * legacyMebCompleted / legacyMebTotal) : 0};
    }
    const testCompleted = Array.from({length: count}, (_, index) => index)
      .filter(index => !!state.done[name + '|' + index]).length;
    const completed = Array.from({length: count}, (_, index) => index)
      .filter(index => api?.topicReadyForNext ? api.topicReadyForNext(name, index) : !!state.done[name + '|' + index]).length;
    const schoolRequired = Array.from({length: count}, (_, index) => api?.schoolTestCount?.(name, index) || 0)
      .reduce((sum, value) => sum + value, 0);
    const schoolCompleted = Array.from({length: count}, (_, index) => api?.schoolTestCount?.(name, index) || 0)
      .reduce((sum, tests, index) => sum + Array.from({length: tests}, (_, testIndex) => api?.schoolTestDone?.(name, index, testIndex)).filter(Boolean).length, 0);
    const schoolPending = Array.from({length: count}, (_, index) => api?.schoolTestCount?.(name, index) || 0)
      .reduce((sum, tests, index) => sum + (state.done[name + '|' + index] ? Array.from({length: tests}, (_, testIndex) => api?.schoolTestDone?.(name, index, testIndex)).filter(done => !done).length : 0), 0);
    const gtt = Object.keys(state.generalPassed || {})
      .filter(key => key.startsWith(name + '|') && !!state.generalPassed[key]).length;
    const newQuestions = window.__DURU_V651_TEST__?.wrongPool(name).filter(item => item.newInV6513).length || 0;
    return {name, icon, count, testCompleted, completed, schoolRequired, schoolCompleted, schoolPending, gtt, newQuestions,
      percent: count ? Math.round(100 * completed / count) : 0,
      testPercent: count ? Math.round(100 * testCompleted / count) : 0};
  });
  function removeLegacyCourseDetails() {
    document.querySelectorAll('#app > .card').forEach(card => {
      if ([...card.querySelectorAll('.small')].some(node => /ilk deneme|kaydedilen hatalar/i.test(node.textContent || ''))) card.remove();
    });
  }
  function decorate() {
    removeLegacyCourseDetails();
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
    panel.innerHTML = '<h2>📈 Ders ilerlemesi</h2><ul class="veli-progress-help"><li>Ana oran, Konu Testi ile varsa Okul Testi tamamlanan konuları gösterir.</li><li>Ekstra Testler ilerleme kilidini etkilemez.</li><li>Konu testlerindeki ilerleme ikinci çubukta ayrıca gösterilir.</li><li>Türkçenin önceki MEB metin kayıtları, yeni konu yapısına karıştırılmadan ayrı bir çubukta korunur.</li></ul>' +
      progress().map(row => `<div class="veli-progress-row"><div class="veli-progress-head"><strong>${row.icon} ${escapeHtml(row.name)}</strong><b>${row.percent}% tamamlandı</b></div><div class="veli-progress-track" role="progressbar" aria-label="${escapeHtml(row.name)} tamamlanma oranı" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.percent}"><span style="width:${row.percent}%"></span></div>${row.groups?.length ? `<div class="veli-turkish-groups"><strong>Bağımsız Türkçe kaynak dersleri</strong>${row.groups.map(group => `<div class="veli-group-row"><div><span>${escapeHtml(group.name)}</span><b>${group.completed}/${group.count} · %${group.percent}</b></div><div class="veli-progress-track test-progress" role="progressbar" aria-label="${escapeHtml(group.name)} tamamlanma oranı" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${group.percent}"><span style="width:${group.percent}%"></span></div></div>`).join('')}</div>` : ''}<div class="veli-progress-subhead"><span>Konu testleri</span><b>${row.testPercent}%</b></div><div class="veli-progress-track test-progress" role="progressbar" aria-label="${escapeHtml(row.name)} konu testi ilerlemesi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.testPercent}"><span style="width:${row.testPercent}%"></span></div>${row.legacyMebTotal ? `<div class="veli-progress-subhead"><span>Önceki MEB metin kayıtları</span><b>${row.legacyMebPercent}%</b></div><div class="veli-progress-track test-progress" role="progressbar" aria-label="${escapeHtml(row.name)} önceki MEB metin ilerlemesi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.legacyMebPercent}"><span style="width:${row.legacyMebPercent}%"></span></div>` : ''}<ul class="veli-progress-details"><li>${row.completed}/${row.count} konu tamamen tamamlandı</li><li>${row.testCompleted}/${row.count} konu testi bitti</li><li>${row.schoolCompleted}/${row.schoolRequired} zorunlu Okul Testi tamamlandı</li><li>${row.schoolPending} Okul Testi bekliyor</li><li>${row.gtt} konu için GTT tamamlandı</li><li>${row.newQuestions} yeni kaynak sorusu GTT'de bekliyor</li>${row.legacyMebTotal ? `<li>${row.legacyMebCompleted}/${row.legacyMebTotal} önceki MEB metin kaydı korundu</li>` : ''}</ul></div>`).join('');
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
  window.__DURU_PROGRESS_V6513_TEST__ = { progress, decorate, removeLegacyCourseDetails };
})();
