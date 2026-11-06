const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (ok, message) => { if (!ok) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const seed = {
    points:91, done:{}, history:{}, scores:{}, mistakes:{}, badges:['first'], badgeDesigns:{first:{color:'#123456',strokes:[]}},
    migrations:{mathOfficialV67:true}, unlockAllV651:false, requiredExtraV651:{}, startedTopicsV651:{
      'Matematik|1':'2026-10-01','Matematik|2':'2026-10-02','Türkçe|1':'2026-10-01','Türkçe|2':'2026-10-02',
      'Fen Bilimleri|1':'2026-10-01','Fen Bilimleri|2':'2026-10-02','Sosyal Bilgiler|1':'2026-10-01','Sosyal Bilgiler|2':'2026-10-02',
      'Almanca|1':'2026-10-01','Almanca|2':'2026-10-02','İngilizce|1':'2026-10-01','İngilizce|2':'2026-10-02',
      'Din Kültürü|1':'2026-10-01','Din Kültürü|2':'2026-10-02','Peygamberimizin Hayatı|0':'2026-10-01','Peygamberimizin Hayatı|1':'2026-10-02'
    }
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage(), errors=[];
  page.on('pageerror', error => errors.push(error.message));
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  if(url.startsWith('http'))assert(response?.ok(), 'Canlı uygulama açılamadı');
  await page.waitForFunction(() => !!window.__DURU_V651_TEST__, undefined, {timeout:60000});
  const result = await page.evaluate(() => {
    const rows={};
    courses.forEach(([c]) => {
      openCourse(c);
      if(c==='Türkçe'){
        const api=window.__DURU_TURKISH_V6520_TEST__,cards=[...document.querySelectorAll('.tr-topic-v6520')];
        const inspect=index=>{const card=cards[index],buttons=[...(card?.querySelectorAll('button')||[])].filter(button=>/Konuyu öğren|Konu testi/i.test(button.textContent||''));return{status:card?.querySelector('small')?.textContent||'',disabled:buttons.length>0&&buttons.every(button=>button.disabled)}};
        rows[c]={first:inspect(0),second:inspect(1),third:inspect(2),accessible:[0,1,2].map(i=>api.accessible(i))};
        return;
      }
      const cards=[...document.querySelectorAll('.course-topic,.fen-item,.rel-item,.teacher-lang-topic,.ger-topic,.eng-card')]
        .filter(card=>card.querySelector('.v651-topic-status'));
      const inspect = index => {
        const card=cards[index],status=card?.querySelector('.v651-topic-status')?.textContent||'';
        const buttons=[...(card?.querySelectorAll('button')||[])].filter(button=>/Konuyu öğren|Konu testi/i.test(button.textContent||''));
        return {status,disabled:buttons.length>0&&buttons.every(button=>button.disabled)};
      };
      rows[c]={first:inspect(0),second:inspect(1),third:inspect(2),accessible:[0,1,2].map(i=>topicAccessibleV651(c,i))};
    });
    const before=JSON.stringify(state.startedTopicsV651);
    const trApi=window.__DURU_TURKISH_V6520_TEST__,firstId=trApi.curriculum[0].id;
    state.turkishV6520.completed[firstId]='2026-11-03T00:00:00.000Z';persist();openCourse('Türkçe');
    const turkishPending=[...document.querySelectorAll('.tr-topic-v6520 small')].slice(0,3).map(x=>x.textContent);
    state.turkishV6520.schoolDone[firstId]={0:'2026-11-03T01:00:00.000Z'};persist();openCourse('Türkçe');
    const turkishAfter=[...document.querySelectorAll('.tr-topic-v6520 small')].slice(0,3).map(x=>x.textContent);
    return {rows,turkishPending,turkishAfter,startedPreserved:before===JSON.stringify(state.startedTopicsV651),points:state.points,badges:state.badges,width:document.documentElement.scrollWidth,innerWidth};
  });
  for(const [course,row] of Object.entries(result.rows)){
    if(course==='Peygamberimizin Hayatı'){
      assert(row.first.status==='🔒 Kilitli'&&row.first.disabled&&!row.accessible[0], `${course}: Din tamamlanmadan ilk konu açık`);
    }else{
      assert(row.first.status!=='🔒 Kilitli'&&row.accessible[0], `${course}: ilk konu yanlışlıkla kilitli`);
    }
    assert(row.second.status==='🔒 Kilitli'&&row.second.disabled&&!row.accessible[1], `${course}: başlanmış ikinci konu açık kaldı`);
    assert(row.third.status==='🔒 Kilitli'&&row.third.disabled&&!row.accessible[2], `${course}: başlanmış üçüncü konu açık kaldı`);
  }
  assert(result.turkishPending[0]==='🏫 Okul Testi bekliyor'&&result.turkishPending[1]==='🔒 Kilitli', 'Türkçe Okul Testi tamamlanmadan sonraki konu açıldı');
  assert(result.turkishAfter[0]==='✅ Konu tamamlandı'&&result.turkishAfter[1]==='📖 Öğrenmeye hazır'&&result.turkishAfter[2]==='🔒 Kilitli', 'Türkçe Konu ve Okul Testi sonrası sıralı açılma kuralı yanlış');
  assert(result.startedPreserved&&result.points===91&&JSON.stringify(result.badges)==='["first"]', 'Öğrenci kayıtları değişti');
  assert(result.width<=result.innerWidth+1, '390 piksel görünümde yatay taşma var');
  assert(!errors.length, 'Tarayıcı hataları: '+errors.join(' | '));
  console.log(JSON.stringify({url,result,errors},null,2));
  await browser.close();
})().catch(error => { console.error(error.stack||error); process.exitCode=1; });
