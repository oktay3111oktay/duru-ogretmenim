const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const fail = message => { throw new Error(message); };
const norm = value => String(value || '').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9]+/g, ' ').trim();

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => { window.__DURU_SYNC_TEST_MODE__ = true; localStorage.clear(); });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.join(root, 'dist', 'index.html')).href, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => !!window.__DURU_TURKISH_V6520_TEST__, undefined, { timeout: 60000 });
  const snapshot = await page.evaluate(() => {
    const curriculum = window.__DURU_TURKISH_V6520_TEST__.curriculum;
    const mebPages = eval('TURKISH_PAGES');
    return {
      topics: curriculum.map(topic => ({
        id: topic.id,
        group: topic.group,
        title: topic.title,
        pages: topic.pages || [],
        topicQuestions: topic.topicQuestions || [],
        schoolQuestions: topic.schoolQuestions || []
      })),
      mebPages
    };
  });
  if (errors.length) fail(`Tarayıcı hataları: ${errors.join(' | ')}`);

  const allQuestions = [];
  const missingAssets = [];
  const invalid = [];
  for (const topic of snapshot.topics) {
    if ((topic.pages || []).length < 1) invalid.push(`${topic.id}: konu anlatımı yok`);
    if ((topic.topicQuestions || []).length < 5) invalid.push(`${topic.id}: konu testi beş sorudan az`);
    for (const [kind, rows] of [['topic', topic.topicQuestions], ['school', topic.schoolQuestions]]) {
      rows.forEach((q, index) => {
        const label = `${topic.id}/${kind}/${index + 1}`;
        allQuestions.push({ ...q, label, topicId: topic.id, kind });
        if (!String(q.prompt || '').trim()) invalid.push(`${label}: soru metni yok`);
        if (!Array.isArray(q.options) || q.options.length !== 4) invalid.push(`${label}: dört seçenek yok`);
        else if (new Set(q.options.map(option => String(option).trim())).size !== 4) invalid.push(`${label}: seçenekler benzersiz değil`);
        if (!q.options || q.options.filter(option => option === q.answer).length !== 1) invalid.push(`${label}: doğru cevap seçeneklerde tam bir kez yok`);
        if (!String(q.explain || '').trim()) invalid.push(`${label}: açıklama yok`);
        if (q.visualUrl && !fs.existsSync(path.join(root, 'dist', q.visualUrl))) missingAssets.push(`${label}: ${q.visualUrl}`);
      });
    }
    for (const [index, entry] of (topic.pages || []).entries()) {
      if (entry.sourceUrl && !fs.existsSync(path.join(root, 'dist', entry.sourceUrl))) missingAssets.push(`${topic.id}/page/${index + 1}: ${entry.sourceUrl}`);
      if (entry.mebBook && entry.mebPage && !snapshot.mebPages[`${entry.mebBook}:${entry.mebPage}`]) invalid.push(`${topic.id}/page/${index + 1}: MEB ${entry.mebBook}:${entry.mebPage} eşleşmesi yok`);
    }
  }

  const promptGroups = new Map();
  for (const question of allQuestions) {
    const key = norm(question.prompt);
    if (!promptGroups.has(key)) promptGroups.set(key, []);
    promptGroups.get(key).push(question.label);
  }
  const duplicatePrompts = [...promptGroups.entries()].filter(([key, rows]) => key && rows.length > 1).map(([prompt, rows]) => ({ prompt, rows }));
  const idGroups = new Map();
  for (const question of allQuestions.filter(q => q.id)) {
    if (!idGroups.has(question.id)) idGroups.set(question.id, []);
    idGroups.get(question.id).push(question.label);
  }
  const duplicateIds = [...idGroups.entries()].filter(([, rows]) => rows.length > 1).map(([id, rows]) => ({ id, rows }));
  if (invalid.length || missingAssets.length || duplicateIds.length) {
    fail(JSON.stringify({ invalid, missingAssets, duplicateIds, duplicatePrompts: duplicatePrompts.slice(0, 30) }, null, 2));
  }

  const groups = Object.groupBy(snapshot.topics, topic => topic.group);
  const report = {
    topics: snapshot.topics.length,
    questions: allQuestions.length,
    topicQuestions: allQuestions.filter(q => q.kind === 'topic').length,
    schoolQuestions: allQuestions.filter(q => q.kind === 'school').length,
    sourceVisualQuestions: allQuestions.filter(q => q.visualUrl).length,
    groupCounts: Object.fromEntries(Object.entries(groups).map(([name, rows]) => [name, rows.length])),
    duplicatePromptGroups: duplicatePrompts.length,
    duplicatePrompts: duplicatePrompts.slice(0, 30),
    missingAssets: missingAssets.length,
    browserErrors: errors
  };
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
