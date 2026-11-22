const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const seed = {
    points: 321, done: { 'Türkçe|0': '2026-11-20T09:00:00.000Z' }, history: {}, scores: {}, mistakes: {},
    badges: ['first','streak3','streak7','master'], collection: { 'Korunan kart': true },
    badgeDesigns: {
      first: { title:'PinkiePie', primary:'#ff6868', edge:'#ff6868', character:'funny', promptText:'' },
      streak3: { title:'Patatesim', primary:'#ffd45e', edge:'#ffd45e', character:'funny', promptText:'' },
      streak7: { title:'Needoh', primary:'#5ea9f7', edge:'#5ea9f7', character:'funny', promptText:'' },
      master: { title:'SakuraXD', primary:'#ff72b2', edge:'#ff72b2', character:'funny', promptText:'' }
    },
    migrations: { mathOfficialV67: true }, wrongQuestionLogV651: [], wrongGttMasteryV6519: {}
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', async dialog => dialog.accept());
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  if (url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılamadı');
  await page.waitForFunction(() => window.__DURU_BADGE_VARIETY_V6610_TEST__, undefined, { timeout: 60000 });

  const gallery = await page.evaluate(() => {
    badges();
    const rendered=[...document.querySelectorAll('.badge-variety-v6610')].map(svg=>({
      character:svg.dataset.character, frame:svg.dataset.frame, accessory:svg.dataset.accessory, pattern:svg.dataset.pattern
    }));
    return { rendered, width:document.documentElement.scrollWidth, innerWidth:window.innerWidth, text:app.textContent };
  });
  const galleryShot=path.resolve(__dirname,'../qa-badge-variety-v6610-gallery.png');
  await page.screenshot({path:galleryShot,fullPage:true});

  const editor = await page.evaluate(() => {
    badgeStudio('first');
    const controls=[...document.querySelectorAll('.badge-variety-controls-v6610 select,.badge-variety-controls-v6610 input')];
    badgeVarietySetV6610('variantCharacter','robot');
    badgeVarietySetV6610('frameStyle','shield');
    badgeVarietySetV6610('accessoryStyle','crown');
    badgeVarietySetV6610('expressionStyle','surprised');
    badgeVarietySetV6610('eyeStyle','three');
    badgeVarietySetV6610('patternStyle','stars');
    document.getElementById('badgeTitleInput').value='Robot Şampiyon';
    document.getElementById('badgeTitleInput').dispatchEvent(new Event('input',{bubbles:true}));
    document.getElementById('badgePromptInput').value='Parlak ve çok neşeli olsun';
    badgeSaveDesign();
    const saved=state.badgeDesigns.first;
    return {
      controlCount:controls.length, saved,
      points:state.points, done:state.done['Türkçe|0'], card:!!state.collection['Korunan kart'], badgeCount:state.badges.length,
      width:document.documentElement.scrollWidth, innerWidth:window.innerWidth
    };
  });
  const badgeStudioShot=path.resolve(__dirname,'../qa-badge-variety-v6610-editor.png');
  await page.evaluate(() => badgeStudio('first'));
  await page.screenshot({path:badgeStudioShot,fullPage:true});

  const pairs=new Set(gallery.rendered.map(item=>`${item.character}|${item.frame}|${item.accessory}|${item.pattern}`));
  console.log(JSON.stringify({url,gallery,editor,errors,galleryShot,badgeStudioShot},null,2));
  assert(gallery.rendered.length===4, 'Kaydedilmiş rozetlerin tamamı çizilmedi');
  assert(pairs.size>=3, 'Aynı rozet biçimi tekrar ediliyor; çeşitlilik yetersiz');
  assert(gallery.width<=gallery.innerWidth+1, 'Rozet galerisinde mobil yatay taşma var');
  assert(editor.controlCount===8, 'Karakter, biçim, aksesuar, ifade, göz, desen ve renk kontrolleri eksik');
  assert(editor.saved.variantCharacter==='robot' && editor.saved.frameStyle==='shield' && editor.saved.accessoryStyle==='crown', 'Rozet karakter/biçim/aksesuar seçimi kaydedilmedi');
  assert(editor.saved.eyeStyle==='three' && editor.saved.patternStyle==='stars' && editor.saved.title==='Robot Şampiyon', 'Rozet ayrıntıları kaydedilmedi');
  assert(editor.points===321 && editor.done && editor.card && editor.badgeCount===4, 'Puan, ilerleme, kart veya rozet kaydı değişti');
  assert(editor.width<=editor.innerWidth+1, 'Rozet atölyesinde mobil yatay taşma var');
  assert(!errors.length, `Tarayıcı hataları: ${JSON.stringify(errors)}`);
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode=1; });
