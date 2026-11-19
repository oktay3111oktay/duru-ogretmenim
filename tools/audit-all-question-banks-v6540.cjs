const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const fail = message => { throw new Error(message); };

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.clear();
  });
  await page.goto(pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => typeof makeQuestion === 'function' && !!window.__DURU_V651_TEST__, undefined, { timeout: 60000 });
  const report = await page.evaluate(() => {
    const normalize = value => String(value || '').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9äöüß]+/g, ' ').trim();
    const translationPattern = /türkçe karşılığı|türkçede ne demektir|hangi türkçe|what is the turkish|türkçesi/i;
    const definitionPattern = /kavramı aşağıdakilerden hangisini ifade eder|hangisi.*tanımıdır|nedir\?$/i;
    const courseNames = ['Matematik','Türkçe','Fen Bilimleri','Sosyal Bilgiler','Almanca','İngilizce','Din Kültürü','Peygamberimizin Hayatı'];
    const allPrompts = new Map();
    const courses = {};
    for (const courseName of courseNames) {
      const rows = topics[courseName] || [];
      const topicRows = [];
      for (let topicIndex = 0; topicIndex < rows.length; topicIndex += 1) {
        const questions = [];
        for (let index = 0; index < 10; index += 1) {
          const question = makeQuestion(courseName, topicIndex, index);
          if (!question) continue;
          const prompt = String(question.prompt || '');
          const normalized = normalize(prompt);
          if (!allPrompts.has(normalized)) allPrompts.set(normalized, []);
          allPrompts.get(normalized).push(`${courseName}|${topicIndex}|${index}`);
          questions.push({
            prompt,
            answer: String(question.answer || ''),
            options: Array.isArray(question.options) ? question.options.map(String) : [],
            translation: translationPattern.test(prompt),
            definition: definitionPattern.test(prompt),
            sourceLinked: !!(question.privateSource || question.sourceRef || question.sourceLabel || question.visualUrl)
          });
        }
        topicRows.push({
          index: topicIndex,
          title: String(rows[topicIndex]?.[0] || ''),
          questions: questions.length,
          translationQuestions: questions.filter(question => question.translation).length,
          definitionQuestions: questions.filter(question => question.definition).length,
          sourceLinkedQuestions: questions.filter(question => question.sourceLinked).length,
          invalidQuestions: questions.filter(question => !question.prompt || question.options.length !== 4 || new Set(question.options).size !== 4 || question.options.filter(option => option === question.answer).length !== 1).length,
          uniquePrompts: new Set(questions.map(question => normalize(question.prompt))).size,
          samplePrompts: questions.slice(0, 3).map(question => question.prompt)
        });
      }
      const school = [];
      for (let topicIndex = 0; topicIndex < rows.length; topicIndex += 1) {
        const base = window.__DURU_V649_TEST__?.school?.(courseName, topicIndex) || [];
        const fenomen = window.__DURU_FENOMEN_V6520__?.school?.(courseName, topicIndex) || [];
        const din = window.__DURU_DIN_511_TEST__?.school?.(courseName, topicIndex) || [];
        school.push({ topicIndex, count: base.length + fenomen.length + din.length });
      }
      courses[courseName] = {
        topics: topicRows.length,
        normalQuestions: topicRows.reduce((sum, row) => sum + row.questions, 0),
        translationQuestions: topicRows.reduce((sum, row) => sum + row.translationQuestions, 0),
        definitionQuestions: topicRows.reduce((sum, row) => sum + row.definitionQuestions, 0),
        sourceLinkedNormalQuestions: topicRows.reduce((sum, row) => sum + row.sourceLinkedQuestions, 0),
        invalidQuestions: topicRows.reduce((sum, row) => sum + row.invalidQuestions, 0),
        schoolQuestions: school.reduce((sum, row) => sum + row.count, 0),
        topicsWithoutSchoolQuestions: school.filter(row => !row.count).map(row => row.topicIndex),
        topicRows
      };
    }
    const duplicatePromptGroups = [...allPrompts.entries()].filter(([prompt, refs]) => prompt && refs.length > 1).map(([prompt, refs]) => ({ prompt, refs }));
    return { courses, duplicatePromptGroups, errors: [] };
  });
  report.errors = errors;
  const sourceAuditPath = path.resolve(__dirname, '../../tmp/coverage-20261119/all-meb-pdfs.json');
  if (fs.existsSync(sourceAuditPath)) {
    const sourceAudit = JSON.parse(fs.readFileSync(sourceAuditPath, 'utf8'));
    const sourceFiles = {
      'Matematik': ['matematik5-1.pdf','matematik5-2.pdf'],
      'Türkçe': ['Türkçe-1.pdf','Türkçe - 2.pdf'],
      'Fen Bilimleri': ['fenbilimleri5-1.pdf','fenbilimleri5-2.pdf'],
      'Sosyal Bilgiler': ['sosyalbilgiler5-1.pdf','sosyalbilgiler5-2.pdf'],
      'Almanca': ['almanca5ckckl.pdf','almanca5dkckl.pdf','almanca5okckl.pdf'],
      'İngilizce': ['ingilizce5ck.pdf','ingilizce5dk.pdf','ingilizce5ok.pdf'],
      'Din Kültürü': ['din-kulturu-ve-ahlak-bilgisi-5sinif-ders-kitabi_20261003_183932_159.pdf'],
      'Peygamberimizin Hayatı': ['peygamberimizin-hayati-5sinif-ders-kitabi_20261003_213845_403.pdf']
    };
    const norm = value => String(value || '').normalize('NFKC').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9äöüß]+/g, ' ').trim();
    for (const [courseName, course] of Object.entries(report.courses)) {
      const files = sourceAudit.files.filter(file => (sourceFiles[courseName] || []).includes(file.name));
      const sourceText = norm(files.flatMap(file => file.pageText.map(page => page.text)).join(' '));
      course.sourceFiles = files.map(file => ({ name: file.name, pages: file.pages, textCharacters: file.textCharacters }));
      course.topicRows.forEach(topic => {
        const title = norm(topic.title.replace(/^[A-ZÇĞİÖŞÜ]+\.\d+(?:\.\d+)*\s*·\s*/i, ''));
        const tokens = [...new Set(title.split(' ').filter(token => token.length > 2))];
        topic.sourceTitleTokenCoverage = tokens.length ? tokens.filter(token => sourceText.includes(token)).length / tokens.length : 0;
        topic.sourceTitleExact = !!title && sourceText.includes(title);
      });
      course.sourceHeadingMatches = course.topicRows.filter(topic => topic.sourceTitleExact || topic.sourceTitleTokenCoverage >= 0.75).length;
    }
  }
  if (errors.length) fail(`Tarayıcı hataları: ${errors.join(' | ')}`);
  if (process.env.SUMMARY_ONLY === '1') {
    const courses = Object.fromEntries(Object.entries(report.courses).map(([name, row]) => [name, {
      topics: row.topics,
      normalQuestions: row.normalQuestions,
      translationQuestions: row.translationQuestions,
      definitionQuestions: row.definitionQuestions,
      sourceLinkedNormalQuestions: row.sourceLinkedNormalQuestions,
      invalidQuestions: row.invalidQuestions,
      schoolQuestions: row.schoolQuestions,
      topicsWithoutSchoolQuestions: row.topicsWithoutSchoolQuestions.length,
      topicsWithRepeatedPrompts: row.topicRows.filter(topic => topic.uniquePrompts < topic.questions).length,
      repeatedQuestionsWithinTopics: row.topicRows.reduce((sum, topic) => sum + (topic.questions - topic.uniquePrompts), 0),
      repeatedTopicTitles: row.topicRows.filter(topic => topic.uniquePrompts < topic.questions).map(topic => topic.title),
      sourceFiles: row.sourceFiles,
      sourceHeadingMatches: row.sourceHeadingMatches
    }]));
    const duplicatePromptGroupsByCourse = {};
    for (const group of report.duplicatePromptGroups) {
      for (const courseName of new Set(group.refs.map(ref => ref.split('|')[0]))) duplicatePromptGroupsByCourse[courseName] = (duplicatePromptGroupsByCourse[courseName] || 0) + 1;
    }
    console.log(JSON.stringify({ courses, duplicatePromptGroups: report.duplicatePromptGroups.length, duplicatePromptGroupsByCourse, errors: report.errors }, null, 2));
  } else console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
