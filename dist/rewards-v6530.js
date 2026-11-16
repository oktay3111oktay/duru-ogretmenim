/* V6.53.0: Gunluk calisma temelli Korebe odulleri. */
(() => {
  'use strict';

  const FIELD = 'blindMansBuffRewardsV6530';
  const SESSION_FIELD = '_blindMansBuffV6530';
  const IMAGE = './assets/korebe-reward-v6530.png';
  const api = window.__DURU_V651_TEST__;
  const pad = value => String(value).padStart(2, '0');
  const dayKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const nowIso = () => new Date().toISOString();
  const integer = value => Math.max(0, Math.floor(Number(value) || 0));
  const round = value => Math.round((Number(value) || 0) * 10000) / 10000;

  function freshDaily(day = dayKey()) {
    return { day, credit: 0, earned: 0, answered: 0, bonusAnswered: 0, completedTests: 0, updatedAt: nowIso() };
  }

  function ensureReward(save = false) {
    const old = state[FIELD] && typeof state[FIELD] === 'object' ? state[FIELD] : {};
    let changed = state[FIELD] !== old;
    old.version = 1;
    old.rights = integer(old.rights);
    old.used = integer(old.used);
    old.completions = old.completions && typeof old.completions === 'object' ? old.completions : {};
    if (!old.createdAt) { old.createdAt = nowIso(); changed = true; }
    if (!old.daily || typeof old.daily !== 'object' || old.daily.day !== dayKey()) {
      old.daily = freshDaily();
      changed = true;
    } else {
      old.daily.credit = Math.max(0, Number(old.daily.credit) || 0);
      old.daily.earned = integer(old.daily.earned);
      old.daily.answered = integer(old.daily.answered);
      old.daily.bonusAnswered = integer(old.daily.bonusAnswered);
      old.daily.completedTests = integer(old.daily.completedTests);
    }
    state[FIELD] = old;
    if (save && changed) persist();
    return old;
  }

  function questionId(question) {
    if (!question) return '';
    if (question.id) return String(question.id);
    if (api?.questionId) return String(api.questionId(question));
    return [question.sourceCourseId || question.c, question.sourceTopicId ?? question.t, question.prompt, question.answer].map(String).join('|');
  }

  function hash(text) {
    let value = 2166136261;
    for (const char of String(text)) {
      value ^= char.charCodeAt(0);
      value = Math.imul(value, 16777619);
    }
    return (value >>> 0).toString(36);
  }

  function sessionIdentity(testSession) {
    const s = testSession || {};
    const kind = String(s.kind || 'normal');
    const keys = [...new Set((s.keys || []).map(String))].sort();
    const first = s.qs?.[0] || {};
    const fallback = `${first.sourceCourseId || first.c || course || 'Test'}|${Number(first.sourceTopicId ?? first.t ?? topic ?? 0)}`;
    const source = keys.length ? keys.join(',') : fallback;
    if (kind === 'school') return `school|${source}|${integer(s._schoolTestIndexV6519)}`;
    if (kind === 'normal' || kind === 'extra') return `${kind}|${source}`;
    const fingerprint = hash((s.qs || []).map(questionId).sort().join('||') || source);
    if (s._wrongOnlyV651) return `wrong-gtt|${String(s._wrongScopeV651 || 'GTT Genel')}|${fingerprint}`;
    return `${kind}|${source}|${fingerprint}`;
  }

  function thresholdForAttempt(attempt) {
    return 100 + Math.max(0, integer(attempt) - 1) * 50;
  }

  function ensureSessionMeta(testSession) {
    if (!testSession) return null;
    const key = sessionIdentity(testSession);
    const old = testSession[SESSION_FIELD];
    if (!old || old.key !== key) {
      testSession[SESSION_FIELD] = { key, days: {}, startedAt: nowIso(), completed: false };
    }
    return testSession[SESSION_FIELD];
  }

  function dailyStudyActive() {
    try { window.__DURU_DAILY_V6519_TEST__?.ensureToday?.(true); } catch (_) {}
    const daily = state.dailyStudyV6519;
    return !!daily?.active && daily.day === dayKey();
  }

  function recordAnswer(testSession, phase = 'test') {
    if (!testSession || !dailyStudyActive()) return false;
    const meta = ensureSessionMeta(testSession), day = dayKey();
    if (!meta) return false;
    const bucket = meta.days[day] && typeof meta.days[day] === 'object'
      ? meta.days[day]
      : { answered: 0, bonusAnswered: 0, phases: {}, updatedAt: '' };
    bucket.answered = integer(bucket.answered) + 1;
    if (testSession._wrongOnlyV651) bucket.bonusAnswered = integer(bucket.bonusAnswered) + 1;
    bucket.phases[String(phase || 'test')] = integer(bucket.phases[String(phase || 'test')]) + 1;
    bucket.updatedAt = nowIso();
    meta.days[day] = bucket;
    persist();
    return true;
  }

  function finalizeSession(testSession) {
    if (!testSession) return null;
    const reward = ensureReward(false), meta = ensureSessionMeta(testSession);
    if (!meta || meta.completed) return null;
    const attempt = integer(reward.completions[meta.key]) + 1;
    reward.completions[meta.key] = attempt;
    meta.completed = true;
    meta.completedAt = nowIso();
    meta.attempt = attempt;
    const bucket = meta.days[dayKey()] || { answered: 0, bonusAnswered: 0 };
    const answered = integer(bucket.answered), bonusAnswered = integer(bucket.bonusAnswered);
    const threshold = thresholdForAttempt(attempt);
    const credit = answered ? (answered + bonusAnswered) * 100 / threshold : 0;
    const beforeTotal = Math.floor((Number(reward.daily.credit) || 0) / 100 + 1e-9);
    reward.daily.credit = round((Number(reward.daily.credit) || 0) + credit);
    const afterTotal = Math.floor(reward.daily.credit / 100 + 1e-9);
    const earned = Math.max(0, afterTotal - beforeTotal);
    reward.daily.earned = integer(reward.daily.earned) + earned;
    reward.daily.answered = integer(reward.daily.answered) + answered;
    reward.daily.bonusAnswered = integer(reward.daily.bonusAnswered) + bonusAnswered;
    reward.daily.completedTests = integer(reward.daily.completedTests) + 1;
    reward.daily.updatedAt = nowIso();
    reward.rights = integer(reward.rights) + earned;
    reward.updatedAt = nowIso();
    persist();
    return { key: meta.key, attempt, threshold, answered, bonusAnswered, credit: round(credit), earned, rights: reward.rights };
  }

  function progressValue(reward = ensureReward(false)) {
    const value = (Number(reward.daily.credit) || 0) % 100;
    return Math.max(0, Math.min(99.99, round(value)));
  }

  function formatProgress(value) {
    const rounded = Math.round(Number(value) || 0);
    return String(Math.max(0, Math.min(100, rounded)));
  }

  function homeMarkup() {
    const reward = ensureReward(false), progress = progressValue(reward), percent = Math.max(0, Math.min(100, progress));
    return `<div class="korebe-visual-v6530"><img src="${IMAGE}" alt="Korebe oynayan neseli cocuklar"></div><div class="korebe-copy-v6530"><h2>🎭 Ödüllerim</h2><div class="korebe-count-v6530"><strong>${reward.rights}</strong><span>Körebe hakkı</span></div><div class="korebe-progress-v6530" aria-label="Bugünkü Körebe ödülü ilerlemesi"><i style="width:${percent}%"></i></div><p><b>Bugünkü katkı: ${formatProgress(progress)}/100</b>${reward.daily.earned ? ` · Bugün ${reward.daily.earned} hak kazandın!` : ''}</p><p class="muted small">İlk tamamlamada 100 soru gerekir. Aynı testin her yeni tamamlanmasında eşik 50 soru artar. Yanlış-soru GTT/GDS çalışmaları iki kat sayılır.</p></div>`;
  }

  function decorateHome() {
    if (typeof view !== 'undefined' && view !== 'home') return;
    const heading = [...document.querySelectorAll('#app h2')].find(node => /Rozetlerim/.test(node.textContent || ''));
    const badgeCard = heading?.closest('.card');
    if (!badgeCard) return;
    let card = document.getElementById('korebe-reward-v6530');
    if (!card) {
      card = document.createElement('section');
      card.id = 'korebe-reward-v6530';
      card.className = 'card korebe-card-v6530';
    }
    card.innerHTML = homeMarkup();
    badgeCard.insertAdjacentElement('afterend', card);
  }

  function parentMarkup() {
    const reward = ensureReward(false);
    return `<div><h2>🎭 Körebe hakları</h2><p><strong class="korebe-parent-count-v6530">${reward.rights}</strong> kullanılabilir Körebe hakkı</p><p class="muted small">Kullanılan hakları buradan düşebilirsin. Bu işlem hak eklemez.</p></div><div class="korebe-spend-v6530"><label for="korebe-spend-input-v6530">Kullanılan hak</label><input id="korebe-spend-input-v6530" type="number" min="1" max="${Math.max(1, reward.rights)}" step="1" value="1" ${reward.rights ? '' : 'disabled'}><button type="button" onclick="spendBlindMansBuffV6530()" ${reward.rights ? '' : 'disabled'}>Hakları düş</button></div>`;
  }

  function decorateParent() {
    const anchor = document.querySelector('.teacher-parent-card') || document.querySelector('#app .card');
    if (!anchor) return;
    let card = document.getElementById('korebe-parent-v6530');
    if (!card) {
      card = document.createElement('section');
      card.id = 'korebe-parent-v6530';
      card.className = 'card korebe-parent-v6530';
    }
    card.innerHTML = parentMarkup();
    anchor.insertAdjacentElement('afterend', card);
  }

  function useRights(amount) {
    const reward = ensureReward(false), count = integer(amount);
    if (!count || count > reward.rights) return false;
    reward.rights -= count;
    reward.used = integer(reward.used) + count;
    reward.updatedAt = nowIso();
    persist();
    return true;
  }

  window.spendBlindMansBuffV6530 = function() {
    const input = document.getElementById('korebe-spend-input-v6530');
    const amount = integer(input?.value);
    const reward = ensureReward(false);
    if (!amount) { alert('Kullanılan Körebe hakkını 1 veya daha büyük bir sayı olarak gir.'); return; }
    if (amount > reward.rights) { alert(`Yalnızca ${reward.rights} Körebe hakkı var.`); return; }
    if (!confirm(`${amount} Körebe hakkı kullanıldı olarak düşülsün mü?`)) return;
    useRights(amount);
    decorateParent();
  };

  function showCompletionNotice(outcome) {
    if (!outcome || !outcome.answered) return;
    const card = document.querySelector('.completion-card');
    if (!card || card.querySelector('.korebe-earned-v6530')) return;
    const box = document.createElement('div');
    box.className = `korebe-earned-v6530 ${outcome.bonusAnswered ? 'bonus' : ''}`;
    const contribution = formatProgress(outcome.credit);
    const title = outcome.earned
      ? outcome.bonusAnswered ? '🎉 Bonus Körebe kazandın!' : '🎉 Körebe hakkı kazandın!'
      : outcome.bonusAnswered ? '⚡ Bonus Körebe ilerlemesi!' : '🎭 Körebe sayacın ilerledi!';
    box.innerHTML = `<strong>${title}</strong><p>Bu testin ${outcome.attempt}. tamamlanması için eşik ${outcome.threshold} soruydu. ${outcome.answered} soru ${outcome.bonusAnswered ? 'iki kat katkıyla ' : ''}bugünkü sayaca +${contribution} ekledi.${outcome.earned ? ` <b>${outcome.earned} yeni hakkın var!</b>` : ''}</p>`;
    const button = card.querySelector('button.primary:last-child');
    if (button) button.before(box); else card.append(box);
  }

  const nextBefore = window.nextQuestion;
  if (typeof nextBefore === 'function') window.nextQuestion = nextQuestion = function() {
    if (session && chosenAnswer !== null) recordAnswer(session, 'test');
    return nextBefore.apply(this, arguments);
  };

  const repairBefore = window.repairChoose;
  if (typeof repairBefore === 'function') window.repairChoose = repairChoose = function() {
    if (session) recordAnswer(session, 'repair');
    return repairBefore.apply(this, arguments);
  };

  const finishBefore = window.finishSession;
  if (typeof finishBefore === 'function') window.finishSession = finishSession = function() {
    const active = session, ready = !!active && (!Array.isArray(active.pending) || active.pending.length === 0);
    const result = finishBefore.apply(this, arguments);
    if (ready && active) showCompletionNotice(finalizeSession(active));
    return result;
  };

  const homeBefore = window.home;
  if (typeof homeBefore === 'function') window.home = home = function() {
    const result = homeBefore.apply(this, arguments);
    decorateHome();
    setTimeout(decorateHome, 0);
    return result;
  };

  const parentBefore = window.parentView;
  if (typeof parentBefore === 'function') window.parentView = parentView = function() {
    const result = parentBefore.apply(this, arguments);
    decorateParent();
    setTimeout(decorateParent, 0);
    return result;
  };

  const style = document.createElement('style');
  style.id = 'korebe-style-v6530';
  style.textContent = `
    .korebe-card-v6530{display:grid;grid-template-columns:minmax(170px,260px) 1fr;gap:20px;align-items:center;overflow:hidden;background:linear-gradient(135deg,#fff8ce,#e7fff3 54%,#efe8ff)}
    .korebe-visual-v6530{align-self:stretch;display:flex;align-items:center;justify-content:center;min-height:190px;border-radius:18px;background:radial-gradient(circle at 50% 45%,#fff 0,#fff8 42%,transparent 70%)}
    .korebe-visual-v6530 img{display:block;width:100%;max-height:245px;object-fit:contain;filter:drop-shadow(0 8px 8px #663b1833)}
    .korebe-copy-v6530 h2{margin:0 0 8px}.korebe-count-v6530{display:flex;align-items:baseline;gap:10px;color:#5928a4}.korebe-count-v6530 strong{font-size:clamp(48px,9vw,78px);line-height:1}.korebe-count-v6530 span{font-size:19px;font-weight:900}
    .korebe-progress-v6530{height:14px;margin:10px 0 8px;border-radius:999px;overflow:hidden;background:#fff;border:1px solid #7864a744}.korebe-progress-v6530 i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#ff9c33,#ff4f80,#7b55e7);transition:width .25s ease}
    .korebe-parent-v6530{display:flex;align-items:center;justify-content:space-between;gap:20px;background:linear-gradient(135deg,#fff6d9,#e7fff3)}.korebe-parent-count-v6530{font-size:34px;color:#6b36bc}.korebe-spend-v6530{display:grid;grid-template-columns:minmax(110px,150px) auto;gap:7px;align-items:end}.korebe-spend-v6530 label{grid-column:1/-1;font-weight:800}.korebe-spend-v6530 input{min-width:110px}.korebe-spend-v6530 button{background:#ff6a5e;color:#fff}
    .korebe-earned-v6530{margin:14px 0;padding:14px;border-radius:15px;background:#e8f8ff;border:2px solid #55b9de;color:#173c50}.korebe-earned-v6530.bonus{background:linear-gradient(135deg,#fff0b8,#ffe2f2);border-color:#ff9b28;color:#623414}.korebe-earned-v6530 p{margin:7px 0 0}
    body.dark .korebe-card-v6530{background:linear-gradient(135deg,#fff8ce,#e7fff3 54%,#efe8ff)!important;color:#26334b!important}body.dark .korebe-parent-v6530{background:linear-gradient(135deg,#fff6d9,#e7fff3)!important;color:#26334b!important}body.dark .korebe-card-v6530 h2,body.dark .korebe-parent-v6530 h2{color:#26334b!important}body.dark .korebe-card-v6530 .muted,body.dark .korebe-parent-v6530 .muted{color:#5b687a!important}
    @media(max-width:620px){.korebe-card-v6530{grid-template-columns:1fr;gap:8px}.korebe-visual-v6530{min-height:130px}.korebe-visual-v6530 img{max-height:210px}.korebe-parent-v6530{display:grid}.korebe-spend-v6530{grid-template-columns:minmax(100px,1fr) 1fr}}
  `;
  document.head.appendChild(style);

  ensureReward(true);
  if (typeof view !== 'undefined' && view === 'home') decorateHome();
  if (typeof view !== 'undefined' && view === 'parent') decorateParent();
  setInterval(() => {
    const previous = state[FIELD]?.daily?.day;
    ensureReward(true);
    if (previous !== state[FIELD]?.daily?.day && typeof view !== 'undefined' && view === 'home') decorateHome();
  }, 30000);

  window.__DURU_REWARDS_V6530_TEST__ = {
    dayKey, ensureReward, sessionIdentity, thresholdForAttempt, recordAnswer, finalizeSession,
    progressValue, decorateHome, decorateParent, useRights
  };
})();
