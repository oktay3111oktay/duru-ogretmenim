const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const seed = { points: 417, done: {}, history: {}, scores: {}, mistakes: {}, badges: ['first'], collection: { 'Korunan kart': true }, migrations: { mathOfficialV67: true } };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    if (!localStorage.getItem('duru_teacher_reset_v6_5')) localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  if (url.startsWith('http')) assert(response?.ok(), 'Uygulama açılamadı');
  await page.waitForFunction(() => !!(window.__DURU_TURKISH_V6520_TEST__ && window.__DURU_V6521_TEST_FLOW__), undefined, { timeout: 60000 });

  const groups = await page.evaluate(original => {
    const api = window.__DURU_TURKISH_V6520_TEST__;
    const names = [...new Set(api.curriculum.map(topic => topic.group))];
    const starts = names.map(name => api.groupIndexes(name)[0]);
    const before = starts.map(index => ({ index, first: api.accessible(index), second: api.accessible(index + 1) }));
    const transitions = starts.map(index => {
      const id = api.curriculum[index].id, parts = api.schoolParts(index);
      state.turkishV6520.completed[id] = '2026-11-06T10:00:00.000Z';
      const afterTopic = api.accessible(index + 1);
      state.turkishV6520.schoolDone[id] = Object.fromEntries(parts.map((_, part) => [part, '2026-11-06T10:05:00.000Z']));
      const afterRequired = api.accessible(index + 1);
      return { index, parts: parts.length, afterTopic, afterRequired };
    });
    persist(); openCourse('Türkçe');
    const headings = [...document.querySelectorAll('.tr-group-v6520')].map(node => ({
      name: node.querySelector('span')?.textContent.trim(), progress: node.querySelector('small')?.textContent.trim()
    }));
    const groupNumbers = starts.map(index => document.querySelector(`[data-topic-id="${api.curriculum[index].id}"] .course-number`)?.textContent.trim());
    return { names, starts, before, transitions, headings, groupNumbers, points: state.points, badges: state.badges, collection: state.collection, width: document.documentElement.scrollWidth, innerWidth };
  }, seed);
  assert(JSON.stringify(groups.names) === JSON.stringify(['İELEV Kaynakları', 'İELEV Derin Öğrenme', 'MEB Kaynakları']), 'Türkçe grup sırası değişti');
  assert(groups.before.every(row => row.first && !row.second), `Her grubun yalnız ilk konusu açık değil: ${JSON.stringify(groups.before)}`);
  assert(groups.transitions.every(row => row.afterRequired && (row.parts ? !row.afterTopic : row.afterTopic)), `Grup içi geçiş şartı yanlış: ${JSON.stringify(groups.transitions)}`);
  assert(groups.groupNumbers.every(value => value === '1'), `Konu numaraları grup başında sıfırlanmadı: ${groups.groupNumbers.join(',')}`);
  assert(groups.points === seed.points && JSON.stringify(groups.badges) === JSON.stringify(seed.badges) && JSON.stringify(groups.collection) === JSON.stringify(seed.collection), 'Öğrenci kaydı değişti');
  assert(groups.width <= groups.innerWidth + 1, '390 pikselde yatay taşma var');

  const paused = await page.evaluate(() => {
    state.turkishV6520 = { completed: {}, history: {}, started: {}, schoolDone: {}, schoolNext: {}, version: state.turkishV6520.version };
    persist();
    startQuiz('Matematik', 0, 'normal');
    const firstId = session?._sessionIdV648;
    choose(session.qs[0].options.indexOf(session.qs[0].answer)); nextQuestion();
    const leftAt = session.idx;
    exitTestV617();
    const afterExit = {
      view, active: !!localStorage.getItem('duru_teacher_active_test_v617'), notice: !!document.getElementById('paused-test-v617'),
      keys: Object.keys(state.optionalRetrySessionsV6516), pending: !!state.pendingSession
    };
    startQuiz('Fen Bilimleri', 0, 'normal');
    const switched = { course, questionCourse: session?.qs?.[0]?.c, id: session?._sessionIdV648 };
    exitTestV617();
    startQuiz('Matematik', 0, 'normal');
    return { firstId, leftAt, afterExit, switched, resumedId: session?._sessionIdV648, resumedAt: session?.idx, view };
  });
  assert(paused.afterExit.view === 'home' && !paused.afterExit.active && !paused.afterExit.notice && !paused.afterExit.pending, `Ana sayfa hâlâ testi zorluyor: ${JSON.stringify(paused.afterExit)}`);
  assert(paused.afterExit.keys.includes('normal|Matematik|0'), 'Yarım test güvenli kaldığı-yer listesine alınmadı');
  assert(paused.switched.course === 'Fen Bilimleri' && paused.switched.questionCourse === 'Fen Bilimleri' && paused.switched.id !== paused.firstId, 'Başka ders testi eski teste zorlandı');
  assert(paused.leftAt === 1 && paused.resumedAt === 1 && paused.resumedId === paused.firstId, 'Aynı test kaldığı sorudan devam etmedi');

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => !!window.__DURU_V6521_TEST_FLOW__, undefined, { timeout: 60000 });
  const reload = await page.evaluate(() => ({
    view, active: !!localStorage.getItem('duru_teacher_active_test_v617'), notice: !!document.getElementById('paused-test-v617'),
    paused: Object.keys(state.optionalRetrySessionsV6516), points: state.points
  }));
  assert(reload.view === 'home' && !reload.active && !reload.notice && reload.paused.includes('normal|Matematik|0'), `Yeniden açılışta test zorla açıldı: ${JSON.stringify(reload)}`);
  assert(reload.points === seed.points, 'Yeniden yüklemede puan değişti');

  const activeSwitch = await page.evaluate(() => {
    startQuiz('Matematik', 0, 'normal');
    const mathId = session?._sessionIdV648;
    startQuiz('Almanca', 0, 'normal');
    const result = { course, questionCourse: session?.qs?.[0]?.c, mathId, activeId: session?._sessionIdV648, paused: Object.keys(state.optionalRetrySessionsV6516) };
    exitTestV617();
    return result;
  });
  assert(activeSwitch.course === 'Almanca' && activeSwitch.questionCourse === 'Almanca' && activeSwitch.activeId !== activeSwitch.mathId && activeSwitch.paused.includes('normal|Matematik|0'), `Sonradan gelen etkin test başka derse geçişi engelledi: ${JSON.stringify(activeSwitch)}`);

  const repair = await page.evaluate(() => {
    startQuiz('Sosyal Bilgiler', 0, 'normal');
    while (session?.phase === 'test' && session.idx < session.qs.length) {
      const q = session.qs[session.idx], wrong = q.options.findIndex(option => option !== q.answer);
      choose(wrong); nextQuestion();
    }
    const wrongs = session.pending.length;
    exitTestV617();
    const exited = { active: !!localStorage.getItem('duru_teacher_active_test_v617'), notice: !!document.getElementById('paused-test-v617'), pending: !!state.pendingSession, keys: Object.keys(state.optionalRetrySessionsV6516) };
    startQuiz('İngilizce', 0, 'normal');
    const otherCourse = course; exitTestV617();
    startQuiz('Sosyal Bilgiler', 0, 'normal');
    return { wrongs, exited, otherCourse, resumedCourse: course, resumedPending: session.pending.length, resultVisible: !!document.querySelector('.card h1') };
  });
  assert(repair.wrongs > 0 && !repair.exited.active && !repair.exited.notice && !repair.exited.pending, `Yanlışlı test ana sayfayı engelledi: ${JSON.stringify(repair.exited)}`);
  assert(repair.otherCourse === 'İngilizce', 'Yanlışlı test başka derse geçişi engelledi');
  assert(repair.resumedCourse === 'Sosyal Bilgiler' && repair.resumedPending === repair.wrongs && repair.resultVisible, 'Yanlışlı test aynı testten devam etmedi');
  assert(!errors.length, `Tarayıcı hataları: ${errors.join(' | ')}`);

  console.log(JSON.stringify({ url, groups, paused, reload, activeSwitch, repair, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
