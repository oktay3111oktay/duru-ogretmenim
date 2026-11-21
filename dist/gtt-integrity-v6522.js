/* V6.52.2: GTT ders kaynağı onarımı, yanlış-GTT/planlı tekrar ayrımı ve güvenli eski kayıt göçü. */
(() => {
  'use strict';

  const api = window.__DURU_V651_TEST__;
  const flow = window.__DURU_V6521_TEST_FLOW__;
  if (!api || !flow) return;

  const clone = value => JSON.parse(JSON.stringify(value));
  const aliases = {
    'Din': 'Din Kültürü',
    'Din Kültürü ve Ahlak Bilgisi': 'Din Kültürü',
    'Peygamberimizin Hayatı Dersi': 'Peygamberimizin Hayatı',
    'Fen': 'Fen Bilimleri'
  };
  const validCourse = value => {
    const raw = String(value || '').trim();
    const normalized = aliases[raw] || raw;
    return topics?.[normalized] ? normalized : '';
  };
  const courseFromId = question => {
    const id = String(question?.id || '');
    if (/^(?:SCHOOL-)?FEN(?:-|_)/i.test(id)) return 'Fen Bilimleri';
    if (/^(?:SCHOOL-)?TURK(?:ISH)?(?:-|_)/i.test(id)) return 'Türkçe';
    if (/^(?:SCHOOL-)?SOS(?:-|_)/i.test(id)) return 'Sosyal Bilgiler';
    if (/^DE(?:-|_)/i.test(id)) return 'Almanca';
    if (/^EN(?:-|_)/i.test(id)) return 'İngilizce';
    if (/^(?:SCHOOL-)?(?:MAT|MATH)(?:-|\.)/i.test(id) || /^MATEMATIK\|/i.test(id) || /^FENOMEN-/i.test(id)) return 'Matematik';
    const religious = id.match(/^REL-(Din Kültürü|Peygamberimizin Hayatı)-/i);
    if (religious) return religious[1].toLocaleLowerCase('tr-TR').startsWith('din') ? 'Din Kültürü' : 'Peygamberimizin Hayatı';
    return validCourse(id.split('|')[0]);
  };
  const courseFromSource = question => {
    const source = String(question?.sourceId || question?.privateSource?.sourceId || '').toLocaleLowerCase('tr-TR');
    if (/science|fen[_-]/.test(source)) return 'Fen Bilimleri';
    if (/turk/.test(source)) return 'Türkçe';
    if (/math|matematik|fenomen/.test(source)) return 'Matematik';
    if (/din|religion/.test(source)) return 'Din Kültürü';
    return '';
  };
  const topicFromId = question => {
    const id = String(question?.id || '');
    let match = id.match(/^(?:SCHOOL-)?(?:FEN|TURK(?:ISH)?|SOS|DE|EN|MAT|MATH)(?:-NEW)?[-_](\d+)(?:-|_)/i);
    if (!match) match = id.match(/^REL-(?:Din Kültürü|Peygamberimizin Hayatı)-(\d+)-/i);
    return match ? Number(match[1]) : NaN;
  };

  function canonicalQuestion(question) {
    if (!question || typeof question !== 'object') return { question, changed: false };
    const sourceCourse = validCourse(question.sourceCourseId);
    const courseId = courseFromId(question) || sourceCourse || courseFromSource(question) || validCourse(question.c);
    if (!courseId) return { question, changed: false };
    const candidates = [Number(question.sourceTopicId), topicFromId(question), Number(question.t)];
    const topicId = candidates.find(value => Number.isInteger(value) && !!topics?.[courseId]?.[value]);
    if (!Number.isInteger(topicId)) return { question, changed: false };
    const changed = question.c !== courseId || question.sourceCourseId !== courseId
      || Number(question.t) !== topicId || Number(question.sourceTopicId) !== topicId;
    return {
      changed,
      question: changed
        ? { ...question, c: courseId, sourceCourseId: courseId, t: topicId, sourceTopicId: topicId, repairedSourceV6522: true }
        : question
    };
  }

  function archiveWrong(record, reason) {
    state.wrongQuestionRecoveryV6522 = Array.isArray(state.wrongQuestionRecoveryV6522)
      ? state.wrongQuestionRecoveryV6522 : [];
    const signature = `${record?.eventId || ''}|${record?.id || ''}|${record?.c || ''}|${record?.sourceCourseId || ''}|${reason}`;
    if (!state.wrongQuestionRecoveryV6522.some(item => item.signature === signature)) {
      state.wrongQuestionRecoveryV6522.push({ signature, savedAt: new Date().toISOString(), reason, record: clone(record) });
      state.wrongQuestionRecoveryV6522 = state.wrongQuestionRecoveryV6522.slice(-200);
    }
  }

  function transferMastery(oldId, newId) {
    if (!oldId || !newId || oldId === newId) return false;
    const old = state.wrongGttMasteryV6519?.[oldId];
    if (!old) return false;
    const current = state.wrongGttMasteryV6519[newId] || {};
    state.wrongGttMasteryV6519[newId] = {
      ...old,
      ...current,
      streak: Math.max(Number(old.streak || 0), Number(current.streak || 0)),
      resolved: old.resolved === true || current.resolved === true
    };
    return true;
  }

  function repairWrongLog() {
    state.wrongQuestionLogV651 = Array.isArray(state.wrongQuestionLogV651) ? state.wrongQuestionLogV651 : [];
    let changed = false;
    state.wrongQuestionLogV651 = state.wrongQuestionLogV651.map(entry => {
      const fixed = canonicalQuestion(entry);
      if (!fixed.changed) return entry;
      const oldId = entry.id || api.questionId(entry);
      const next = { ...fixed.question };
      const moved = entry.c !== next.c || Number(entry.t) !== Number(next.t);
      if (moved) archiveWrong(entry, 'Ders veya konu etiketi gerçek soru kaynağıyla uyuşmuyordu.');
      const newId = moved ? api.questionId(next) : oldId;
      next.id = newId;
      if (moved) transferMastery(oldId, newId);
      changed = true;
      return next;
    });
    return changed;
  }

  function repairPausedRecords() {
    const records = state.optionalRetrySessionsV6516;
    if (!records || typeof records !== 'object') return false;
    let changed = false;
    Object.keys(records).forEach(key => {
      const record = records[key];
      if (!record?.session || !Array.isArray(record.session.qs)) return;
      const fixedQuestions = record.session.qs.map(canonicalQuestion);
      const fixedPending = Array.isArray(record.session.pending) ? record.session.pending.map(canonicalQuestion) : [];
      if (!fixedQuestions.some(item => item.changed) && !fixedPending.some(item => item.changed)) return;
      archiveWrong(record, 'Duraklatılmış GTT kaydının ders veya konu etiketi onarıldı.');
      const questions = fixedQuestions.map(item => item.question);
      const pending = Array.isArray(record.session.pending) ? fixedPending.map(item => item.question) : record.session.pending;
      const courses = [...new Set(questions.map(item => item?.sourceCourseId || item?.c).filter(Boolean))];
      const topicIds = [...new Set(questions.map(item => Number(item?.sourceTopicId ?? item?.t)).filter(Number.isInteger))];
      const sourceKeys = [...new Set(questions.map(item => `${item.sourceCourseId || item.c}|${Number(item.sourceTopicId ?? item.t)}`))];
      const courseId = courses.length === 1 ? courses[0] : courses.length > 1 ? 'GTT Genel' : record.courseId;
      records[key] = {
        ...record,
        appVersion: 6522,
        courseId,
        course: courseId,
        topicId: topicIds.length === 1 ? topicIds[0] : record.topicId,
        topic: topicIds.length === 1 ? topicIds[0] : record.topic,
        sourceKeys,
        updatedAt: new Date().toISOString(),
        session: { ...record.session, qs: questions, pending, keys: sourceKeys }
      };
      changed = true;
    });
    return changed;
  }

  function repairAll() {
    const wrongChanged = repairWrongLog();
    const pausedChanged = repairPausedRecords();
    const changed = wrongChanged || pausedChanged;
    if (changed) persist();
    return changed;
  }

  const rawWrongPool = api.wrongPool;
  api.wrongPool = function(scope = '') {
    repairAll();
    return rawWrongPool(scope).map(item => canonicalQuestion(item).question)
      .filter(item => !scope || item?.c === scope);
  };

  window.startWrongGttV651 = function(scope = '') {
    repairAll();
    if (flow.resumeForStart(scope || 'GTT Genel', undefined, 'repeat', '', 'wrong-gtt')) return true;
    const pool = api.wrongPool(scope);
    if (!pool.length) { alert('Bu seçim için kaydedilmiş yanlış soru bulunmuyor.'); return false; }
    const cursorKey = scope || '__all__';
    const cursor = Number(state.wrongGttCursorV651[cursorKey] || 0);
    const count = Math.min(10, pool.length), picked = [];
    if (scope) {
        for (let index = 0; index < count; index += 1) picked.push(clone(pool[(cursor + index) % pool.length]));
        state.wrongGttCursorV651[cursorKey] = (cursor + count) % pool.length;
    } else {
        const groups = new Map();
        pool.forEach(item => { const key = item.c || 'Diğer'; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item); });
        const names = [...groups.keys()], used = new Set();
        for (let round = 0; picked.length < count && round < pool.length; round += 1) {
          for (let step = 0; step < names.length && picked.length < count; step += 1) {
            const name = names[(cursor + step) % names.length], rows = groups.get(name) || [];
            if (!rows.length) continue;
            const item = rows[(cursor + round) % rows.length], id = api.questionId(item);
            if (used.has(id)) continue;
            used.add(id); picked.push(clone(item));
          }
        }
        state.wrongGttCursorV651[cursorKey] = names.length ? (cursor + 1) % names.length : 0;
    }
    persist();
    course = scope || 'GTT Genel';
    topic = Number(picked[0]?.t || 0);
    const keys = [...new Set(picked.map(question => `${question.c}|${Number(question.t)}`))];
    const sourceCourses = [...new Set(picked.map(question => question.c))];
    startSession(picked, sourceCourses.length > 1 ? 'general' : 'repeat', keys);
    if (!session) return false;
    session.kind = 'repeat';
    session._wrongOnlyV651 = true;
    session._wrongScopeV651 = scope;
    session._wrongGttRunIdV6519 = `wrong-gtt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    persist();
    if (typeof recordTestV617 === 'function') recordTestV617('question');
    question();
    return true;
  };

  const openCourseBefore = window.openCourse;
  window.openCourse = openCourse = function() {
    repairAll();
    return openCourseBefore.apply(this, arguments);
  };
  const globalBefore = window.globalGTTScreen;
  window.globalGTTScreen = function() {
    repairAll();
    return globalBefore.apply(this, arguments);
  };

  repairAll();
  window.__DURU_GTT_V6522_TEST__ = { canonicalQuestion, repairWrongLog, repairPausedRecords, repairAll };
})();
