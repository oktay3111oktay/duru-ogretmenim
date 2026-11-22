const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const rewardDir = path.resolve(__dirname, '../dist/assets/rewards-v6610');
  const homeReward = path.resolve(__dirname, '../dist/assets/reward-home-v6610.webp');
  const korebe = path.resolve(__dirname, '../dist/assets/korebe-reward-v6530.png');
  const rewardFiles = fs.readdirSync(rewardDir).filter(file => file.endsWith('.webp'));
  assert(rewardFiles.length === 11 && rewardFiles.every(file => fs.statSync(path.join(rewardDir,file)).size > 50000), 'Ayrı ödül görselleri eksik');
  assert(fs.existsSync(homeReward) && fs.statSync(homeReward).size > 300000, 'Ana sayfa ödül görseli eksik');
  assert(fs.existsSync(korebe) && fs.statSync(korebe).size > 100000, 'Mevcut Körebe görseli korunmadı');

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const seed = {
    points: 417,
    done: { 'Matematik|0': '2026-11-10T00:00:00.000Z' },
    history: {}, scores: {}, mistakes: {},
    badges: ['first'], collection: { 'Korunan kart': true },
    migrations: { mathOfficialV67: true }, wrongQuestionLogV651: [], wrongGttMasteryV6519: {},
    blindMansBuffRewardsV6530: {
      rights: 2, used: 0, updatedAt: '2026-11-22T09:00:00.000Z', completions: {}, testLimits: {},
      daily: { day: '2026-11-22', credit: 40, earned: 0, answered: 40, bonusAnswered: 0, completedTests: 0 }
    }
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage();
  const errors = [], dialogs = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.accept(); });
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  if (url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılamadı');
  await page.waitForFunction(() => window.__DURU_REWARD_STORE_V6600_TEST__ && window.__DURU_REWARDS_V6530_TEST__, undefined, { timeout: 60000 });
  await page.evaluate(() => openRewardStoreV6600('shop'));
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), undefined, { timeout: 30000 });

  const result = await page.evaluate(() => {
    const api = window.__DURU_REWARD_STORE_V6600_TEST__;
    const original = { points: state.points, done: state.done['Matematik|0'], badge: state.badges.includes('first'), card: !!state.collection['Korunan kart'] };
    const migratedLive = api.ensureStore(false);
    const migrated = { balance: migratedLive.store.balance, korebe: migratedLive.store.inventory.korebe, rights: migratedLive.reward.rights };
    home();
    const headings = [...document.querySelectorAll('#app h2')].map(node => node.textContent.trim());
    const courseGrid = document.querySelector('#app .teacher-card-grid');
    const rewardCard = document.getElementById('korebe-reward-v6530');
    const world = headings.findIndex(text => /Duru'nun Dünyası|Hayal Adası/.test(text));
    const badges = headings.findIndex(text => /Rozetlerim/.test(text));
    const rewards = headings.findIndex(text => /Ödüllerim/.test(text));
    const tools = headings.findIndex(text => /Araçlar/.test(text));
    const order = {
      headings, rewards, world, badges, tools,
      immediatelyAfterCourses: courseGrid?.nextElementSibling === rewardCard,
      homeText: rewardCard?.textContent || '', image: rewardCard?.querySelector('img')?.getAttribute('src') || ''
    };
    const shopButton = rewardCard?.querySelector('button')?.textContent?.trim() || '';

    openRewardStoreV6600('shop');
    const catalog = api.CATALOG.map(item => ({ id: item.id, name: item.name, cost: item.cost, group: item.group }));
    const cards = [...document.querySelectorAll('.reward-shop-card-v6600')].map(card => card.textContent.trim());
    const groups = [...document.querySelectorAll('.reward-group-v6600>h2')].map(node => node.textContent.trim());
    const shopWidth = document.documentElement.scrollWidth;
    const rewardImages = [...document.querySelectorAll('.reward-shop-card-v6600 img.reward-art-img-v6600')].map(image => ({
      src:image.getAttribute('src')||'', naturalWidth:image.naturalWidth, naturalHeight:image.naturalHeight,
      renderedWidth:image.getBoundingClientRect().width, renderedHeight:image.getBoundingClientRect().height,
      fit:getComputedStyle(image).objectFit
    }));

    const store = api.ensureStore(false).store;
    store.balance = 2000;
    state.blindMansBuffRewardsV6530.updatedAt = new Date().toISOString();
    persist();
    purchaseRewardV6600('evde-sushi');
    purchaseRewardV6600('restoranda-sushi');
    const afterBuyLive = api.ensureStore(false).store;
    const queueAfterBuy = afterBuyLive.sushiQueue.map(row => ({ id: row.id, rewardId: row.rewardId, status: row.status, availableAt: row.availableAt }));
    const afterBuy = { balance: afterBuyLive.balance, home: afterBuyLive.inventory['evde-sushi'], restaurant: afterBuyLive.inventory['restoranda-sushi'], queue: queueAfterBuy };
    const homeRow = afterBuyLive.sushiQueue.find(row => row.rewardId === 'evde-sushi');
    useRewardV6600('evde-sushi', homeRow.id);
    const afterUse = api.ensureStore(false).store;
    const queueAfterUse = afterUse.sushiQueue.map(row => ({ rewardId: row.rewardId, status: row.status, availableAt: row.availableAt }));
    const restaurantRow = afterUse.sushiQueue.find(row => row.rewardId === 'restoranda-sushi');
    const waitDays = restaurantRow?.availableAt ? Math.round((Date.parse(restaurantRow.availableAt) - Date.now()) / 86400000) : 0;

    state.dailyStudyV6519 = { day: new Date().toLocaleDateString('en-CA'), active: true };
    const normal = { kind:'normal', keys:['Matematik|0'], qs:[], pending:[], _rewardPointBlockedV6540:false };
    const q1 = { id:'normal-correct', c:'Matematik', t:0, sourceCourseId:'Matematik', sourceTopicId:0, prompt:'Normal', answer:'A', options:['A','B','C','D'] };
    const q2 = { id:'normal-wrong', c:'Matematik', t:0, sourceCourseId:'Matematik', sourceTopicId:0, prompt:'Yanlış', answer:'A', options:['A','B','C','D'] };
    const wrongOnly = { kind:'repeat', keys:['Türkçe|0'], qs:[], pending:[], _wrongOnlyV651:true, _rewardPointBlockedV6540:false };
    const q3 = { id:'bonus-correct', c:'Türkçe', t:0, sourceCourseId:'Türkçe', sourceTopicId:0, prompt:'Bonus', answer:'A', options:['A','B','C','D'] };
    const normalCorrect = api.recordCorrect(normal,q1,'A','test',0);
    const normalWrong = api.recordCorrect(normal,q2,'B','test',1);
    const bonusCorrect = api.recordCorrect(wrongOnly,q3,'A','test',0);
    const pointMeta = { normal: normal._rewardStoreV6600, wrongOnly: wrongOnly._rewardStoreV6600, normalCorrect, normalWrong, bonusCorrect };

    const beforeActualBalance = api.ensureStore(false).store.balance;
    const actualQuestion = { id:'actual-wrapper', c:'Sosyal Bilgiler', t:0, sourceCourseId:'Sosyal Bilgiler', sourceTopicId:0, prompt:'Gerçek sarmalayıcı', answer:'A', options:['A','B','C','D'], explain:'A' };
    session = { kind:'extra', keys:['Sosyal Bilgiler|0'], qs:[actualQuestion], idx:0, answers:[], pending:[], initial:1, repair:0 };
    course = 'Sosyal Bilgiler'; topic = 0; chosenAnswer = 'A';
    nextQuestion();
    finishSession();
    const actualAward = {
      before: beforeActualBalance,
      after: api.ensureStore(false).store.balance,
      notice: document.querySelector('.korebe-earned-v6530')?.textContent || ''
    };

    parentView();
    const parentText = document.getElementById('korebe-parent-v6530')?.textContent || '';
    const parentHasAdd = [...document.querySelectorAll('#korebe-parent-v6530 button')].some(button => /artır|ekle/i.test(button.textContent || ''));
    const preserved = { points: state.points, done: state.done['Matematik|0'], badge: state.badges.includes('first'), card: !!state.collection['Korunan kart'] };
    return {
      title: document.title, original, preserved, order, catalog, cards, groups, shopWidth, innerWidth: window.innerWidth, rewardImages, shopButton,
      migrated,
      afterBuy,
      afterUse: { home: afterUse.inventory['evde-sushi'], restaurant: afterUse.inventory['restoranda-sushi'], queue: queueAfterUse, waitDays },
      pointMeta, actualAward, parentText, parentHasAdd
    };
  });

  await page.evaluate(() => openRewardStoreV6600('shop'));
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), undefined, { timeout: 30000 });
  const screenshot = path.resolve(__dirname, '../qa-reward-store-v6600-mobile.png');
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.setViewportSize({ width:1280, height:900 });
  await page.evaluate(() => openRewardStoreV6600('shop'));
  const desktopWidths=await page.evaluate(() => [...document.querySelectorAll('.reward-shop-card-v6600')].map(card=>Math.round(card.getBoundingClientRect().width)));
  const desktopGroups=await page.evaluate(() => [...document.querySelectorAll('.reward-group-v6600')].map(group=>({
    name:group.querySelector('h2')?.textContent?.trim()||'',
    costs:[...group.querySelectorAll('.reward-shop-card-v6600')].map(card=>Number((card.querySelector('.reward-price-v6600')?.textContent||'').replace(/\D/g,''))),
    tops:[...group.querySelectorAll('.reward-shop-card-v6600')].map(card=>Math.round(card.getBoundingClientRect().top))
  })));
  const desktopScreenshot = path.resolve(__dirname, '../qa-reward-store-v6620-desktop.png');
  await page.screenshot({ path: desktopScreenshot, fullPage: true });

  const expected = [
    ['korebe',100],['balon',150],['basketbol',350],['masa-tenisi',350],['sicak-soguk',150],['hazine-avi',300],
    ['kutu-oyunlari',300],['monopoly',450],['patlamis-misir',200],['film-gecesi',400],['evde-sushi',750],['restoranda-sushi',1000]
  ];
  console.log(JSON.stringify({ url, result, dialogs, errors, screenshot, desktopScreenshot, desktopWidths, desktopGroups }, null, 2));
  assert(result.title.includes('V6.62.0'), 'Sürüm başlığı V6.62.0 değil');
  assert(JSON.stringify(result.catalog.map(item => [item.id,item.cost])) === JSON.stringify(expected), 'Ödül sırası veya puanları yanlış');
  assert(result.order.immediatelyAfterCourses && result.order.rewards >= 0, 'Ödüllerim derslerin hemen arkasında değil');
  assert(result.order.world >= 0 && result.order.badges === result.order.world + 1 && result.order.tools > result.order.badges, 'Rozetlerim Hayal Adası/Duru’nun Dünyası sonrasına taşınmadı');
  assert(result.order.image.includes('reward-home-v6610.webp'), 'Seçilen ana sayfa ödül görseli kullanılmıyor');
  assert(result.shopButton.includes('Ödül Mağazası') && !result.shopButton.includes('Aç'), 'Ana sayfa düğme adı doğru değil');
  assert(result.migrated.korebe === 2 && result.migrated.rights === 2 && result.migrated.balance === 40, 'Eski haklar veya günlük birikim kayıpsız taşınmadı');
  assert(result.cards.length === 12 && result.rewardImages.length === 12 && result.groups.length === 4, 'Mağaza kartları veya görselleri eksik');
  assert(result.rewardImages.every(image => image.naturalWidth > 0 && image.naturalHeight > 0 && image.fit === 'contain'), 'Ödül görsellerinden biri yüklenmedi veya esnetiliyor');
  assert(result.rewardImages.filter(image => image.src.includes('rewards-v6610')).every(image => Math.abs(image.naturalWidth/image.naturalHeight-1) < .08), 'Yeni ödül görsellerinden biri kare kırpılmamış');
  assert(result.afterBuy.balance === 250 && result.afterBuy.home === 1 && result.afterBuy.restaurant === 1, 'Sushi satın alma puanı veya çanta kaydı yanlış');
  assert(result.afterBuy.queue[0].status === 'ready' && result.afterBuy.queue[1].status === 'queued', 'İki Sushi ödülünün ilk sırası yanlış');
  assert(result.afterUse.home === 0 && result.afterUse.restaurant === 1, 'Kullanılan Sushi çantadan doğru düşmedi');
  assert(result.afterUse.queue[0].status === 'used' && result.afterUse.queue[1].status === 'waiting' && result.afterUse.waitDays === 30, 'Sonraki Sushi ödülünün 30 günlük süresi başlamadı');
  assert(result.pointMeta.normalCorrect && !result.pointMeta.normalWrong && result.pointMeta.normal.rawPoints === 1, 'Normal doğru/yanlış ödül puanı kuralı yanlış');
  assert(result.pointMeta.bonusCorrect && result.pointMeta.wrongOnly.rawPoints === 2, 'Yanlış sorulardan GTT/GDS iki kat puan vermiyor');
  assert(result.actualAward.after === result.actualAward.before + 1 && /Ödül puanı kazandın/.test(result.actualAward.notice), 'Gerçek test akışında ödül puanı yazılmadı');
  assert(result.parentText.includes('Ödül yönetimi') && !result.parentHasAdd, 'Veli ödül yönetiminde artırma aracı olmamalı');
  assert(result.original.done === result.preserved.done && result.original.badge === result.preserved.badge && result.original.card === result.preserved.card, 'Öğrenci ilerleme/rozet/kart verisi değişti');
  assert(result.shopWidth <= result.innerWidth + 1, '390 piksel mobil görünümde yatay taşma var');
  assert(desktopWidths.every(width=>width<=250), 'Masaüstünde ödül kartlarından biri yeniden esniyor');
  assert(desktopGroups.every(group=>group.costs.every((cost,index)=>!index||cost>=group.costs[index-1])), 'Ödüller gruplarında düşük puandan yüksek puana sıralı değil');
  const movement=desktopGroups.find(group=>group.name.includes('Hareketli Oyunlar'));
  assert(movement?.tops.length===4 && new Set(movement.tops).size===1, 'Hareketli Oyunların dört ödülü masaüstünde yan yana değil');
  assert(!errors.length, `Tarayıcı hataları: ${JSON.stringify(errors)}`);
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
