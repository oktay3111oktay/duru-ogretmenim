const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const seed = {
    points:321, done:{'Türkçe|0':'2026-10-01T00:00:00.000Z','Matematik|0':'2026-10-02T00:00:00.000Z'},
    history:{'Türkçe|0':[{date:'2026-10-01T00:00:00.000Z',score:90}]},
    scores:{'Türkçe|0':90}, mistakes:{'Türkçe|0':[{prompt:'Korunacak yanlış'}]},
    badges:['first'], collection:{'Minik panda':true}, days:['2026-10-01'],
    completedSchoolTestsV6519:{'Türkçe|0|0':'2026-10-01T01:00:00.000Z'}, migrations:{mathOfficialV67:true}
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage(), errors=[];
  page.on('pageerror', error => errors.push(error.message));
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  if (url.startsWith('http')) assert(response?.ok(), 'Uygulama açılamadı');
  await page.waitForFunction(() => !!(window.__DURU_TURKISH_V6520_TEST__ && window.__DURU_DAILY_V6519_TEST__), undefined, {timeout:60000});
  const before = await page.evaluate(original => {
    const api=window.__DURU_TURKISH_V6520_TEST__, curriculum=api.curriculum;
    openCourse('Türkçe');
    const groups=[...document.querySelectorAll('.tr-group-v6520')].map(x=>x.textContent.trim());
    const statuses=[...document.querySelectorAll('.tr-topic-v6520 small')].slice(0,3).map(x=>x.textContent.trim());
    const preservedKeys=Object.fromEntries(['points','done','history','scores','mistakes','badges','collection','days','completedSchoolTestsV6519'].map(key=>[key,{same:JSON.stringify(state[key])===JSON.stringify(original[key]),actual:state[key],expected:original[key]}]));
    const preserved=Object.values(preservedKeys).every(x=>x.same);
    const deepIndex=curriculum.findIndex(x=>x.id==='deep-sozcukte-anlam');
    return {groups,statuses,preserved,preservedKeys,count:curriculum.length,deepIndex,deepParts:api.schoolParts(deepIndex).map(x=>x.length),width:document.documentElement.scrollWidth,innerWidth};
  }, seed);
  assert(JSON.stringify(before.groups)===JSON.stringify(['İELEV Kaynakları','İELEV Derin Öğrenme','MEB Kaynakları']),'Başlık sırası yanlış');
  assert(before.count>=20,'Türkçe konu sayısı eksik');
  assert(before.statuses[0]==='📖 Öğrenmeye hazır'&&before.statuses[1]==='🔒 Kilitli','İlk kilit sırası yanlış');
  assert(before.preserved,`Eski öğrenci verisi yüklemede değişti: ${JSON.stringify(before.preservedKeys)}`);
  assert(before.deepParts.length>=3&&before.deepParts.slice(0,-1).every(n=>n===10)&&before.deepParts.at(-1)>=10,'Okul testi 10+son kalan kuralı yanlış');
  assert(before.width<=before.innerWidth+1,'390 pikselde taşma var');

  const afterNormal = await page.evaluate(() => {
    startQuiz('Türkçe',0,'normal');
    while(session?.phase==='test' && session.idx < session.qs.length) { const q=session.qs[session.idx]; choose(q.options.indexOf(q.answer)); nextQuestion(); }
    if(session?.pending?.length) throw new Error('Doğru cevaplara rağmen düzeltme oluştu');
    finishSession();
    const api=window.__DURU_TURKISH_V6520_TEST__;
    return {done:api.isDone(0),next:api.accessible(1),legacyDone:state.done['Türkçe|0'],legacyHistory:state.history['Türkçe|0'],schoolParts:api.schoolParts(0).length};
  });
  assert(afterNormal.done&&!afterNormal.next&&afterNormal.schoolParts===1,'Konu testi sonrası okul testi kilidi yanlış');
  assert(afterNormal.legacyDone===seed.done['Türkçe|0']&&JSON.stringify(afterNormal.legacyHistory)===JSON.stringify(seed.history['Türkçe|0']),'Eski Türkçe ilerlemesi değişti');

  const afterSchool = await page.evaluate(() => {
    startTurkishSchoolV6520(0);
    while(session?.phase==='test' && session.idx < session.qs.length) { const q=session.qs[session.idx]; choose(q.options.indexOf(q.answer)); nextQuestion(); }
    finishSession();
    const api=window.__DURU_TURKISH_V6520_TEST__;
    return {school:api.schoolComplete(0),next:api.accessible(1),nextCycle:state.turkishV6520.schoolNext['ilelev-nokta-virgul'],legacyDone:state.done['Türkçe|0']};
  });
  assert(afterSchool.school&&afterSchool.next&&afterSchool.nextCycle===0,'Okul testi tamamlama/döngü kuralı yanlış');
  assert(afterSchool.legacyDone===seed.done['Türkçe|0'],'Okul testi eski kaydı değiştirdi');

  const daily = await page.evaluate(() => {
    state.dailyStudyV6519={day:window.__DURU_DAILY_V6519_TEST__.dayKey(),active:true,segments:{}};
    const q={c:'Türkçe',t:0,prompt:'Günlük yanlış denemesi',answer:'B',options:['A','B','C','D'],explain:'B doğrudur.',visualUrl:'assets/school-turkish-nokta-virgul-v6520-p-2.webp'};
    window.__DURU_DAILY_V6519_TEST__.recordAnswer(q,'A','test');
    window.__DURU_DAILY_V6519_TEST__.recordAnswer(q,'C','test');
    const result=window.__DURU_DAILY_V6519_TEST__.summary();
    const markup=window.__DURU_DAILY_V6519_TEST__.wrongMarkup();
    state.dailyStudyV6519.day='2000-01-01';
    const reset=window.__DURU_DAILY_V6519_TEST__.ensureToday(false);
    return {wrong:result.wrong,details:result.wrongDetails.length,markup,resetWrong:Object.values(reset.segments||{}).reduce((n,s)=>n+(s.wrong||0),0)};
  });
  assert(daily.wrong===2&&daily.details===2&&daily.markup.includes('Günlük yanlış denemesi')&&daily.markup.includes('Verilen cevap'),'Aynı sorunun birden çok günlük yanlış kaydı eksik');
  assert(daily.resetWrong===0,'Günlük yanlışlar gün değişiminde silinmedi');

  const visual = await page.evaluate(deepIndex => {
    state.unlockAllV651=true; state.turkishV6520.completed['deep-sozcukte-anlam']=new Date().toISOString();
    startTurkishSchoolV6520(deepIndex);
    const q=session.qs[0]; question();
    const img=document.querySelector('.tr-question-source-v6520 img');
    return {prompt:q.prompt,src:img?.getAttribute('src')||'',label:document.querySelector('.tr-question-source-v6520 b')?.textContent||''};
  }, before.deepIndex);
  assert(visual.prompt.includes('kaynak sayfasından çöz')&&visual.src.includes('school-turkish-deep-v6520'),'Derin Öğrenme görsel sorusu açılmadı');
  assert(!errors.length,`Tarayıcı hatası: ${errors.join(' | ')}`);
  console.log(JSON.stringify({url,before,afterNormal,afterSchool,daily:{wrong:daily.wrong,details:daily.details,resetWrong:daily.resetWrong},visual,errors},null,2));
  await browser.close();
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
