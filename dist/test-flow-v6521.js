/* V6.52.1: Duraklatılan testler ana sayfayı engellemez; aynı test yeniden açıldığında kaldığı yerden sürer. */
(() => {
  'use strict';

  const ACTIVE_KEY = 'duru_teacher_active_test_v617';
  const ROUTE_KEY = 'duru_teacher_current_screen_v33';
  const PAUSED_LIMIT = 40;
  const clone = value => JSON.parse(JSON.stringify(value));
  state.optionalRetrySessionsV6516 = state.optionalRetrySessionsV6516 && typeof state.optionalRetrySessionsV6516 === 'object'
    ? state.optionalRetrySessionsV6516 : {};

  function readActive() {
    try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null'); }
    catch (_) { return null; }
  }
  function info(record) {
    const first = record?.session?.qs?.[0] || {};
    const courseId = String(record?.courseId || record?.course || first.sourceCourseId || first.c || '');
    const topicId = Number(record?.topicId ?? record?.topic ?? first.sourceTopicId ?? first.t ?? 0);
    const kind = String(record?.testKind || record?.session?.kind || 'normal');
    const sourceKeys = [...new Set((record?.sourceKeys || record?.session?.keys || []).map(String))].sort();
    return { courseId, topicId, kind, sourceKeys };
  }
  function pauseKey(record) {
    const meta = info(record);
    const suffix = ['normal', 'extra', 'school'].includes(meta.kind) ? '' : `|${meta.sourceKeys.join(',')}`;
    return `${meta.kind}|${meta.courseId}|${meta.topicId}${suffix}`;
  }
  function trimPaused() {
    const rows = Object.entries(state.optionalRetrySessionsV6516);
    if (rows.length <= PAUSED_LIMIT) return;
    rows.sort((a, b) => String(a[1]?.pausedAtV6521 || a[1]?.updatedAt || a[1]?.createdAt || '')
      .localeCompare(String(b[1]?.pausedAtV6521 || b[1]?.updatedAt || b[1]?.createdAt || '')));
    rows.slice(0, rows.length - PAUSED_LIMIT).forEach(([key]) => delete state.optionalRetrySessionsV6516[key]);
  }
  function store(record) {
    if (!record?.session || !Array.isArray(record.session.qs) || !record.session.qs.length) return '';
    const key = pauseKey(record);
    state.optionalRetrySessionsV6516[key] = { ...clone(record), pausedAtV6521: new Date().toISOString() };
    trimPaused();
    return key;
  }
  function stashPending() {
    const pending = state.pendingSession;
    if (!pending?.session || !Array.isArray(pending.session.qs) || !pending.session.qs.length) return '';
    const record = {
      schemaVersion: 2,
      appVersion: 6521,
      courseId: pending.course,
      topicId: Number(pending.topic) || 0,
      testKind: pending.session.kind || 'normal',
      stage: pending.session.pending?.length ? 'repair' : 'question',
      sourceKeys: pending.session.keys || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      session: clone(pending.session)
    };
    const key = store(record);
    delete state.pendingSession;
    persist();
    return key;
  }
  function stashActive() {
    const record = readActive();
    if (!record) return '';
    const key = store(record);
    localStorage.removeItem(ACTIVE_KEY);
    delete state.pendingSession;
    try { sessionStorage.setItem(ROUTE_KEY, JSON.stringify({ type: 'home' })); } catch (_) {}
    persist();
    return key;
  }
  function removeForcedNotices() {
    document.getElementById('paused-test-v617')?.remove();
  }
  function pausedEntries() {
    return Object.entries(state.optionalRetrySessionsV6516)
      .filter(([, record]) => record?.session?.qs?.length)
      .sort((a, b) => String(b[1]?.pausedAtV6521 || b[1]?.updatedAt || '').localeCompare(String(a[1]?.pausedAtV6521 || a[1]?.updatedAt || '')));
  }
  function matches(record, courseId, topicId, kind, sourceKey = '') {
    const meta = info(record);
    if (kind && meta.kind !== kind) return false;
    if (courseId && meta.courseId !== courseId) return false;
    if (Number.isInteger(Number(topicId)) && meta.topicId !== Number(topicId)) return false;
    return !sourceKey || meta.sourceKeys.includes(String(sourceKey));
  }
  function resumeMatch(courseId, topicId, kind, sourceKey = '') {
    const found = pausedEntries().find(([, record]) => matches(record, courseId, topicId, kind, sourceKey));
    if (!found) return false;
    const [key, record] = found;
    delete state.optionalRetrySessionsV6516[key];
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(record));
    persist();
    return resumeSavedTestV617();
  }
  function resumeForStart(courseId, topicId, kind, sourceKey = '') {
    const active = readActive();
    if (active) {
      if (matches(active, courseId, topicId, kind, sourceKey)) return resumeSavedTestV617();
      stashPending();
      stashActive();
    }
    return resumeMatch(courseId, topicId, kind, sourceKey);
  }

  const homeBefore = window.home;
  window.home = home = function() {
    stashPending();
    stashActive();
    const result = homeBefore.apply(this, arguments);
    removeForcedNotices();
    return result;
  };

  window.exitTestV617 = function() {
    if (session && typeof recordTestV617 === 'function') recordTestV617(testUiStageV617 || 'question');
    home();
  };

  const quizBefore = window.startQuiz;
  window.startQuiz = startQuiz = function(c, t, kind) {
    const topicIndex = Number(t), testKind = String(kind || 'normal');
    if (resumeForStart(String(c), topicIndex, testKind)) return true;
    return quizBefore.apply(this, arguments);
  };

  if (typeof window.startSchoolTestV6519 === 'function') {
    const schoolBefore = window.startSchoolTestV6519;
    window.startSchoolTestV6519 = function(c, t) {
      if (resumeForStart(String(c), Number(t), 'school')) return true;
      return schoolBefore.apply(this, arguments);
    };
  }
  if (typeof window.startSchoolTestV649 === 'function') {
    const oldSchoolBefore = window.startSchoolTestV649;
    window.startSchoolTestV649 = function(c, t) {
      if (resumeForStart(String(c), Number(t), 'school')) return true;
      return oldSchoolBefore.apply(this, arguments);
    };
  }
  if (typeof window.startTurkishSchoolV6520 === 'function') {
    const turkishSchoolBefore = window.startTurkishSchoolV6520;
    window.startTurkishSchoolV6520 = function(index) {
      if (resumeForStart('Türkçe', Number(index), 'school')) return true;
      return turkishSchoolBefore.apply(this, arguments);
    };
  }
  if (typeof window.startGeneral === 'function') {
    const generalBefore = window.startGeneral;
    window.startGeneral = startGeneral = function() {
      if (resumeForStart(String(course), undefined, 'general')) return true;
      return generalBefore.apply(this, arguments);
    };
  }
  if (typeof window.startGlobalGTTSelected === 'function') {
    const globalBefore = window.startGlobalGTTSelected;
    window.startGlobalGTTSelected = function() {
      if (resumeForStart('GTT Genel', undefined, 'general')) return true;
      return globalBefore.apply(this, arguments);
    };
  }
  if (typeof window.startWrongGttV651 === 'function') {
    const wrongBefore = window.startWrongGttV651;
    window.startWrongGttV651 = function(scope = '') {
      if (resumeForStart(scope || 'GTT Genel', undefined, 'repeat')) return true;
      return wrongBefore.apply(this, arguments);
    };
  }
  if (typeof window.repeatStart === 'function') {
    const repeatBefore = window.repeatStart;
    window.repeatStart = function(key, days) {
      const split = String(key).lastIndexOf('|'), c = split > 0 ? String(key).slice(0, split) : '', t = split > 0 ? Number(String(key).slice(split + 1)) : 0;
      if (resumeForStart(c, t, 'repeat', key)) return true;
      return repeatBefore.apply(this, arguments);
    };
  }

  const hadActive = !!readActive(), restoredTestView = typeof view !== 'undefined' && view === 'test';
  if (hadActive || restoredTestView) home();
  else { stashPending(); removeForcedNotices(); }

  window.__DURU_V6521_TEST_FLOW__ = { info, pauseKey, pausedEntries, stashActive, stashPending, resumeMatch, resumeForStart, removeForcedNotices };
})();
