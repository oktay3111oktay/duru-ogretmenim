const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (ok, message) => {if (!ok) throw new Error(message)};

(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport: {width: 390, height: 844}});
  const original = {
    points: 497, done: {'Fen Bilimleri|0': '2026-10-20T10:00:00.000Z', 'Türkçe|0': true},
    scores: {'Fen Bilimleri|0': 85}, mistakes: {'Fen Bilimleri|0': [{prompt: 'Eski soru'}]},
    history: {'Fen Bilimleri|0': [{date: '2026-10-20', score: 85}]},
    badges: ['first'], badgeDesigns: {first: {color: '#112233', strokes: [{color: '#233454', width: 4, points: [[10,10],[30,30]]}]}},
    collection: {'Minik panda': true}, days: ['2026-10-20'], custom: [{title: 'Korunacak içerik'}],
    completedSchoolTestsV6519: {'Fen Bilimleri|0|0':'2026-10-20T11:00:00.000Z','Türkçe|0|0':'2026-10-20T11:00:00.000Z'},
    wrongQuestionLogV651: [{id:'legacy-turkish-school',c:'Türkçe',t:0,kind:'school',
      prompt:'Okul çalışma kitabındaki “Oyun Durdu!” ile eşleşen beceriyi düşün. Bir metnin konusu nedir?',
      answer:'Ana olay', options:['Ana olay','Sayfa sayısı','Kitabın fiyatı','Yazarın yaşı'],
      privateSource:{sourceId:'turkish_eck_1',page:5,label:'Türkçe EÇK 1 · dosya s. 5'}}],
    migrations: {mathOfficialV67: true}
  };
  await context.addInitScript(seed => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(seed));
  }, original);
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 120000});
  if (url.startsWith('http')) assert(response?.ok(), 'Uygulama sayfası açılmadı');
  if (url.startsWith('https://')) {
    await page.waitForFunction(() => navigator.serviceWorker?.controller && sessionStorage.getItem('duru-v651-controller-reload') === '1', undefined, {timeout:60000});
    await page.waitForLoadState('load');
  }
  await page.waitForSelector('#app h1');
  await page.waitForFunction(() => !!(window.__DURU_V649_TEST__ && window.__DURU_V651_TEST__ && window.__DURU_PROGRESS_V6513_TEST__ && window.__DURU_FENOMEN_V6520__), undefined, {timeout:60000});
  const before = await page.evaluate(() => {
    const v = window.__DURU_V651_TEST__, p = window.__DURU_V649_TEST__;
    if (!v || !p) throw new Error('Test API eksik');
    const stateBefore = JSON.parse(localStorage.getItem('duru_teacher_reset_v6_5'));
    const trApi=window.__DURU_TURKISH_V6520_TEST__;
    const counts = {
      Matematik:(topics.Matematik||[]).reduce((n,_,i)=>n+v.schoolQuestions('Matematik',i).length,0),
      Türkçe:trApi.curriculum.reduce((n,topic)=>n+(topic.schoolQuestions||[]).length,0),
      'Fen Bilimleri':(topics['Fen Bilimleri']||[]).reduce((n,_,i)=>n+p.school('Fen Bilimleri',i).length,0)
    };
    const turkishSchool=trApi.curriculum.flatMap(topic=>topic.schoolQuestions||[]);
    const turkishPractice=trApi.curriculum.flatMap(topic=>topic.topicQuestions||[]);
    const fen = p.school('Fen Bilimleri',0);
    const badgeSvg = badgeMakeSVG({title:'Çizimli kanatlı kedi',promptText:'kanatlı kedi',primary:'#79aef7',edge:'#ffd77b',
      strokes:[{color:'#233454',width:4,points:[[10,10],[30,30],[50,12]]}]});
    const pending = v.wrongPool('Fen Bilimleri');
    const oldTurkish = v.wrongPool('Türkçe').find(q => q.id === 'legacy-turkish-school');
    state.done['Fen Bilimleri|1'] = true;
    const futureTopicSeeded = v.wrongPool('Fen Bilimleri').some(q => q.t === 1 && q.newInV6513);
    delete state.done['Fen Bilimleri|1'];
    state.requiredExtraV651['Fen Bilimleri|0'] = {required:true};
    const blockedProgress = window.__DURU_PROGRESS_V6513_TEST__.progress().find(x => x.name === 'Fen Bilimleri').percent;
    delete state.requiredExtraV651['Fen Bilimleri|0'];
    parentView();
    const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes('İlerleme'));
    button?.click();
    return {stateBefore, counts,
      turkishSourced: turkishSchool.every(q => q.visualUrl || q.privateSource?.sourceId),
      turkishPracticeUnattributed: turkishPractice.every(q => !q.privateSource && !q.visualUrl),
      fenPages: fen.map(q => q.privateSource.page), pending: pending.map(q => q.id),
      oldTurkish: oldTurkish && {prompt: oldTurkish.prompt, source: oldTurkish.privateSource}, blockedProgress, futureTopicSeeded,
      progress: window.__DURU_PROGRESS_V6513_TEST__.progress(), hasButton: !!button,
      panelVisible: !document.getElementById('veli-ilerleme-v6513')?.hidden,
      badgeSvgOkay: badgeSvg.startsWith('<svg') && badgeSvg.includes('M10.0 10.0 L30.0 30.0 L50.0 12.0'),
      width: document.documentElement.scrollWidth, innerWidth};
  });
  for (const key of ['points','done','scores','mistakes','history','badges','badgeDesigns','collection','days','custom','completedSchoolTestsV6519'])
    assert(JSON.stringify(before.stateBefore[key]) === JSON.stringify(original[key]), `Öğrenci kaydı değişti: ${key}`);
  assert(JSON.stringify(before.counts) === JSON.stringify({Matematik:308,Türkçe:712,'Fen Bilimleri':40}), 'Soru sayıları');
  assert(before.turkishSourced && before.turkishPracticeUnattributed, 'Türkçe kaynak/pekiştirme ayrımı yanlış');
  assert(before.fenPages.every(p => p === 3 || p === 4), 'Fen 0 testinde deney/ödev sayfası bağlantısı var');
  assert(before.pending.length === 10, 'Tamamlanmış Fen testinin yeni soruları GTT havuzunda değil');
  assert(before.oldTurkish?.source === null && before.oldTurkish.prompt === 'Bir metnin konusu nedir?', 'Eski Türkçe GTT kaynak atfı temizlenmedi');
  assert(before.blockedProgress === 5, 'İsteğe bağlı Ekstra Test ilerlemeyi yanlışlıkla engelledi');
  assert(!before.futureTopicSeeded, 'Güncellemeden sonra tamamlanan konu gereksiz yere GTT’ye eklendi');
  assert(before.progress.find(x => x.name === 'Fen Bilimleri').percent === 5, 'Fen ilerleme oranı yanlış');
  assert(before.progress.find(x => x.name === 'Türkçe').legacyMebCompleted === 1 && before.progress.find(x => x.name === 'Türkçe').legacyMebPercent === 4, 'Önceki Türkçe MEB ilerlemesi korunmadı');
  assert(before.hasButton && before.panelVisible, 'Veli ilerleme düğmesi açılmadı');
  assert(before.badgeSvgOkay, 'Rozet çizimi SVG içinde korunmadı');
  assert(before.width <= before.innerWidth + 1, '390 pikselde yatay taşma');
  const images = [];
  for (const [source, sourcePage] of [['science_eck',3],['math_eck',26],['turkish_eck_1',7],['turkish_eck_2',6],['turkish_deep_eck',90],['fenomen_1_p1',null]]) {
    await page.evaluate(([id,p]) => openPrivateSourceV649(id,p), [source,sourcePage]);
    await page.waitForFunction(() => document.querySelector('.duru-private-modal.open img')?.naturalWidth > 0, undefined, {timeout:20000});
    images.push(await page.locator('.duru-private-modal.open img').evaluate(img => ({src:img.src,width:img.naturalWidth})));
    await page.evaluate(() => closePrivateSourceV649());
  }
  const after = await page.evaluate(() => {
    startWrongGttV651('Fen Bilimleri');
    const asked = session.qs.map(q => q.id);
    while (session.phase === 'test' && session.idx < session.qs.length) {
      const q = session.qs[session.idx];
      choose(q.options.indexOf(q.answer));
      nextQuestion();
    }
    finishSession();
    return {asked, resolved: Object.keys(state.schoolNewQuestionResolvedV6513).length,
      remaining: window.__DURU_V651_TEST__.newQuestionPending('Fen Bilimleri'),
      oldMistakes: state.mistakes['Fen Bilimleri|0'], oldDone: state.done['Fen Bilimleri|0'],
      badgeDesign: state.badgeDesigns.first,
      completion: !!document.querySelector('.completion-card')};
  });
  assert(after.asked.length === 10 && after.asked.every(id => before.pending.includes(id)), 'GTT yeni soruları sormadı');
  assert(after.resolved === 10 && after.remaining === 0, 'Yeni sorular GTT sonrası bekliyor');
  assert(after.oldMistakes.length === 1 && after.oldDone === original.done['Fen Bilimleri|0'], 'Eski ilerleme değişti');
  assert(JSON.stringify(after.badgeDesign) === JSON.stringify(original.badgeDesigns.first), 'Rozet tasarımı kayboldu');
  assert(after.completion, 'GTT tamamlanmadı');
  assert(!errors.length, `Tarayıcı hatası: ${errors.join(' | ')}`);
  console.log(JSON.stringify({url, before: {counts: before.counts, fenPages: before.fenPages, pending: before.pending.length,
    progress: before.progress.map(x => ({course:x.name,percent:x.percent})), width:before.width},
    images, after: {asked:after.asked.length,resolved:after.resolved,remaining:after.remaining},errors}, null, 2));
  await browser.close();
})().catch(error => {console.error(error.stack || error);process.exitCode = 1});
