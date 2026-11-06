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
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify({ unlockAllV651: true, points: 25, done: {}, history: {}, scores: {}, mistakes: {}, migrations: { mathOfficialV67: true } }));
  });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.join(root, 'dist', 'index.html')).href, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => !!(window.__DURU_V651_TEST__ && window.__DURU_TURKISH_V6520_TEST__), undefined, { timeout: 60000 });

  const result = await page.evaluate(() => {
    const invalid = [], summary = {}, school = {};
    const normalize = value => String(value || '').trim();
    const validate = (q, label) => {
      if (!normalize(q?.prompt)) invalid.push(`${label}: soru metni yok`);
      if (!Array.isArray(q?.options) || q.options.length !== 4) invalid.push(`${label}: dört seçenek yok`);
      else if (new Set(q.options.map(normalize)).size !== 4) invalid.push(`${label}: seçenek tekrarı var`);
      if (!q?.options || q.options.filter(option => option === q.answer).length !== 1) invalid.push(`${label}: doğru cevap seçeneklerde tam bir kez yok`);
      if (!normalize(q?.explain)) invalid.push(`${label}: açıklama yok`);
    };
    for (const [courseName] of courses) {
      const rows = topics[courseName] || [], counts = [], widths = [];
      openCourse(courseName);
      widths.push(document.documentElement.scrollWidth);
      for (let topicIndex = 0; topicIndex < rows.length; topicIndex += 1) {
        try {
          startQuiz(courseName, topicIndex, 'normal');
          const questions = session?.qs || [];
          counts.push(questions.length);
          if (questions.length < 5) invalid.push(`${courseName}/${topicIndex + 1}: konu testi beş sorudan az`);
          questions.forEach((q, index) => validate(q, `${courseName}/${topicIndex + 1}/${index + 1}`));
        } catch (error) {
          invalid.push(`${courseName}/${topicIndex + 1}: ${error.message}`);
        }
      }
      summary[courseName] = { topics: rows.length, minQuestions: Math.min(...counts), maxQuestions: Math.max(...counts), width: Math.max(...widths) };
      if (courseName !== 'Türkçe') {
        const api = window.__DURU_V651_TEST__, topicRows = rows.map((_, index) => api.schoolQuestions(courseName, index));
        const parts = topicRows.map(list => api.schoolPartsFromRowsV6520(list));
        parts.forEach((group, index) => {
          const flat = group.flat();
          if (flat.length !== topicRows[index].length) invalid.push(`${courseName}/${index + 1}: Okul Testi bölünürken soru kaybı`);
          if (group.slice(0, -1).some(part => part.length !== 10) || group.some(part => !part.length)) invalid.push(`${courseName}/${index + 1}: Okul Testi parça boyutu yanlış`);
        });
        school[courseName] = { questions: topicRows.flat().length, tests: parts.flat().length };
      }
    }
    const split = window.__DURU_V651_TEST__.schoolPartsFromRowsV6520;
    const synthetic = Object.fromEntries([9,10,19,20,29,30,31].map(count => [count, split(Array.from({ length: count }, (_, id) => ({ id }))).map(part => part.length)]));
    const mapNames = ['MEB_SOURCE_IMAGES_V618','MATH_BOOK_PAGES','TURKISH_PAGES','SOCIAL_PAGES','RELIGION_PAGES','GERMAN_MEB_PAGES','ENGLISH_MEB_PAGES'];
    const sourceAssets = [];
    for (const name of mapNames) {
      try {
        const map = eval(name);
        for (const value of Object.values(map || {})) if (typeof value === 'string' && /^assets\//.test(value)) sourceAssets.push({ map: name, value });
      } catch (_) {}
    }
    return { invalid, summary, school, synthetic, sourceAssets, width: document.documentElement.scrollWidth, innerWidth };
  });

  const expectedSplits = { 9:[9], 10:[10], 19:[19], 20:[10,10], 29:[10,19], 30:[10,10,10], 31:[10,10,11] };
  assert(JSON.stringify(result.synthetic) === JSON.stringify(expectedSplits), `Okul Testi 10+son kalan kuralı yanlış: ${JSON.stringify(result.synthetic)}`);
  const missing = result.sourceAssets.filter(item => !fs.existsSync(path.join(root, 'dist', item.value)));
  assert(!missing.length, `Eksik MEB kaynak görselleri: ${JSON.stringify(missing.slice(0, 20))}`);
  assert(!result.invalid.length, `Soru/kurs hataları: ${JSON.stringify(result.invalid.slice(0, 50))}`);
  assert(Object.values(result.summary).every(row => row.width <= 391), `390 pikselde taşma: ${JSON.stringify(result.summary)}`);
  assert(result.width <= result.innerWidth + 1, 'Son görünümde yatay taşma var');
  assert(!errors.length, `Tarayıcı hataları: ${errors.join(' | ')}`);
  console.log(JSON.stringify({ summary: result.summary, school: result.school, synthetic: result.synthetic, sourceAssets: result.sourceAssets.length, missingAssets: missing.length, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
