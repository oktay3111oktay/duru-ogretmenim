const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

const question = (id, course, topic, prompt) => ({
  id, c: course, t: topic, sourceCourseId: course, sourceTopicId: topic,
  prompt, answer: 'Doğru', options: ['Doğru', 'Yanlış 1', 'Yanlış 2', 'Yanlış 3'], explain: 'Doğru cevap.'
});

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const bad = { ...question('legacy-cross-course', 'Din Kültürü', 0, 'Fen kaynağından gelen eski soru'), sourceCourseId: 'Fen Bilimleri', sourceTopicId: 0 };
  const din = question('REL-Din Kültürü-0-QA', 'Din Kültürü', 0, 'Din Kültürü yanlış sorusu');
  const scheduled = question('REL-Din Kültürü-1-QA', 'Din Kültürü', 1, 'Planlı Din tekrarı');
  const math = question('MAT-0-QA', 'Matematik', 0, 'Matematik yanlış sorusu');
  const science = question('FEN-1-QA', 'Fen Bilimleri', 1, 'Fen yanlış sorusu');
  const scheduledRecord = {
    schemaVersion: 2, appVersion: 6521, sessionId: 'scheduled-repeat-qa', revision: 1,
    courseId: 'Din Kültürü', topicId: 1, testKind: 'repeat', sourceKeys: ['Din Kültürü|1'], stage: 'question',
    createdAt: '2026-11-11T00:00:00.000Z', updatedAt: '2026-11-11T00:00:00.000Z',
    session: { kind: 'repeat', keys: ['Din Kültürü|1'], qs: [scheduled], idx: 0, answers: [], pending: [], initial: 0, repair: 0, _sessionIdV648: 'scheduled-repeat-qa' }
  };
  const seed = {
    points: 417, done: { 'Matematik|0': '2026-11-10T00:00:00.000Z' }, history: {}, scores: {}, mistakes: {},
    badges: ['first'], collection: { 'Korunan kart': true }, migrations: { mathOfficialV67: true },
    wrongQuestionLogV651: [bad, din, math, science],
    wrongGttMasteryV6519: { 'legacy-cross-course': { streak: 1, resolved: false } },
    optionalRetrySessionsV6516: { 'repeat|Din Kültürü|1|Din Kültürü|1': scheduledRecord }
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage(), errors = [], alerts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', async dialog => { alerts.push(dialog.message()); await dialog.dismiss(); });
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  if (url.startsWith('http')) assert(response?.ok(), 'Uygulama açılamadı');
  await page.waitForFunction(() => window.__DURU_GTT_V6522_TEST__ && window.__DURU_V6521_TEST_FLOW__, undefined, { timeout: 60000 });

  const initial = await page.evaluate(() => {
    const api = window.__DURU_V651_TEST__, flow = window.__DURU_V6521_TEST_FLOW__;
    home();
    const homeText = document.getElementById('app').textContent;
    parentView();
    const parentText = document.getElementById('app').textContent;
    const fenPool = api.wrongPool('Fen Bilimleri'), dinPool = api.wrongPool('Din Kültürü');
    const repaired = state.wrongQuestionLogV651.find(item => item.prompt === 'Fen kaynağından gelen eski soru');
    return {
      title: document.title,
      miniHome: /Mini oyunlar/i.test(homeText), miniParent: /Mini oyunlar/i.test(parentText), miniFunction: typeof window.miniGames,
      fenPrompts: fenPool.map(item => item.prompt), dinPrompts: dinPool.map(item => item.prompt),
      repaired: repaired && { c: repaired.c, sourceCourseId: repaired.sourceCourseId, id: repaired.id },
      mastery: repaired ? state.wrongGttMasteryV6519[repaired.id] : null,
      recoveryCount: (state.wrongQuestionRecoveryV6522 || []).length,
      pausedType: flow.info(Object.values(state.optionalRetrySessionsV6516)[0]).repeatType,
      preserved: { points: state.points, done: state.done['Matematik|0'], badge: state.badges.includes('first'), card: !!state.collection['Korunan kart'] }
    };
  });
  assert(initial.title.includes('V6.58.0'), 'Sürüm başlığı güncellenmedi');
  assert(!initial.miniHome && !initial.miniParent && initial.miniFunction === 'undefined', 'Mini Oyunlar tamamen kaldırılmadı');
  assert(initial.fenPrompts.includes('Fen kaynağından gelen eski soru') && !initial.dinPrompts.includes('Fen kaynağından gelen eski soru'), 'Din/Fen yanlış kaydı gerçek dersine taşınmadı');
  assert(initial.repaired?.c === 'Fen Bilimleri' && initial.repaired?.sourceCourseId === 'Fen Bilimleri', 'Onarılan soru kimliği Fen Bilimleri değil');
  assert(initial.mastery?.streak === 1 && initial.recoveryCount >= 1, 'GTT ustalık veya kurtarma kaydı korunmadı');
  assert(initial.pausedType === 'scheduled-repeat', 'Planlı tekrar türü ayırt edilmedi');
  assert(initial.preserved.points === 417 && initial.preserved.done && initial.preserved.badge && initial.preserved.card, 'Öğrenci ilerlemesi korunmadı');

  const separated = await page.evaluate(() => {
    localStorage.removeItem('duru_teacher_active_test_v617');
    delete state.pendingSession;
    session = null;
    startWrongGttV651('Din Kültürü');
    const wrong = { prompt: session?.qs?.[0]?.prompt || '', id: session?._sessionIdV648 || '', wrongOnly: !!session?._wrongOnlyV651 };
    exitTestV617();
    repeatStart('Din Kültürü|1', 1);
    const scheduled = { prompt: session?.qs?.[0]?.prompt || '', id: session?._sessionIdV648 || '', wrongOnly: !!session?._wrongOnlyV651 };
    return { wrong, scheduled };
  });
  assert(separated.wrong.prompt === 'Din Kültürü yanlış sorusu' && separated.wrong.id !== 'scheduled-repeat-qa' && separated.wrong.wrongOnly, 'Yanlış-GTT planlı tekrarla karıştı');
  assert(separated.scheduled.prompt === 'Planlı Din tekrarı' && separated.scheduled.id === 'scheduled-repeat-qa' && !separated.scheduled.wrongOnly, 'Planlı tekrar kendi oturumundan devam etmedi');

  const global = await page.evaluate(() => {
    localStorage.removeItem('duru_teacher_active_test_v617');
    delete state.pendingSession;
    state.optionalRetrySessionsV6516 = {};
    session = null;
    state.wrongQuestionLogV651 = state.wrongQuestionLogV651.filter(item => ['Matematik yanlış sorusu', 'Fen yanlış sorusu'].includes(item.prompt));
    state.wrongGttMasteryV6519 = {};
    persist();
    const started = startWrongGttV651('');
    let saved = null; try { saved = JSON.parse(localStorage.getItem('duru_teacher_active_test_v617') || 'null'); } catch (_) {}
    return {
      started, course, kind: session?.kind || '', wrongOnly: !!session?._wrongOnlyV651,
      courses: [...new Set((session?.qs || []).map(item => item.c))],
      savedCourse: saved?.courseId || '', savedKind: saved?.testKind || '', savedCount: saved?.session?.qs?.length || 0
    };
  });
  assert(global.started && global.course === 'GTT Genel' && global.kind === 'repeat' && global.wrongOnly, 'Çok dersli yanlış-GTT başlamadı');
  assert(global.courses.length === 2 && global.courses.includes('Matematik') && global.courses.includes('Fen Bilimleri'), 'Genel yanlış-GTT dersleri karıştırmadı');
  assert(global.savedCourse === 'GTT Genel' && global.savedKind === 'repeat' && global.savedCount >= 2, `Genel yanlış-GTT güvenli kaydedilmedi: ${JSON.stringify(global)}`);

  const allCourses = await page.evaluate(() => {
    const api = window.__DURU_V651_TEST__;
    const names = Object.keys(topics), rows = [];
    state.wrongQuestionLogV651 = names.map((name, index) => {
      const source = api.candidatePool(name, 0)[0];
      return { ...source, eventId: `v6522-${index}`, sourceCourseId: name, sourceTopicId: 0, c: name, t: 0 };
    });
    state.wrongGttMasteryV6519 = {};
    persist();
    for (const name of names) {
      localStorage.removeItem('duru_teacher_active_test_v617');
      delete state.pendingSession;
      state.optionalRetrySessionsV6516 = {};
      session = null;
      const pool = api.wrongPool(name);
      startWrongGttV651(name);
      rows.push({ name, poolCourses: [...new Set(pool.map(item => item.c))], sessionCourses: [...new Set((session?.qs || []).map(item => item.c))] });
    }
    home();
    return { rows, width: document.documentElement.scrollWidth, innerWidth: window.innerWidth, points: state.points, done: state.done['Matematik|0'], badge: state.badges.includes('first'), card: !!state.collection['Korunan kart'] };
  });
  assert(allCourses.rows.every(row => row.poolCourses.length === 1 && row.poolCourses[0] === row.name && row.sessionCourses.length === 1 && row.sessionCourses[0] === row.name), `Ders bazlı GTT filtresi yanlış: ${JSON.stringify(allCourses.rows)}`);
  assert(allCourses.width <= allCourses.innerWidth, '390 px görünümde yatay taşma var');
  assert(allCourses.points === 417 && allCourses.done && allCourses.badge && allCourses.card, 'GTT denetimi öğrenci kayıtlarını değiştirdi');
  assert(!alerts.length && !errors.length, `Tarayıcı hatası: ${JSON.stringify({ alerts, errors })}`);

  console.log(JSON.stringify({ url, initial, separated, global, allCourses, alerts, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
