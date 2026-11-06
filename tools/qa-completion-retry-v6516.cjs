const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;

async function contextWithState(browser, seed) {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
    localStorage.removeItem('duru_teacher_active_test_v617');
  }, seed);
  return context;
}

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const errors = [];
  const base = {points:221, done:{'Matematik|0':'2026-10-20T10:00:00.000Z'}, history:{'Matematik|1':[{date:'2026-10-21T10:00:00.000Z',score:90}]}, scores:{'Matematik|0':90,'Matematik|1':90}, mistakes:{}, collection:{'Mavi yıldız':true}, badges:['first'], badgeDesigns:{first:{color:'#112233',strokes:[]}}, startedTopicsV651:{}, requiredExtraV651:{}, completedSchoolTestsV6519:{'Matematik|0|0':'2026-10-20T11:00:00.000Z','Matematik|1|0':'2026-10-21T11:00:00.000Z','Matematik|1|1':'2026-10-21T11:05:00.000Z'}, migrations:{mathOfficialV67:true}};

  const statusContext = await contextWithState(browser, base);
  const statusPage = await statusContext.newPage();
  statusPage.on('pageerror', e => errors.push('status: '+e.message));
  const response = await statusPage.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  if(url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılamadı');
  await statusPage.waitForFunction(() => !!window.__DURU_V6516_TEST__, undefined, {timeout:60000});
  const statusResult = await statusPage.evaluate(() => {
    openCourse('Matematik');
    const firstTwo=[...document.querySelectorAll('.course-topic .v651-topic-status')].slice(0,2).map(x=>x.textContent);
    const recovered=state.done['Matematik|1'],before={done:JSON.stringify(state.done),history:JSON.stringify(state.history)};
    const preserved={points:state.points,badges:JSON.stringify(state.badges),badgeDesigns:JSON.stringify(state.badgeDesigns),collection:JSON.stringify(state.collection)};
    Object.keys(topics).forEach(c => (topics[c]||[]).forEach((_,i) => { state.done[c+'|'+i]='2026-10-22T10:00:00.000Z'; for(let n=0;n<(window.__DURU_V651_TEST__?.schoolTestCount(c,i)||0);n++)state.completedSchoolTestsV6519[c+'|'+i+'|'+n]='2026-10-22T11:00:00.000Z'; }));
    const trApi=window.__DURU_TURKISH_V6520_TEST__;
    trApi.curriculum.forEach((topic,index)=>{state.turkishV6520.completed[topic.id]='2026-10-22T10:00:00.000Z';state.turkishV6520.schoolDone[topic.id]=Object.fromEntries(trApi.schoolParts(index).map((_,part)=>[part,'2026-10-22T11:00:00.000Z']));});
    state.requiredExtraV651={};persist();
    const coursesResult={};
    courses.forEach(([c]) => {
      openCourse(c);
      const statuses=c==='Türkçe'?[...document.querySelectorAll('.tr-topic-v6520 small')].map(x=>x.textContent):[...document.querySelectorAll('.v651-topic-status')].map(x=>x.textContent);
      coursesResult[c]={topics:(topics[c]||[]).length,statuses:statuses.length,green:statuses.filter(x=>x==='✅ Konu tamamlandı').length,other:statuses.filter(x=>x!=='✅ Konu tamamlandı')};
    });
    return {firstTwo,recovered,before,preserved,coursesResult,width:document.documentElement.scrollWidth,innerWidth:innerWidth};
  });
  assert(statusResult.recovered, 'Geçmişte bitmiş Matematik 2. konu done kaydına onarılmadı');
  assert(statusResult.firstTwo.every(x=>x==='✅ Konu tamamlandı'), 'İlk iki Matematik konusu yeşil tamamlandı görünmüyor');
  Object.entries(statusResult.coursesResult).forEach(([c,r])=>{
    assert(r.statuses===r.topics, `${c}: ${r.topics} konu için ${r.statuses} durum bulundu`);
    assert(r.green===r.topics&&!r.other.length, `${c}: tüm tamamlanan konular yeşil değil: ${r.other.join(' | ')}`);
  });
  assert(statusResult.preserved.points===221&&statusResult.preserved.badges==='["first"]', 'Öğrenci kaydı korunmadı');
  assert(statusResult.width<=statusResult.innerWidth, '390 px görünümde yatay taşma var');
  await statusContext.close();

  const retryContext = await contextWithState(browser, {...base, history:{'Matematik|0':[{date:'2026-10-20T10:00:00.000Z',score:90}],'Matematik|1':[{date:'2026-10-21T10:00:00.000Z',score:90}]}});
  const retryPage = await retryContext.newPage();
  retryPage.on('pageerror', e => errors.push('retry: '+e.message));
  await retryPage.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  await retryPage.waitForFunction(() => !!window.__DURU_V6516_TEST__, undefined, {timeout:60000});
  const completedRetry = await retryPage.evaluate(() => {
    startQuiz('Matematik',0,'normal');
    const firstId=session?._sessionIdV648;
    choose(0);nextQuestion();
    const leftAt=session.idx;
    exitTestV617();
    const afterExit={notice:!!document.getElementById('paused-test-v617'),active:!!localStorage.getItem('duru_teacher_active_test_v617'),optional:Object.keys(state.optionalRetrySessionsV6516),view};
    startQuiz('Matematik',0,'normal');
    return {firstId,leftAt,afterExit,resumedId:session?._sessionIdV648,resumedAt:session?.idx,view};
  });
  assert(completedRetry.leftAt===1&&completedRetry.resumedAt===1, 'Tamamlanmış test tekrarı kaldığı sorudan sürmedi');
  assert(completedRetry.firstId===completedRetry.resumedId, 'Tamamlanmış test tekrarı yerine yeni test açıldı');
  assert(!completedRetry.afterExit.notice&&!completedRetry.afterExit.active&&completedRetry.afterExit.optional.includes('normal|Matematik|0'), 'Tamamlanmış test tekrarı ana sayfayı zorunlu duraklatma uyarısıyla kilitledi');
  await retryPage.reload({waitUntil:'domcontentloaded',timeout:120000});
  await retryPage.waitForFunction(() => !!window.__DURU_V6521_TEST_FLOW__, undefined, {timeout:60000});
  const completedReload=await retryPage.evaluate(()=>({view,active:!!localStorage.getItem('duru_teacher_active_test_v617'),notice:!!document.getElementById('paused-test-v617'),optional:Object.keys(state.optionalRetrySessionsV6516)}));
  assert(completedReload.view==='home'&&!completedReload.active&&!completedReload.notice&&completedReload.optional.includes('normal|Matematik|0'),'Tamamlanmış tekrar yeniden açılışta zorla gösterildi');
  await retryContext.close();

  const firstContext = await contextWithState(browser, base);
  const firstPage = await firstContext.newPage();
  firstPage.on('pageerror', e => errors.push('first: '+e.message));
  await firstPage.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  await firstPage.waitForFunction(() => !!window.__DURU_V6521_TEST_FLOW__, undefined, {timeout:60000});
  const firstTime = await firstPage.evaluate(() => {
    startQuiz('Matematik',2,'normal');
    exitTestV617();
    return {notice:document.getElementById('paused-test-v617')?.textContent||'',active:!!localStorage.getItem('duru_teacher_active_test_v617'),optional:Object.keys(state.optionalRetrySessionsV6516)};
  });
  assert(!firstTime.active&&!firstTime.notice&&firstTime.optional.includes('normal|Matematik|2'), 'İlk kez yapılan yarım konu testi ana sayfayı engellemeye devam ediyor');
  await firstContext.close();

  const extraFirstContext = await contextWithState(browser, base);
  const extraFirstPage = await extraFirstContext.newPage();
  extraFirstPage.on('pageerror', e => errors.push('extra-first: '+e.message));
  await extraFirstPage.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  await extraFirstPage.waitForFunction(() => !!window.__DURU_V6521_TEST_FLOW__, undefined, {timeout:60000});
  const extraFirst = await extraFirstPage.evaluate(() => {
    startQuiz('Matematik',0,'extra');exitTestV617();
    return {notice:document.getElementById('paused-test-v617')?.textContent||'',active:!!localStorage.getItem('duru_teacher_active_test_v617'),optional:Object.keys(state.optionalRetrySessionsV6516)};
  });
  assert(!extraFirst.active&&!extraFirst.notice&&extraFirst.optional.includes('extra|Matematik|0'), 'İlk kez yapılan yarım Ekstra Test ana sayfayı engellemeye devam ediyor');
  await extraFirstContext.close();

  const extraRetryContext = await contextWithState(browser, {...base, completedExtraTestsV6516:{'Matematik|0':'2026-10-25T10:00:00.000Z'}});
  const extraRetryPage = await extraRetryContext.newPage();
  extraRetryPage.on('pageerror', e => errors.push('extra-retry: '+e.message));
  await extraRetryPage.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  await extraRetryPage.waitForFunction(() => !!window.__DURU_V6516_TEST__, undefined, {timeout:60000});
  const extraRetry = await extraRetryPage.evaluate(() => {
    startQuiz('Matematik',0,'extra');choose(0);nextQuestion();const at=session.idx;exitTestV617();
    const exited={notice:!!document.getElementById('paused-test-v617'),active:!!localStorage.getItem('duru_teacher_active_test_v617'),optional:Object.keys(state.optionalRetrySessionsV6516)};
    startQuiz('Matematik',0,'extra');return {at,exited,resumedAt:session.idx};
  });
  assert(extraRetry.at===1&&extraRetry.resumedAt===1, 'Tamamlanmış Ekstra Test tekrarı kaldığı yerden sürmedi');
  assert(!extraRetry.exited.notice&&!extraRetry.exited.active&&extraRetry.exited.optional.includes('extra|Matematik|0'), 'Tamamlanmış Ekstra Test tekrarı ana sayfayı kilitledi');
  await extraRetryContext.close();

  assert(!errors.length, 'Tarayıcı hataları: '+errors.join(' | '));
  console.log(JSON.stringify({url,statusResult,completedRetry,completedReload,firstTime,extraFirst,extraRetry,errors},null,2));
  await browser.close();
})().catch(error => { console.error(error.stack||error); process.exitCode=1; });
