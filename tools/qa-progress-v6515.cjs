const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (ok, message) => { if (!ok) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;

  async function scenario(name, requiredExtraV651) {
    const context = await browser.newContext({viewport:{width:390,height:844}});
    const seed = {
      points:137,
      done:{'Türkçe|0':true,'Türkçe|1':true,'Türkçe|2':true},
      startedTopicsV651:{'Türkçe|0':'2026-10-01','Türkçe|1':'2026-10-02','Türkçe|2':'2026-10-03'},
      requiredExtraV651,
      badges:['first'], badgeDesigns:{first:{color:'#112233',strokes:[]}}
    };
    await context.addInitScript(value => {
      window.__DURU_SYNC_TEST_MODE__ = true;
      localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
    }, seed);
    const page = await context.newPage(), errors=[];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
    if (url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılmadı');
    await page.waitForFunction(() => !!window.__DURU_PROGRESS_V6513_TEST__, undefined, {timeout:60000});
    const result = await page.evaluate(() => {
      openCourse('Türkçe');
      const header = document.querySelector('.fen-header small')?.textContent || '';
      const statuses = [...document.querySelectorAll('.fen-item .v651-topic-status')].slice(0,3).map(node => node.textContent);
      const enabled = [...document.querySelectorAll('.fen-item')].slice(0,3).map(card => [...card.querySelectorAll('button')].filter(button => /Konuyu öğren|Konu testi|Ekstra Test/i.test(button.textContent)).every(button => !button.disabled));
      parentView();
      document.querySelector('[aria-controls="veli-ilerleme-v6513"]')?.click();
      const row = window.__DURU_PROGRESS_V6513_TEST__.progress().find(item => item.name === 'Türkçe');
      const panel = document.getElementById('veli-ilerleme-v6513');
      const stateAfter = {points:state.points,done:state.done,startedTopicsV651:state.startedTopicsV651,requiredExtraV651:state.requiredExtraV651,badges:state.badges,badgeDesigns:state.badgeDesigns};
      return {header,statuses,enabled,row,panelText:panel?.textContent||'',panelHidden:panel?.hidden,width:document.documentElement.scrollWidth,innerWidth,stateAfter};
    });
    await context.close();
    return {name,seed,result,errors};
  }

  const normal = await scenario('Ekstra beklemiyor', {});
  const pending = await scenario('Üç zorunlu Ekstra bekliyor', {
    'Türkçe|0':{required:true},'Türkçe|1':{required:true},'Türkçe|2':{required:true}
  });

  assert(normal.result.row.completed===3 && normal.result.row.testCompleted===3 && normal.result.row.percent===13 && normal.result.row.testPercent===13, 'Normal Türkçe ilerlemesi %13 değil');
  assert(normal.result.header.includes('3/24 konu tamamlandı') && normal.result.statuses.every(text=>text==='✅ Konu tamamlandı'), 'Tamamlanan konu durumu yanlış');
  assert(pending.result.row.completed===0 && pending.result.row.testCompleted===3 && pending.result.row.requiredExtra===3 && pending.result.row.percent===0 && pending.result.row.testPercent===13, 'Zorunlu Ekstra ayrımı yanlış');
  assert(pending.result.header.includes('0/24 konu tamamlandı') && pending.result.header.includes('3/24 konu testi bitti') && pending.result.header.includes('3 zorunlu Ekstra bekliyor'), 'Türkçe üst özeti yanlış');
  assert(pending.result.statuses.every(text=>text==='🔴 Konu testi bitti · Zorunlu Ekstra Test bekliyor'), 'Bekleyen konular tamamlandı görünüyor');
  assert(pending.result.enabled.every(Boolean), 'Zorunlu Ekstra bekleyen kart çözüme kapatıldı');
  assert(!pending.result.panelHidden && pending.result.panelText.includes('Konu testleri13%') && pending.result.panelText.includes('0/24 konu tamamen tamamlandı') && pending.result.panelText.includes('3/24 konu testi bitti'), 'Veli Paneli iki ilerleme türünü göstermiyor');
  for (const item of [normal,pending]) {
    for (const key of ['points','done','startedTopicsV651','requiredExtraV651','badges','badgeDesigns']) assert(JSON.stringify(item.seed[key])===JSON.stringify(item.result.stateAfter[key]), `Öğrenci kaydı değişti: ${item.name} / ${key}`);
    assert(item.result.width<=item.result.innerWidth+1, `390 pikselde yatay taşma: ${item.name}`);
    assert(!item.errors.length, `Tarayıcı hatası: ${item.errors.join(' | ')}`);
  }
  console.log(JSON.stringify({url,normal:normal.result,pending:pending.result,errors:[...normal.errors,...pending.errors]},null,2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
