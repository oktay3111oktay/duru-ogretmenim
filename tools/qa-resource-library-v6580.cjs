const path = require('node:path');
const {pathToFileURL} = require('node:url');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const assert = (value, message) => { if (!value) throw new Error(message); };

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page = await browser.newPage({viewport:{width:390,height:844}}), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__DURU_SYNC_TEST_MODE__ = true;
    localStorage.clear();
    localStorage.setItem('duru_teacher_reset_v6_5', JSON.stringify({points:321,badges:['first'],collection:{'Korunan kart':true},materials:{},migrations:{mathOfficialV67:true}}));
  });
  const url = process.env.QA_URL || pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:120000});
  if (url.startsWith('http')) assert(response?.ok(), 'Uygulama açılamadı');
  await page.waitForFunction(() => window.__DURU_RESOURCE_LIBRARY_V6580__ && document.querySelector('.v651-meb-tool'), undefined, {timeout:60000});

  const home = await page.evaluate(() => ({
    title:document.title,
    libraryButton:document.querySelector('.v651-meb-tool')?.textContent.trim(),
    gds:document.querySelector('.teacher-gtt-card .muted')?.textContent.trim(),
    points:state.points,
    badge:state.badges.includes('first'),
    card:!!state.collection['Korunan kart']
  }));
  assert(/V6\.62\.0/.test(home.title), 'Sürüm başlığı yanlış: '+home.title);
  assert(home.libraryButton === '📚 Kaynak Kütüphanesi', 'Ana sayfa kaynak düğmesi yanlış: '+home.libraryButton);
  assert(home.gds === 'Genel Değerlendirme Sınavı', 'Ana sayfa GDS adı yanlış: '+home.gds);
  assert(home.points === 321 && home.badge && home.card, 'Öğrenci verisi korunmadı');

  await page.click('.v651-meb-tool');
  const library = await page.evaluate(() => {
    const api = window.__DURU_RESOURCE_LIBRARY_V6580__, courses = [...document.querySelectorAll('.resource-course-v6580')];
    const rows = api.collect();
    const duplicateFile = api.prepareImport({name:'baska-ad.pdf',fileHash:'ec263c55b27f403cfedb94a3dfc6e5a95a8e78a3cfc2ebc1315bd671fa900db0',contentHash:'',topicSignature:[]},'Türkçe',0,'tamamen-farkli.pdf');
    const duplicateCrossCourse = api.prepareImport({name:'yanlis-derste-ayni-dosya.pdf',fileHash:'ec263c55b27f403cfedb94a3dfc6e5a95a8e78a3cfc2ebc1315bd671fa900db0',contentHash:'',topicSignature:[]},'Sosyal Bilgiler',0,'yanlis-derste-ayni-dosya.pdf');
    const duplicateContent = api.prepareImport({name:'yeniden-disari-aktarildi.pdf',fileHash:'x',contentHash:'163ff1bb3010bb4b8589883fba29ef3bf0e164ddf184bb86fcebc8d55e1f8d3f',topicSignature:[]},'Matematik',0,'yeniden.pdf');
    const fresh = api.prepareImport({name:'Yeni Türkçe EÇK.pdf',fileHash:'fresh-file',contentHash:'fresh-content',topicSignature:['özgün','başlık','alıştırma']},'Türkçe',0,'Yeni Türkçe EÇK.pdf');
    return {
      heading:document.querySelector('.resource-head-v6580 h1')?.textContent.trim(),
      courseOrder:courses.map(x => x.dataset.course),
      groups:courses.map(x => ({course:x.dataset.course,heads:[...x.querySelectorAll('.resource-group-v6580 h3')].map(h => h.childNodes[0].textContent.trim())})),
      hasUpload:[...document.querySelectorAll('button')].some(b => /yükle|dosya seç/i.test(b.textContent)),
      downloadButtons:document.querySelectorAll('.resource-download-v6590').length,
      rowCount:rows.length,
      missingDownloads:rows.filter(row => !row.stored && !row.download && !api.DOWNLOADS[row.originalName]).map(row => row.name),
      turkish:rows.filter(x => x.course === 'Türkçe').map(x => x.name),
      math:rows.filter(x => x.course === 'Matematik').map(x => x.name),
      din:rows.filter(x => x.course === 'Din Kültürü').map(x => x.name),
      duplicateFile, duplicateCrossCourse, duplicateContent, fresh,
      width:document.documentElement.scrollWidth, innerWidth
    };
  });
  assert(library.heading === '📚 Kaynak Kütüphanesi', 'Kütüphane başlığı yanlış');
  assert(JSON.stringify(library.courseOrder) === JSON.stringify(['Matematik','Türkçe','Fen Bilimleri','Sosyal Bilgiler','Din Kültürü','Peygamberimizin Hayatı','Almanca','İngilizce']), 'Ders sırası yanlış: '+JSON.stringify(library.courseOrder));
  assert(library.groups.every(x => JSON.stringify(x.heads) === JSON.stringify(['MEB Kaynakları','Okul Kaynakları'])), 'Kaynak grupları eksik');
  assert(!library.hasUpload, 'Kaynak Kütüphanesi gereksiz yükleme düğmesi içeriyor');
  assert(library.downloadButtons === library.rowCount, 'Her kaynak için indirme düğmesi yok');
  assert(library.missingDownloads.length === 0, 'İndirme bağlantısı olmayan kaynaklar: '+library.missingDownloads.join(', '));
  assert(library.turkish.includes('Türkçe EKÇ-1') && library.turkish.includes('Türkçe EKÇ-2'), 'Türkçe EKÇ adları eksik');
  assert(library.math.includes('Matematik EKÇ-1') && library.math.filter(x => /Fenomen/.test(x)).length === 3, 'Matematik okul kaynakları eksik');
  assert(library.din.includes('Din Kültürü EBA-1') && library.din.includes('Din Kültürü MEBİ-1'), 'Din okul kaynakları eksik');
  assert(library.duplicateFile.ok === false && /zaten eklenmiş/.test(library.duplicateFile.message), 'Dosya özetiyle tekrar denetimi başarısız');
  assert(library.duplicateCrossCourse.ok === false, 'Aynı dosya farklı derste tekrar eklenebildi');
  assert(library.duplicateContent.ok === false, 'İçerik özetiyle tekrar denetimi başarısız');
  assert(library.fresh.ok && library.fresh.name === 'Türkçe EKÇ-3', 'Sıralı otomatik adlandırma başarısız: '+JSON.stringify(library.fresh));
  assert(library.width <= library.innerWidth, `Mobil taşma var: ${library.width}/${library.innerWidth}`);

  const openByName = async (name, selector) => {
    await page.evaluate(sourceName => {
      const index = window.__DURU_RESOURCE_LIBRARY_V6580__.collect().findIndex(row => row.name === sourceName);
      if (index < 0) throw new Error('Kaynak bulunamadı: '+sourceName);
      openResourceV6580(index);
    }, name);
    await page.waitForSelector(selector, {state:'attached',timeout:10000});
    return page.$eval(selector, node => node.getAttribute('src') || node.textContent.trim());
  };
  const previews = {};
  previews.math = await openByName('Matematik MEB-1', '#meb-source-overlay-v618 img');
  const fullPdf = await page.$eval('#meb-source-overlay-v618 a', a => a.href);
  assert(/^https:\/\/tymm\.meb\.gov\.tr\/assets\/pdf\//.test(fullPdf), 'Tam PDF bağlantısı resmî MEB adresine bağlı değil: '+fullPdf);
  await page.evaluate(() => closeMebSourceV618());
  previews.turkishSchool = await openByName('Türkçe Okul Materyali - Nokta ve Virgül', '#resource-preview-v6580 img');
  await page.evaluate(() => document.getElementById('resource-preview-v6580')?.remove());
  previews.mathSchool = await openByName('Matematik EKÇ-1', '#duru-private-modal-v649 img');
  await page.evaluate(() => closePrivateSourceV649());
  assert(Object.values(previews).every(Boolean), 'Kaynak önizlemelerinden biri açılamadı: '+JSON.stringify(previews));
  if (process.env.QA_SCREENSHOT) await page.screenshot({path:process.env.QA_SCREENSHOT,fullPage:true});
  assert(errors.length === 0, 'Sayfa hataları: '+JSON.stringify(errors));
  console.log(JSON.stringify({home,library,previews,errors},null,2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
