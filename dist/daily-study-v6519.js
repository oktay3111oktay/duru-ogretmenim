/* V6.51.9: Ana sayfa GDS etiketi ve cihazlar arası günlük çalışma sayacı. */
(() => {
  'use strict';
  const FIELD = 'dailyStudyV6519';
  const DEVICE_KEY = 'duru_sync_device_v646';
  const pad = value => String(value).padStart(2, '0');
  const dayKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const nowIso = () => new Date().toISOString();
  const makeId = () => globalThis.crypto?.randomUUID?.() || `daily-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const deviceId = () => {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = makeId();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  };

  function ensureToday(save = false) {
    const today = dayKey();
    const old = state[FIELD] && typeof state[FIELD] === 'object' ? state[FIELD] : {};
    if (old.day !== today) {
      const active = old.active === true;
      state[FIELD] = {day: today, active, startedAt: active ? nowIso() : null, stoppedAt: null, updatedAt: nowIso(), segments: {}};
      if (save) persist();
    } else {
      old.segments = old.segments && typeof old.segments === 'object' ? old.segments : {};
      old.active = old.active === true;
      state[FIELD] = old;
    }
    return state[FIELD];
  }

  function recordAnswer(question, selected, phase) {
    const daily = ensureToday(true);
    if (!daily.active || !question || selected == null) return;
    const id = deviceId(), courseName = String(question.c || question.sourceCourseId || course || 'Diğer');
    const segment = daily.segments[id] && daily.segments[id].day === daily.day
      ? daily.segments[id]
      : {day: daily.day, total: 0, correct: 0, wrong: 0, byCourse: {}, wrongDetails: [], updatedAt: ''};
    segment.wrongDetails = Array.isArray(segment.wrongDetails) ? segment.wrongDetails : [];
    const correct = String(selected) === String(question.answer);
    segment.total = Number(segment.total || 0) + 1;
    segment.correct = Number(segment.correct || 0) + (correct ? 1 : 0);
    segment.wrong = Number(segment.wrong || 0) + (correct ? 0 : 1);
    const row = segment.byCourse[courseName] || {total: 0, correct: 0, wrong: 0};
    row.total += 1;
    row.correct += correct ? 1 : 0;
    row.wrong += correct ? 0 : 1;
    segment.byCourse[courseName] = row;
    if (!correct) {
      const topicIndex = Number.isInteger(Number(question.t)) ? Number(question.t) : Number(topic);
      segment.wrongDetails.push({
        id: makeId(), loggedAt: nowIso(), course: courseName,
        topic: topics?.[courseName]?.[topicIndex]?.[0] || `Konu ${topicIndex + 1}`,
        test: session?.kind === 'school' ? 'Okul Testi' : session?.kind === 'extra' ? 'Ekstra Test' : session?.kind === 'repeat' ? 'GTT' : 'Konu Testi',
        phase: String(phase || ''), prompt: String(question.prompt || ''),
        options: Array.isArray(question.options) ? question.options.map(String) : [],
        chosen: String(selected), answer: String(question.answer || ''), explain: String(question.explain || ''),
        visualUrl: String(question.visualUrl || ''), sourceLabel: String(question.sourceLabel || question.privateSource?.label || '')
      });
    }
    segment.updatedAt = nowIso();
    segment.lastPhase = phase;
    daily.segments[id] = segment;
    daily.updatedAt = segment.updatedAt;
    persist();
  }

  function summary() {
    const daily = ensureToday(true), result = {total: 0, correct: 0, wrong: 0, byCourse: {}, wrongDetails: []};
    Object.values(daily.segments || {}).filter(segment => segment?.day === daily.day).forEach(segment => {
      result.total += Number(segment.total || 0);
      result.correct += Number(segment.correct || 0);
      result.wrong += Number(segment.wrong || 0);
      Object.entries(segment.byCourse || {}).forEach(([name, values]) => {
        const row = result.byCourse[name] || {total: 0, correct: 0, wrong: 0};
        row.total += Number(values.total || 0);
        row.correct += Number(values.correct || 0);
        row.wrong += Number(values.wrong || 0);
        result.byCourse[name] = row;
      });
      result.wrongDetails.push(...(Array.isArray(segment.wrongDetails) ? segment.wrongDetails : []));
    });
    result.wrongDetails.sort((a, b) => String(a.loggedAt).localeCompare(String(b.loggedAt)));
    if (result.wrongDetails.length !== result.wrong) result.wrong = result.wrongDetails.length;
    return {daily, ...result};
  }

  function statsMarkup() {
    const data = summary();
    const known = (courses || []).map(item => item[0]);
    const names = [...known.filter(name => data.byCourse[name]), ...Object.keys(data.byCourse).filter(name => !known.includes(name))];
    const rows = names.length ? names.map(name => {
      const row = data.byCourse[name], icon = (courses || []).find(item => item[0] === name)?.[1] || '📘';
      return `<div class="daily-course-row-v6519"><strong>${icon} ${esc(typeof displayName === 'function' ? displayName(name) : name)}</strong><span>${row.total} soru</span><span class="daily-correct-v6519">${row.correct} doğru</span><span class="daily-wrong-v6519">${row.wrong} yanlış</span></div>`;
    }).join('') : '<p class="muted">Başla düğmesine bastıktan sonra çözülen sorular burada görünecek.</p>';
    return `<div class="daily-summary-v6519"><div><b>${data.total}</b><span>Toplam</span></div><div class="daily-correct-v6519"><b>${data.correct}</b><span>Doğru</span></div><button type="button" class="daily-wrong-v6519 daily-wrong-button-v6520" onclick="openDailyWrongsV6520()" ${data.wrong ? '' : 'disabled'}><b>${data.wrong}</b><span>Yanlış · Gör</span></button></div><div class="daily-course-list-v6519">${rows}</div>`;
  }

  function wrongMarkup() {
    const data = summary();
    if (!data.wrongDetails.length) return '<p class="muted">Bugün kaydedilmiş yanlış cevap yok.</p>';
    return data.wrongDetails.map((row, index) => `<article class="daily-wrong-card-v6520"><div class="row between"><strong>${esc(row.course)} · ${esc(row.topic)}</strong><span>${index + 1}/${data.wrongDetails.length}</span></div><p class="muted">${esc(row.test)}</p><h3>${esc(row.prompt)}</h3>${row.visualUrl ? `<img src="${esc(row.visualUrl)}" alt="${esc(row.sourceLabel || 'Sorunun kaynak görseli')}">` : ''}<ol type="A">${row.options.map(option => `<li class="${option === row.answer ? 'daily-answer-correct-v6520' : option === row.chosen ? 'daily-answer-wrong-v6520' : ''}">${esc(option)}</li>`).join('')}</ol><p class="daily-answer-wrong-v6520"><b>Verilen cevap:</b> ${esc(row.chosen)}</p><p class="daily-answer-correct-v6520"><b>Doğru cevap:</b> ${esc(row.answer)}</p>${row.explain ? `<p><b>Açıklama:</b> ${esc(row.explain)}</p>` : ''}</article>`).join('');
  }

  window.openDailyWrongsV6520 = function() {
    document.getElementById('daily-wrongs-modal-v6520')?.remove();
    const modal = document.createElement('div');
    modal.id = 'daily-wrongs-modal-v6520';
    modal.className = 'daily-wrongs-modal-v6520';
    modal.innerHTML = `<div class="daily-wrongs-inner-v6520" role="dialog" aria-modal="true" aria-label="Bugünün yanlış cevapları"><div class="row between"><h2>Bugünün yanlış cevapları</h2><button type="button">✕ Kapat</button></div><p class="muted">Bu kayıtlar gün değiştiğinde otomatik silinir.</p>${wrongMarkup()}</div>`;
    modal.querySelector('button').onclick = () => modal.remove();
    document.body.appendChild(modal);
  };

  function updateHome() {
    if (typeof view !== 'undefined' && view !== 'home') return;
    const gds = document.querySelector('.teacher-gtt-card');
    if (gds && !gds.dataset.gdsV6519) {
      gds.dataset.gdsV6519 = '1';
      gds.innerHTML = '<span>🧠</span>GDS<div class="muted small">Genel Değerlendirme Testi</div>';
    }

    const hero = document.querySelector('.teacher-home-hero');
    const avatarBox = hero?.children?.[1];
    if (avatarBox) {
      let toggle = document.getElementById('daily-toggle-v6519');
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.id = 'daily-toggle-v6519';
        toggle.type = 'button';
        toggle.onclick = () => window.toggleDailyStudyV6519();
        const mood = avatarBox.querySelector('.home-mood-label');
        if (mood) mood.insertAdjacentElement('afterend', toggle); else avatarBox.prepend(toggle);
      }
      const daily = ensureToday(true);
      toggle.className = `daily-toggle-v6519 ${daily.active ? 'active' : ''}`;
      toggle.textContent = daily.active ? 'Bitir' : 'Başla';
      toggle.setAttribute('aria-pressed', String(daily.active));
      toggle.setAttribute('aria-label', daily.active ? 'Günlük soru kaydını bitir' : 'Günlük soru kaydını başlat');
    }

    const toolsHeading = [...document.querySelectorAll('#app h2')].find(node => /Araçlar/.test(node.textContent || ''));
    const toolsCard = toolsHeading?.parentElement, actions = toolsCard?.querySelector('.teacher-parent-actions');
    if (toolsCard && actions) {
      let button = document.getElementById('daily-tool-v6519');
      if (!button) {
        button = document.createElement('button');
        button.id = 'daily-tool-v6519';
        button.type = 'button';
        button.className = 'daily-tool-v6519';
        button.textContent = 'Günlük Çalışma';
        button.onclick = () => window.openDailyStudyV6519();
        actions.appendChild(button);
      }
      let panel = document.getElementById('daily-panel-v6519');
      if (!panel) {
        panel = document.createElement('section');
        panel.id = 'daily-panel-v6519';
        panel.className = 'daily-panel-v6519';
        panel.hidden = true;
        actions.insertAdjacentElement('afterend', panel);
      }
      panel.innerHTML = statsMarkup();
    }
  }

  window.toggleDailyStudyV6519 = function() {
    const daily = ensureToday(true);
    daily.active = !daily.active;
    if (daily.active) daily.startedAt = nowIso(); else daily.stoppedAt = nowIso();
    daily.updatedAt = nowIso();
    persist();
    updateHome();
  };

  window.openDailyStudyV6519 = function() {
    const panel = document.getElementById('daily-panel-v6519');
    if (!panel) return;
    panel.innerHTML = statsMarkup();
    panel.hidden = !panel.hidden;
  };

  const nextBefore = window.nextQuestion;
  if (typeof nextBefore === 'function') window.nextQuestion = nextQuestion = function() {
    if (chosenAnswer !== null && session?.qs?.[session.idx]) recordAnswer(session.qs[session.idx], chosenAnswer, 'test');
    return nextBefore.apply(this, arguments);
  };

  const repairBefore = window.repairChoose;
  if (typeof repairBefore === 'function') window.repairChoose = repairChoose = function(index) {
    const question = session?.pending?.[0], selected = question?.options?.[index];
    if (question && selected != null) recordAnswer(question, selected, 'repair');
    return repairBefore.apply(this, arguments);
  };

  const homeBefore = window.home;
  if (typeof homeBefore === 'function') window.home = home = function() {
    const result = homeBefore.apply(this, arguments);
    updateHome();
    setTimeout(updateHome, 0);
    return result;
  };

  ensureToday(true);
  if (typeof view !== 'undefined' && view === 'home') updateHome();
  setInterval(() => {
    const before = state[FIELD]?.day;
    ensureToday(true);
    if (before !== state[FIELD]?.day && typeof view !== 'undefined' && view === 'home') updateHome();
  }, 30000);

  window.__DURU_DAILY_V6519_TEST__ = {dayKey, ensureToday, recordAnswer, summary, updateHome, wrongMarkup};
})();
