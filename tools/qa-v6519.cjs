const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (ok, message) => { if (!ok) throw new Error(message); };

function verifySources() {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf8');
  const match = html.match(/const SCHOOL_MANIFEST=(\{.*?\});\s*let manifest=/s);
  assert(match, 'Okul kaynak bildirimi bulunamadı');
  const manifest = JSON.parse(match[1]), sources = new Map(manifest.sources.map(item => [item.id, item]));
  let total = 0, sourced = 0, unattributed = 0;
  const byCourse = {}, failures = [];
  for (const [key, questions] of Object.entries(manifest.schoolQuestions || {})) {
    const split = key.lastIndexOf('|'), course = key.slice(0, split), topic = Number(key.slice(split + 1));
    for (const question of questions) {
      total += 1;
      if (question.c !== course || Number(question.t) !== topic) failures.push(`${key}: soru ders/konu kimliği yanlış`);
      if (!Array.isArray(question.options) || question.options.length !== 4 || new Set(question.options.map(String)).size !== 4 || !question.options.map(String).includes(String(question.answer))) failures.push(`${key}: seçenek/cevap yapısı yanlış`);
      if (!question.privateSource) { unattributed += 1; continue; }
      sourced += 1; byCourse[course] = (byCourse[course] || 0) + 1;
      const source = sources.get(question.privateSource.sourceId), mappings = manifest.mappings?.[key] || [];
      if (!source) { failures.push(`${key}: ${question.privateSource.sourceId} kaynağı yok`); continue; }
      const mapping = mappings.find(row => row.sourceId === source.id);
      if (!mapping || !mapping.pages.map(Number).includes(Number(question.privateSource.page))) failures.push(`${key}: ${source.id} s.${question.privateSource.page} konu eşlemesinde yok`);
      const asset = source.pagePattern?.replace('{page}', question.privateSource.page) || source.url;
      if (!asset || !fs.existsSync(path.resolve(__dirname, '../dist', asset))) failures.push(`${key}: ${asset || source.id} dosyası yok`);
    }
  }
  let exact = 0;
  for (const [key, questions] of Object.entries(manifest.exactQuestions || {})) for (const question of questions) {
    exact += 1;
    const split = key.lastIndexOf('|'), course = key.slice(0, split), topic = Number(key.slice(split + 1));
    if (question.c !== course || Number(question.t) !== topic) failures.push(`${key}: Fenomen soru kimliği yanlış`);
    const source = sources.get(question.privateSource?.sourceId), asset = source?.url;
    if (!source || source.category !== 'school' || !asset || !fs.existsSync(path.resolve(__dirname, '../dist', asset))) failures.push(`${key}: Fenomen görseli eksik`);
    if (!Array.isArray(question.options) || question.options.length !== 4 || new Set(question.options.map(String)).size !== 4 || !question.options.map(String).includes(String(question.answer))) failures.push(`${key}: Fenomen seçenek/cevap yapısı yanlış`);
  }
  assert(!failures.length, failures.join('\n'));
  assert(total === 510 && sourced === 300 && unattributed === 210 && exact === 10, `Kaynak kapsamı yanlış: ${JSON.stringify({total,sourced,unattributed,exact})}`);
  assert(byCourse.Matematik === 230 && byCourse.Türkçe === 30 && byCourse['Fen Bilimleri'] === 40, `Ders kaynak sayıları yanlış: ${JSON.stringify(byCourse)}`);
  return {total, sourced, unattributed, exact, byCourse};
}

