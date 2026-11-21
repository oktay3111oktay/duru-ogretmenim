const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => { window.__DURU_SYNC_TEST_MODE__ = true; localStorage.clear(); });
  await page.goto(pathToFileURL(path.join(root, 'dist', 'index.html')).href, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => !!window.__DURU_V651_TEST__ && !!window.__DURU_TURKISH_V6520_TEST__, undefined, { timeout: 60000 });
  const result = await page.evaluate(() => {
    const structural = value => String(value || '').normalize('NFKC').toLocaleLowerCase('tr-TR').replace(/\d+(?:[.,]\d+)?/g, '#').replace(/[^a-zçğıöşü#]+/g, ' ').trim();
    const names = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler'];
    const sourceData = {
      math: typeof MATH_MEB_OUTCOMES === 'object' ? MATH_MEB_OUTCOMES : [],
      fen: typeof FEN_MODULE_DATA === 'object' ? FEN_MODULE_DATA : [],
      social: typeof SOCIAL_LESSONS === 'object' ? SOCIAL_LESSONS : [],
      turkish: window.__DURU_TURKISH_V6520_TEST__?.curriculum || []
    };
    const courses = {};
    for (const name of names) {
      courses[name] = (topics[name] || []).map((row, topicIndex) => {
        const school = window.__DURU_V651_TEST__.schoolQuestions(name, topicIndex);
        const normal = window.__DURU_CORE_V6570__?.normalBank(name, topicIndex) || [];
        return {
          topicIndex,
          title: row[0],
          schoolCount: school.length,
          v622Count: typeof v622AllQuestions === 'function' ? v622AllQuestions(name, topicIndex).length : 0,
          candidateCount: window.__DURU_V651_TEST__.candidatePool(name, topicIndex).length,
          normalCount: normal.length,
          normalStructuralDuplicates: normal.length - new Set(normal.map(q => structural(q.prompt))).size,
          schoolStructuralDuplicates: school.length - new Set(school.map(q => structural(q.prompt))).size,
          schoolParts: window.__DURU_V651_TEST__.schoolPartsFromRowsV6520(school).map(part => part.length),
          sources: [...new Set(school.map(q => q.privateSource?.sourceId || q.sourceRef?.source || '').filter(Boolean))],
          sourcePages: [...new Set(school.map(q => q.privateSource?.page || q.sourceRef?.page || 0).filter(Boolean))].sort((a,b)=>a-b),
          sampleSchool: school.slice(0, 2).map(q => q.prompt)
        };
      });
    }
    return { courses, sourceData };
  });
  if (process.env.SUMMARY_ONLY === '1') {
    const summary = Object.fromEntries(Object.entries(result.courses).map(([course, rows]) => [course, rows.map(row => ({
      topicIndex: row.topicIndex,
      title: row.title,
      schoolCount: row.schoolCount,
      schoolParts: row.schoolParts,
      v622Count: row.v622Count,
      candidateCount: row.candidateCount,
      normalCount: row.normalCount,
      normalStructuralDuplicates: row.normalStructuralDuplicates,
      schoolStructuralDuplicates: row.schoolStructuralDuplicates,
      sources: row.sources
    }))]));
    process.stdout.write(JSON.stringify(summary, null, 2));
  } else process.stdout.write(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
