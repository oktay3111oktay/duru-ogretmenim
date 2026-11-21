const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

const question = (id, course = 'Matematik', topic = 0) => ({
  id, c: course, t: topic, sourceCourseId: course, sourceTopicId: topic,
  prompt: `${id} sorusu`, answer: 'Doğru', options: ['Doğru', 'Yanlış 1', 'Yanlış 2', 'Yanlış 3'], explain: 'Doğru cevap.'
});

(async () => {
  const asset = path.resolve(__dirname, '../dist/assets/korebe-reward-v6530.png');
  assert(fs.existsSync(asset) && fs.statSync(asset).size > 100000, 'Körebe görseli eksik veya boş');
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const seed = {
    points: 417, done: { 'Matematik|0': '2026-11-10T00:00:00.000Z' }, history: {}, scores: {}, mistakes: {},
    badges: ['first'], collection: { 'Korunan kart': true }, migrations: { mathOfficialV67: true },
    wrongQuestionLogV651: [], wrongGttMasteryV6519: {}, optionalRetrySessionsV6516: {}
  };
  await context.addInitScript(value => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify(value));
  }, seed);
  const page = await context.newPage(), errors = [], alerts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', async dialog => { alerts.push(dialog.message()); await dialog.accept(); });
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  if (url.startsWith('http')) assert(response?.ok(), 'Canlı uygulama açılamadı');
  await page.waitForFunction(() => window.__DURU_REWARDS_V6530_TEST__ && window.__DURU_DAILY_V6519_TEST__, undefined, { timeout: 60000 });

  const result = await page.evaluate(() => {
    const api = window.__DURU_REWARDS_V6530_TEST__;
    const makeSession = (kind, keys, id, wrongOnly = false) => ({
      kind, keys, qs: [{ id, c: keys[0].split('|')[0], t: Number(keys[0].split('|').pop()), prompt: id, answer: 'Doğru', options: ['Doğru', 'B', 'C', 'D'] }],
      answers: [], pending: [], initial: 1, repair: 0, _wrongOnlyV651: wrongOnly, _wrongScopeV651: wrongOnly ? keys[0].split('|')[0] : ''
    });
    const complete = (kind, keys, id, count, wrongOnly = false) => {
      const s = makeSession(kind, keys, id, wrongOnly);
      for (let index = 0; index < count; index += 1) api.recordAnswer(s, 'test');
      return api.finalizeSession(s);
    };

    const before = { points: state.points, done: state.done['Matematik|0'], badge: state.badges.includes('first'), card: !!state.collection['Korunan kart'] };
    const inactiveSession = makeSession('normal', ['Fen Bilimleri|0'], 'inactive-test');
    for (let index = 0; index < 100; index += 1) api.recordAnswer(inactiveSession, 'test');
    const inactive = api.finalizeSession(inactiveSession);
    const inactiveAgain = api.finalizeSession(inactiveSession);
    const inactiveRights = api.ensureReward(false).rights;
    toggleDailyStudyV6519();

    const first = complete('normal', ['Matematik|0'], 'normal-fixed', 100);
    const second = complete('normal', ['Matematik|0'], 'normal-fixed', 150);
    const third = complete('normal', ['Matematik|0'], 'normal-fixed', 200);
    const fourth = complete('normal', ['Matematik|0'], 'normal-fixed', 250);
    const fifthThreshold = api.thresholdForAttempt(5);
    const bonus = complete('repeat', ['Din Kültürü|0'], 'wrong-fixed', 50, true);

    complete('normal', ['Türkçe|0'], 'turkish-fixed', 0);
    const mixedSecond = complete('normal', ['Türkçe|0'], 'turkish-fixed', 75);
    const mixedFirst = complete('normal', ['Fen Bilimleri|1'], 'science-fixed', 50);
    const afterRules = JSON.parse(JSON.stringify(api.ensureReward(false)));

    const actual = makeSession('extra', ['Sosyal Bilgiler|0'], 'actual-wrapper');
    session = actual; course = 'Sosyal Bilgiler'; topic = 0; chosenAnswer = 'Doğru';
    nextQuestion();
    finishSession();
    const completionNotice = document.querySelector('.korebe-earned-v6530')?.textContent || '';

    const recent = new Date().toISOString();
    state.history['Almanca|0'] = [{ date: recent, score: 100 }, { date: recent, score: 100 }];
    course = 'Almanca'; topic = 0; startQuiz('Almanca', 0, 'normal');
    const blockedStatus = api.ensureTestLimit(session, true), blockedPointsBefore = state.points;
    session.answers = session.qs.map(question => question.answer);
    initialResult();
    const blockedPointsAfter = state.points;
    const limitNotice = document.getElementById('test-limit-toast-v6540')?.textContent || '';
    const otherSession = makeSession('normal', ['Almanca|1'], 'other-test');
    const otherStatus = api.ensureTestLimit(otherSession, true);

    home();
    const headings = [...document.querySelectorAll('#app h2')].map(node => node.textContent.trim());
    const badgeIndex = headings.findIndex(text => /Rozetlerim/.test(text));
    const rewardIndex = headings.findIndex(text => /Ödüllerim/.test(text));
    const homeCard = document.getElementById('korebe-reward-v6530');
    const image = homeCard?.querySelector('img');
    const homeSnapshot = { headings, badgeIndex, rewardIndex, text: homeCard?.textContent || '', imageSrc: image?.getAttribute('src') || '' };

    const rightsBeforeDayReset = api.ensureReward(false).rights;
    state.blindMansBuffRewardsV6530.daily = { day: '2000-01-01', credit: 80, earned: 0, answered: 80, bonusAnswered: 0, completedTests: 1 };
    const reset = api.ensureReward(false);
    const dayReset = { rights: reset.rights, progress: api.progressValue(reset), day: reset.daily.day };

    parentView();
    const parentBefore = document.getElementById('korebe-parent-v6530')?.textContent || '';
    const hasIncrease = [...document.querySelectorAll('#korebe-parent-v6530 button')].some(button => /artır|ekle/i.test(button.textContent || ''));
    const spent = api.useRights(3);
    api.decorateParent();
    const afterSpend = api.ensureReward(false).rights;
    const parentAfter = document.getElementById('korebe-parent-v6530')?.textContent || '';
    const syncApi = window.__DURU_SYNC_V646_TEST__;
    const syncMerged = syncApi.conservativeInitialMerge(
      { appState: { blindMansBuffRewardsV6530: { rights: 0, completions: { 'normal|Matematik|0': 1 }, daily: { day: '2026-11-16', credit: 0, updatedAt: '' } } }, aux: {} },
      { appState: { blindMansBuffRewardsV6530: { rights: 7, used: 2, updatedAt: '2026-11-16T12:00:00.000Z', completions: { 'normal|Matematik|0': 4 }, daily: { day: '2026-11-16', credit: 64, updatedAt: '2026-11-16T12:00:00.000Z' } } }, aux: {} }
    ).appState.blindMansBuffRewardsV6530;
    const preserved = { points: state.points, done: state.done['Matematik|0'], badge: state.badges.includes('first'), card: !!state.collection['Korunan kart'] };

    return {
      title: document.title, inactive, inactiveAgain, inactiveRights,
      attempts: { first, second, third, fourth, fifthThreshold }, bonus, mixedSecond, mixedFirst,
      afterRules: { rights: afterRules.rights, credit: afterRules.daily.credit, answered: afterRules.daily.answered, bonusAnswered: afterRules.daily.bonusAnswered },
      completionNotice, homeSnapshot, rightsBeforeDayReset, dayReset,
      repeatLimit: { blockedStatus, blockedPointsBefore, blockedPointsAfter, limitNotice, otherStatus },
      parent: { before: parentBefore, hasIncrease, spent, afterSpend, after: parentAfter }, syncMerged,
      before, preserved, width: document.documentElement.scrollWidth, innerWidth: window.innerWidth
    };
  });

  await page.evaluate(() => home());
  await page.waitForFunction(() => {
    const image = document.querySelector('#korebe-reward-v6530 img');
    return !!image && image.complete && image.naturalWidth > 500;
  }, undefined, { timeout: 30000 });
  const imageLoaded = true;

  console.log(JSON.stringify({ url, result, imageLoaded, alerts, errors }, null, 2));
  assert(result.title.includes('V6.57.0'), 'Sürüm başlığı güncellenmedi');
  assert(result.inactiveRights === 0 && result.inactive.answered === 0 && result.inactiveAgain === null, 'Başla etkin değilken Körebe hakkı yazıldı veya aynı tamamlama iki kez işlendi');
  assert(result.attempts.first.threshold === 100 && result.attempts.first.earned === 1, 'İlk tamamlama 100 soru kuralı yanlış');
  assert(result.attempts.second.threshold === 150 && result.attempts.second.earned === 1, 'İkinci tamamlama 150 soru kuralı yanlış');
  assert(result.attempts.third.blocked && result.attempts.fourth.blocked && result.attempts.fifthThreshold === 300, 'Aynı testin üçüncü ve sonraki tamamlamaları 30 günlük puan molasına girmedi');
  assert(result.bonus.threshold === 100 && result.bonus.bonusAnswered === 50 && result.bonus.earned === 1, 'Yanlış-soru GTT/GDS iki kat bonusu yanlış');
  assert(Math.abs(result.mixedSecond.credit - 50) < 0.01 && Math.abs(result.mixedFirst.credit - 50) < 0.01, 'Farklı tekrar eşikleri oransal birleşmiyor');
  assert(result.afterRules.rights === 4 && Math.abs(result.afterRules.credit - 400) < 0.01, `Toplam Körebe hesabı yanlış: ${JSON.stringify(result.afterRules)}`);
  assert(/Körebe sayacın ilerledi/.test(result.completionNotice), 'Gerçek test tamamlama bildirimi gösterilmedi');
  assert(result.repeatLimit.blockedStatus.blocked && result.repeatLimit.blockedPointsAfter === result.repeatLimit.blockedPointsBefore, 'Puan molasındaki test yıldız puanı kazandırdı');
  assert(/başka bir teste geç/i.test(result.repeatLimit.limitNotice) && !result.repeatLimit.otherStatus.blocked, 'Tek seferlik test sınırı uyarısı veya başka testin ödül hakkı yanlış');
  assert(result.homeSnapshot.badgeIndex >= 0 && result.homeSnapshot.rewardIndex === result.homeSnapshot.badgeIndex + 1, 'Ödüllerim alanı Rozetlerimden hemen sonra değil');
  assert(result.homeSnapshot.text.includes('Körebe hakkı') && result.homeSnapshot.imageSrc.includes('korebe-reward-v6530.png') && imageLoaded, 'Ödüllerim kartı veya Körebe görseli eksik');
  assert(!result.homeSnapshot.text.includes('İlk tamamlamada') && !result.homeSnapshot.text.includes('her yeni tamamlanmasında'), 'Ödüllerim kartındaki uzun kural açıklaması kaldırılmadı');
  assert(result.dayReset.rights === result.rightsBeforeDayReset && result.dayReset.progress === 0, 'Gün değişiminde hak koruma veya günlük katkı sıfırlama yanlış');
  assert(result.parent.before.includes('Körebe hakları') && !result.parent.hasIncrease && result.parent.spent && result.parent.afterSpend === 1 && result.parent.after.includes('1 kullanılabilir'), 'Veli Paneli yalnızca hak düşürme aracı yanlış');
  assert(result.syncMerged.rights === 7 && result.syncMerged.used === 2 && result.syncMerged.completions['normal|Matematik|0'] === 4 && result.syncMerged.daily.credit === 64, 'Körebe hakları cihaz eşitlemesinde korunmadı');
  assert(result.preserved.points >= result.before.points && result.preserved.done === result.before.done && result.preserved.badge === result.before.badge && result.preserved.card === result.before.card, 'Mevcut konu, rozet veya koleksiyon kaydı değişti');
  assert(result.width <= result.innerWidth + 1, '390 piksel görünümde yatay taşma var');
  assert(!alerts.length && !errors.length, `Tarayıcı hataları: ${JSON.stringify({ alerts, errors })}`);

  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });

