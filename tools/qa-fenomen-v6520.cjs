const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context = await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(() => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.clear();
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify({unlockAllV651:true,points:25,done:{},history:{},scores:{},mistakes:{},migrations:{mathOfficialV67:true}}));
  });
  const page = await context.newPage(), errors=[];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.join(root,'dist','index.html')).href,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(() => !!(window.__DURU_FENOMEN_V6520__ && window.__DURU_V651_TEST__), undefined, {timeout:60000});
  const result = await page.evaluate(() => {
    const expected = {7:'BADBCDBCDAB',8:'CDCDCACD',10:'DAACDCCDBDDC',11:'BCCDBDBDCABBD',12:'DCDDABCCDBDDDC',13:'DDCDDCDA',14:'DCDADDDBDCDD'};
    const api=window.__DURU_FENOMEN_V6520__,schoolApi=window.__DURU_V651_TEST__;
    const actual={};
    for(const row of api.definitions) actual[row.test]=api.questions.filter(q=>q.id.startsWith(`FENOMEN-${row.test}-`)).map(q=>q.answer).join('');
    const topicCounts=Object.fromEntries([1,2,3].map(topicIndex=>{
      const rows=schoolApi.schoolQuestions('Matematik',topicIndex),parts=schoolApi.schoolPartsFromRowsV6520(rows);
      return [topicIndex,{all:rows.length,fenomen:rows.filter(q=>q.id?.startsWith('FENOMEN-')).length,parts:parts.map(part=>part.length)}];
    }));
    const oldFenomen=schoolApi.schoolQuestions('Matematik',2).filter(q=>/^PRIVATE-/.test(q.id||''));
    const corrected=api.questions.find(q=>q.id==='FENOMEN-11-6');
    return {expected,actual,topicCounts,oldFenomen:oldFenomen.map(q=>q.id),corrected,
      questions:api.questions.map(q=>({id:q.id,options:q.options,answer:q.answer,visualUrl:q.visualUrl,source:q.privateSource})),
      width:document.documentElement.scrollWidth,innerWidth};
  });
  assert(JSON.stringify(result.actual)===JSON.stringify(result.expected),`Fenomen cevap dizileri farklı: ${JSON.stringify(result.actual)}`);
  assert(JSON.stringify(result.topicCounts)===JSON.stringify({
    1:{all:29,fenomen:19,parts:[10,19]},
    2:{all:35,fenomen:25,parts:[10,10,15]},
    3:{all:44,fenomen:34,parts:[10,10,10,14]}
  }),`Fenomen konu/test dağılımı yanlış: ${JSON.stringify(result.topicCounts)}`);
  assert(!result.oldFenomen.length,`Eski ve hatalı Fenomen soruları havuzda kaldı: ${result.oldFenomen.join(', ')}`);
  assert(result.corrected?.answer==='D', 'Test 11 soru 6 doğru cevabı D olarak düzeltilmedi');
  assert(result.questions.length===78,`Fenomen soru sayısı 78 değil: ${result.questions.length}`);
  assert(result.questions.every(q=>q.options.join('')==='ABCD'&&q.options.includes(q.answer)),'Fenomen seçenek/cevap yapısı geçersiz');
  const missing=result.questions.filter(q=>!fs.existsSync(path.join(root,'dist',q.visualUrl)));
  assert(!missing.length,`Eksik Fenomen sayfa görselleri: ${missing.map(q=>q.visualUrl).join(', ')}`);
  assert(result.questions.every(q=>q.source?.sourceId&&q.source.page),'Fenomen kaynak sayfası bağlantısı eksik');
  assert(result.width<=result.innerWidth+1,'390 pikselde yatay taşma var');
  assert(!errors.length,`Tarayıcı hataları: ${errors.join(' | ')}`);
  console.log(JSON.stringify({questions:result.questions.length,tests:Object.keys(result.actual).length,topicCounts:result.topicCounts,corrected:{id:result.corrected.id,answer:result.corrected.answer},missingAssets:missing.length,errors},null,2));
  await browser.close();
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