(async () => {
  const sources = verifySources();
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const seed = {
    points: 91,
    done: {'Matematik|0':'2026-11-04T08:00:00.000Z'},
    history: {'Matematik|0':[{date:'2026-11-04T08:00:00.000Z',score:100}]},
    scores: {'Matematik|0':100}, mistakes: {}, badges:['first'], badgeDesigns:{first:{color:'#123456',strokes:[]}},
    requiredExtraV651:{'Matematik|0':{required:true}}, completedSchoolTestsV6519:{}, wrongQuestionLogV651:[], wrongGttMasteryV6519:{},
    migrations:{mathOfficialV67:true}, unlockAllV651:false
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, {waitUntil:'domcontentloaded', timeout:120000});
  if (url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılamadı');
  await page.waitForFunction(() => !!(window.__DURU_V651_TEST__ && window.__DURU_DAILY_V6519_TEST__ && window.__DURU_PROGRESS_V6513_TEST__), undefined, {timeout:60000});
  await page.waitForTimeout(80);

  const result = await page.evaluate(() => {
    const api = window.__DURU_V651_TEST__, dailyApi = window.__DURU_DAILY_V6519_TEST__;
    openCourse('Matematik');
    const cards = [...document.querySelectorAll('.course-topic,.fen-item,.rel-item,.teacher-lang-topic,.ger-topic,.eng-card')].filter(card => card.querySelector('.v651-topic-status'));
    const before = {
      first: cards[0]?.querySelector('.v651-topic-status')?.textContent,
      second: cards[1]?.querySelector('.v651-topic-status')?.textContent,
      secondAccessible: api.topicAccessible('Matematik', 1),
      schoolLabel: cards[0] ? [...cards[0].querySelectorAll('button')].find(button => /Okul Testi/.test(button.textContent || ''))?.textContent : '',
      extraLabel: cards[0] ? [...cards[0].querySelectorAll('button')].find(button => /Ekstra test/i.test(button.textContent || ''))?.textContent : ''
    };

    const schoolQuestion = api.schoolQuestions('Matematik', 0)[0];
    session = {kind:'school', keys:['Matematik|0'], qs:[schoolQuestion], answers:[schoolQuestion.answer], pending:[], initial:1, repair:0, _schoolTestIndexV6519:0};
    course = 'Matematik'; topic = 0;
    finishSession();
    const schoolStored = !!state.completedSchoolTestsV6519['Matematik|0|0'];
    openCourse('Matematik');
    const afterCards = [...document.querySelectorAll('.course-topic,.fen-item,.rel-item,.teacher-lang-topic,.ger-topic,.eng-card')].filter(card => card.querySelector('.v651-topic-status'));
    const after = {first:afterCards[0]?.querySelector('.v651-topic-status')?.textContent, secondAccessible:api.topicAccessible('Matematik',1)};

    const q = api.schoolQuestions('Matematik',0)[1], id = api.questionId(q);
    state.wrongQuestionLogV651 = [{...q,id,eventId:'qa-wrong'}];
    state.wrongGttMasteryV6519 = {};
    api.processWrongGttMastery({_wrongOnlyV651:true,_wrongGttRunIdV6519:'run-1',qs:[q],answers:[q.answer],pending:[]});
    const afterOne = api.wrongPool('').some(item => item.id === id);
    api.processWrongGttMastery({_wrongOnlyV651:true,_wrongGttRunIdV6519:'run-2',qs:[q],answers:[q.options.find(option => String(option) !== String(q.answer))],pending:[]});
    const reset = state.wrongGttMasteryV6519[id].streak;
    api.processWrongGttMastery({_wrongOnlyV651:true,_wrongGttRunIdV6519:'run-3',qs:[q],answers:[q.answer],pending:[]});
    api.processWrongGttMastery({_wrongOnlyV651:true,_wrongGttRunIdV6519:'run-4',qs:[q],answers:[q.answer],pending:[]});
    const afterTwo = api.wrongPool('').some(item => item.id === id), mastery = state.wrongGttMasteryV6519[id];

    home();
    const gdsText = document.querySelector('.teacher-gtt-card')?.textContent.replace(/\s+/g,' ').trim() || '';
    const startText = document.getElementById('daily-toggle-v6519')?.textContent;
    toggleDailyStudyV6519();
    dailyApi.recordAnswer({c:'Matematik',answer:'A'},'A','test');
    dailyApi.recordAnswer({c:'Türkçe',answer:'B'},'C','test');
    const activeSummary = dailyApi.summary(), activeText = document.getElementById('daily-toggle-v6519')?.textContent;
    toggleDailyStudyV6519();
    const stoppedText = document.getElementById('daily-toggle-v6519')?.textContent;
    state.dailyStudyV6519 = {day:'2000-01-01',active:true,segments:{old:{day:'2000-01-01',total:9,correct:9,wrong:0,byCourse:{}}}};
    dailyApi.ensureToday(true);
    const midnight = dailyApi.summary();

    parentView();
    const progress = window.__DURU_PROGRESS_V6513_TEST__.progress().find(row => row.name === 'Matematik');
    return {before,schoolStored,after,afterOne,reset,afterTwo,mastery,gdsText,startText,activeText,stoppedText,activeSummary:{total:activeSummary.total,correct:activeSummary.correct,wrong:activeSummary.wrong,byCourse:activeSummary.byCourse},midnight:{active:midnight.daily.active,total:midnight.total},progress,points:state.points,badges:state.badges,width:document.documentElement.scrollWidth,innerWidth};
  });

  assert(result.before.first === '🏫 Okul Testi bekliyor', 'Konu Testinden sonra Okul Testi bekleme durumu görünmüyor');
  assert(result.before.second === '🔒 Kilitli' && !result.before.secondAccessible, 'Okul Testi bitmeden sonraki konu açıldı');
  assert(result.before.schoolLabel === '🏫 Okul Testi' && !result.before.schoolLabel.includes('+2'), `Okul Testi +2 etiketi kaldırılmadı: ${result.before.schoolLabel}`);
  assert(result.before.extraLabel === '✨ Ekstra test', 'Ekstra Test yanlışlıkla zorunlu görünüyor');
  assert(result.schoolStored && result.after.first === '✅ Konu tamamlandı' && result.after.secondAccessible, 'Okul Testi tamamlanınca sonraki konu açılmadı');
  assert(result.afterOne && result.reset === 0 && !result.afterTwo && result.mastery.streak === 2 && result.mastery.resolved, 'Yanlış-GTT iki ardışık doğru kuralı çalışmıyor');
  assert(result.gdsText.includes('GDS') && result.gdsText.includes('Genel Değerlendirme Testi') && !result.gdsText.includes('Genel tekrar testleri'), `Ana sayfa GDS etiketi yanlış: ${result.gdsText}`);
  assert(result.startText === 'Başla' && result.activeText === 'Bitir' && result.stoppedText === 'Başla', 'Günlük Çalışma düğme geçişi yanlış');
  assert(result.activeSummary.total === 2 && result.activeSummary.correct === 1 && result.activeSummary.wrong === 1 && result.activeSummary.byCourse.Matematik.correct === 1 && result.activeSummary.byCourse.Türkçe.wrong === 1, 'Günlük soru sayacı yanlış');
  assert(result.midnight.active && result.midnight.total === 0, 'Gece yarısı sayaç sıfırlama/aktif devam kuralı yanlış');
  assert(result.progress.completed === 1 && result.progress.schoolCompleted === 1 && result.progress.schoolPending === 0, 'Veli ilerlemesi Okul Testini hesaba katmıyor');
  assert(result.points >= 91 && JSON.stringify(result.badges).includes('first'), 'Mevcut öğrenci puanı/rozeti korunmadı');
  assert(result.width <= result.innerWidth + 1, '390 piksel görünümde yatay taşma var');
  assert(!errors.length, 'Tarayıcı hataları: ' + errors.join(' | '));
  console.log(JSON.stringify({url,sources,result,errors}, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
