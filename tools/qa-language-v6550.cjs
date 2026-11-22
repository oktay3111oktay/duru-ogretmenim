const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.clear();
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify({
      points: 321, done: {}, history: {}, scores: {}, mistakes: {}, badges: ['first'], collection: { kept: true },
      migrations: { mathOfficialV67: true }, wrongQuestionLogV651: [], wrongGttMasteryV6519: {}, unlockAllV651: true,
    }));
  });
  const page = await context.newPage(), errors = [], alerts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', async dialog => { alerts.push(dialog.message()); await dialog.accept(); });
  const url = process.env.QA_URL || pathToFileURL(path.join(root, 'dist', 'index.html')).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  if (url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılamadı');
  await page.waitForFunction(() => !!window.__DURU_LANGUAGE_V6550_TEST__, undefined, { timeout: 60000 });

  const audit = await page.evaluate(async () => {
    const api = window.__DURU_LANGUAGE_V6550_TEST__, invalid = [], prompts = new Map(), summary = {};
    const expected = { Almanca: { topics: 18, questions: 432, speaking: 54 }, İngilizce: { topics: 24, questions: 576, speaking: 72 } };
    for (const [courseName, target] of Object.entries(expected)) {
      const rows = api.content[courseName] || [], skills = {}, sourcePages = new Set(), topicRows = [];
      rows.forEach((row, topicIndex) => {
        const localIds = new Set(), localPrompts = new Set();
        row.questions.forEach((q, questionIndex) => {
          const label = `${courseName}/${topicIndex + 1}/${questionIndex + 1}`;
          if (!q.prompt || !q.answer || !q.explain || !q.hint) invalid.push(`${label}: metin/açıklama/ipucu eksik`);
          if (!Array.isArray(q.options) || q.options.length !== 4 || new Set(q.options).size !== 4 || q.options.filter(option => option === q.answer).length !== 1) invalid.push(`${label}: seçenek yapısı bozuk`);
          if (!q.sourceRef?.file || !q.sourceRef?.page || !q.sourceRef?.image || !q.outcome || !q.skillType || !q.difficulty) invalid.push(`${label}: kaynak/kazanım/beceri/zorluk eksik`);
          if (q.schoolSource !== false || q.sourceType !== 'MEB') invalid.push(`${label}: kaynak türü yanlış`);
          if (localIds.has(q.id)) invalid.push(`${label}: kimlik tekrarı`); localIds.add(q.id);
          const normalized = q.prompt.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');
          if (localPrompts.has(normalized)) invalid.push(`${label}: konu içinde soru tekrarı`); localPrompts.add(normalized);
          if (prompts.has(normalized)) invalid.push(`${label}: genel soru tekrarı (${prompts.get(normalized)})`); else prompts.set(normalized, label);
          skills[q.skillType] = (skills[q.skillType] || 0) + 1;
          sourcePages.add(`${q.sourceRef.book}:${q.sourceRef.page}`);
        });
        topicRows.push({ title: row.title, questions: row.questions.length, speaking: api.speaking[courseName][topicIndex].length, sources: new Set(row.questions.map(q => `${q.sourceRef.book}:${q.sourceRef.page}`)).size });
      });
      summary[courseName] = {
        topics: rows.length,
        questions: rows.reduce((sum, row) => sum + row.questions.length, 0),
        speaking: (api.speaking[courseName] || []).reduce((sum, tasks) => sum + tasks.length, 0),
        sourcePages: sourcePages.size,
        skills,
        topicRows,
        target,
      };
    }

    openCourse('Almanca');
    await new Promise(resolve => setTimeout(resolve, 0));
    const germanOverview = document.querySelector('.language-overview-v6550')?.textContent || '';
    const germanCards = document.querySelectorAll('.language-topic-extra-v6550').length;
    startQuiz('Almanca', 0, 'normal');
    const firstGermanIds = session.qs.map(q => q.id);
    session.idx = 2; question();
    const audioButton = !!document.querySelector('.language-listen-v6550');
    const sourceButton = !!document.querySelector('.language-source-v6550');
    const sourceText = document.querySelector('.language-question-v6550')?.textContent || '';
    const expectedSource = session.qs[2].sourceRef.image;
    document.querySelector('.language-source-v6550')?.click();
    const openedSource = document.querySelector('#ger-modal img')?.getAttribute('src') || '';
    document.getElementById('ger-modal')?.remove();
    exitTestV617();
    delete state.pendingSession; state.optionalRetrySessionsV6516 = {}; localStorage.removeItem('duru_teacher_active_test_v617'); session = null; persist();
    startQuiz('Almanca', 0, 'normal');
    const secondGermanIds = session.qs.map(q => q.id);
    exitTestV617();

    openCourse('İngilizce');
    await new Promise(resolve => setTimeout(resolve, 0));
    const englishOverview = document.querySelector('.language-overview-v6550')?.textContent || '';
    const englishCards = document.querySelectorAll('.language-topic-extra-v6550').length;
    state.optionalRetrySessionsV6516 = {}; localStorage.removeItem('duru_teacher_active_test_v617'); delete state.pendingSession; session = null; persist();
    startQuiz('İngilizce', 0, 'normal'); session.idx = 2; question();
    const expectedEnglishSource = session.qs[2].sourceRef.image;
    document.querySelector('.language-source-v6550')?.click();
    const openedEnglishSource = document.querySelector('#eng-modal img')?.getAttribute('src') || '';
    document.getElementById('eng-modal')?.remove();
    state.optionalRetrySessionsV6516 = {}; localStorage.removeItem('duru_teacher_active_test_v617'); delete state.pendingSession; session = null; persist();
    openLanguageSpeakingV6550('İngilizce', 0);
    const speakingCards = document.querySelectorAll('.language-speaking-v6550 article').length;
    const speakingText = document.querySelector('.language-speaking-v6550')?.textContent || '';
    completeLanguageSpeakingV6550('İngilizce', 0);
    const speakingStored = !!state.languageBankV6550.speaking['İngilizce|0'];
    const syncMerged = window.__DURU_SYNC_V646_TEST__.conservativeInitialMerge(
      { appState: { languageBankV6550: { attempts: { 'Almanca|0|normal': 1 }, speaking: { 'İngilizce|0': '2026-11-18T10:00:00.000Z' }, updatedAt: '2026-11-18T10:00:00.000Z' } }, aux: {} },
      { appState: { languageBankV6550: { attempts: { 'Almanca|0|normal': 3, 'İngilizce|0|normal': 2 }, speaking: { 'İngilizce|0': '2026-11-19T10:00:00.000Z' }, updatedAt: '2026-11-19T10:00:00.000Z' } }, aux: {} }
    ).appState.languageBankV6550;

    return {
      title: document.title, summary, invalid,
      ui: { germanOverview, germanCards, englishOverview, englishCards, audioButton, sourceButton, sourceText, expectedSource, openedSource, expectedEnglishSource, openedEnglishSource, speakingCards, speakingText, speakingStored }, syncMerged,
      rotation: { firstGermanIds, secondGermanIds, same: firstGermanIds.join('|') === secondGermanIds.join('|') },
      preserved: { points: state.points, badge: state.badges.includes('first'), collection: !!state.collection.kept },
      width: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
    };
  });

  assert(audit.title.includes('V6.62.0'), 'Sürüm başlığı V6.62.0 değil');
  assert(audit.invalid.length === 0, `Soru bankası hataları: ${audit.invalid.slice(0, 8).join(' | ')}`);
  for (const courseName of ['Almanca', 'İngilizce']) {
    const row = audit.summary[courseName];
    assert(row.topics === row.target.topics && row.questions === row.target.questions && row.speaking === row.target.speaking, `${courseName} sayıları yanlış`);
    assert(row.topicRows.every(topic => topic.questions === 24 && topic.speaking === 3 && topic.sources === 6), `${courseName} konu dağılımı eksik`);
    for (const skill of ['vocabulary', 'listening', 'functional-language', 'sentence-building', 'reading', 'contextual-use', 'grammar-correction', 'listening-dialogue']) assert(row.skills[skill] > 0, `${courseName}: ${skill} yok`);
  }
  const allQuestions = Object.values(audit.summary).reduce((sum, row) => sum + row.questions, 0);
  assert(allQuestions === 1008, 'Toplam soru sayısı 1008 değil');
  assert(audit.ui.germanCards === 18 && audit.ui.englishCards === 24, 'Konu kartı beceri bilgisi eksik');
  assert(/432 farklı soru/.test(audit.ui.germanOverview) && /576 farklı soru/.test(audit.ui.englishOverview), 'Ders özetleri yanlış');
  assert(audit.ui.audioButton && audit.ui.sourceButton && /Kaynak:/.test(audit.ui.sourceText), 'Dinleme veya kaynak bağlantısı görünmüyor');
  assert(audit.ui.openedSource === audit.ui.expectedSource, `Kaynak düğmesi yanlış sayfayı açtı: ${audit.ui.openedSource} / ${audit.ui.expectedSource}`);
  assert(audit.ui.openedEnglishSource === audit.ui.expectedEnglishSource, `İngilizce kaynak düğmesi yanlış sayfayı açtı: ${audit.ui.openedEnglishSource} / ${audit.ui.expectedEnglishSource}`);
  assert(audit.ui.speakingCards === 3 && audit.ui.speakingStored && /ses kaydedilmez/i.test(audit.ui.speakingText), 'Konuşma çalışması çalışmıyor');
  assert(audit.syncMerged.attempts['Almanca|0|normal'] === 3 && audit.syncMerged.attempts['İngilizce|0|normal'] === 2 && audit.syncMerged.speaking['İngilizce|0'] === '2026-11-19T10:00:00.000Z', 'Dil bankası cihaz eşitlemesinde korunmadı');
  assert(!audit.rotation.same, 'Aynı Almanca testi ikinci girişte aynı 10 soruyu gösterdi');
  assert(audit.preserved.points === 321 && audit.preserved.badge && audit.preserved.collection, 'Öğrenci verileri korunmadı');
  assert(audit.width <= audit.innerWidth, `Mobil yatay taşma var: ${audit.width}/${audit.innerWidth}`);

  const coverage = JSON.parse(fs.readFileSync(path.join(root, 'dist', 'language-coverage-v6550.json'), 'utf8'));
  assert(coverage.schoolSources.Almanca === 0 && coverage.schoolSources.İngilizce === 0, 'Olmayan okul kaynağı üretilmiş');
  for (const courseName of ['Almanca', 'İngilizce']) {
    for (const topic of audit.summary[courseName].topicRows) assert(topic.sources === 6, `${courseName}/${topic.title}: kaynak sayfası dağılımı eksik`);
  }

  const assetChecks = [];
  await page.evaluate(() => window.__DURU_LANGUAGE_V6550_TEST__.content).then(content => {
    for (const topics of Object.values(content)) for (const topic of topics) for (const q of topic.questions) {
      const file = path.join(root, 'dist', q.sourceRef.image.replace(/^\.\//, ''));
      if (!fs.existsSync(file)) assetChecks.push(file);
    }
  });
  assert(assetChecks.length === 0, `Eksik kaynak görselleri: ${assetChecks.slice(0, 4).join(', ')}`);
  assert(alerts.length === 0, `Beklenmeyen uyarılar: ${alerts.join(' | ')}`);
  assert(errors.length === 0, `Tarayıcı hataları: ${errors.join(' | ')}`);

  if (process.env.QA_SCREENSHOT) {
    await page.evaluate(() => {
      state.optionalRetrySessionsV6516 = {}; localStorage.removeItem('duru_teacher_active_test_v617'); delete state.pendingSession; session = null; persist();
      openCourse('Almanca'); startQuiz('Almanca', 0, 'normal'); session.idx = 2; question();
    });
    await page.screenshot({ path: path.resolve(process.env.QA_SCREENSHOT), fullPage: true });
  }

  console.log(JSON.stringify({ url, audit, missingAssets: assetChecks, alerts, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
