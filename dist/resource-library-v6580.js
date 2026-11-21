/* V6.58.0: Derslere göre MEB/okul kaynak kütüphanesi ve içerik tabanlı tekrar denetimi. */
(() => {
  'use strict';

  const VERSION = '6.58.0';
  const COURSE_ORDER = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'Din Kültürü', 'Peygamberimizin Hayatı', 'Almanca', 'İngilizce'];
  const COURSE_ICONS = {Matematik:'📐', Türkçe:'📚', 'Fen Bilimleri':'🧪', 'Sosyal Bilgiler':'🌍', 'Din Kültürü':'🕌', 'Peygamberimizin Hayatı':'🌙', Almanca:'🇩🇪', İngilizce:'🇬🇧'};
  const STOP = new Set('acaba ama ancak artık ayrıca bazı belki ben beni benim beri bile bir biz bize bizim bu buna burada çünkü çok daha da de değil diye dolayı en fakat fakat gibi göre hangi hem hep her hiç için ile ise kadar karşı kendi ki kim mi mı mu mü nasıl ne neden niçin o olan olarak oldu onun onlar önce sonra şu tüm ve veya ya yani yeni'.split(' '));

  const fp = (fileHash, contentHash, topics = []) => ({fileHash, contentHash, topicSignature: topics});
  const KNOWN_FINGERPRINTS = {
    'Büyük Harflerin Kullanımı.pdf': fp('d6852a8cf0e98b19a2a5b8df044262343e696c7ce649e9b682331a3f39852d50','c8edfda8c2498b3951036c8170bdb347d138d508c9be18c22909fd96eab52ee0',['büyük','adları','harfle','başlar','küçük','özel','yazılır','bayramı','belirli','tarih','dünya','günü','türk','uyarı','gezegen','kişi','millet','kurum']),
    'Deyim-Atasözü.pdf': fp('0c653d8fe6c5c18993acd7c87161519a2f6e584964f04596dee847bd5f204410','9852f2b04129f77cb00406466c1e21ad5f43cc2a2de58451f2a05b7cd9b3812a',['damlaya','etekleri','deyimler','öğüt','deyim','kalıplaşmış','anlam','atasözleri','atasözü','ayağını','biçersin','toplumun','yorganına']),
    'Fen EÇK.pdf': fp('c4e70260ae25078bf65ccf41bcfa2a5cd6840ea6792a820a2d230417a44a93d6','ee04e12c72ca74e3bc2af15bc1749b3d78f99b9ed0d7195b1ca265b5ee8191e8',['güneş','dünya','hareket','çekim','zaman','gökyüzündeki','uzay','büyük','dolunay','evreleri','dönüş','kavram']),
    'Fenomen Matematik Soru Bankası - 1.pdf': fp('254ff121ceaf5606ad00a4f772986053d0a8ed6be6a463273a1afd1dfa058bdc','',[]),
    'Fenomen Matematik Soru Bankası -2.pdf': fp('1ed63a534aef0a02601f7d12ca7335fd6af01d01e8614990acc3ff7f7e6e0173','',[]),
    'Fenomen Matematik Soru Bankası -3.pdf': fp('c48f0fd3f0f539f810c3f9ebe31f61a434303d2dcf2c41bbe64a4cf965d8ec1e','',[]),
    'İkilemeler-Pekiştirmeler.pdf': fp('0775228820cbe08899197fda90fad495ce8224e71c753c29a040654ba5192604','25eae9b1ac17eb0bba86b242656c319dea99fde98b9f64089c32571c4eb87b35',['ağır','pekiştirmeli','ikilemeler','yazılır','ayrı','gündüz','hızlı','ikileme','kelimelerle','sözcüğün','yemyeşil','masmavi','pekiştirme']),
    'İsim - Fiil Ayrımı.pdf': fp('7b19f6f34de1d6e695009e3c36a9828c8f0e26488fb3d4cce28dd6107b77927d','af01558cb6494d3fe75e17d615b01af51a173a34617e9928865267f0f6feb83c',['fiil','isim','yüzme','çocuk','kitap','ağaca','isimdir','hareket','oluş','eylem','kavram']),
    'Matematik EÇK.pdf': fp('8fb9e181c0007db6692def05969c4e9da3f390b40acbb0c99565ebf08149398a','163ff1bb3010bb4b8589883fba29ef3bf0e164ddf184bb86fcebc8d55e1f8d3f',['örnek','verilen','sayı','doğru','ondalık','kesir','doğal','santimetre','dikdörtgenin','basamaklı','uzunluğu']),
    'Nokta-Virgül.pdf': fp('9f4d7b5f322d0904ca274a6cc203fb812607f9f7a7d63267250075bf9ce1ff09','aecf288e11097e166fee435a5f4fcc550a6dfa4db2d42ad70e8ff48f6c4cc3c0',['nokta','kullanılır','virgül','ayırmak','cümle','cümlenin','konur','noktalama','sıralama','sözcükleri']),
    'Turkce EÇK - 1.pdf': fp('ec263c55b27f403cfedb94a3dfc6e5a95a8e78a3cfc2ebc1315bd671fa900db0','9918442864e2efbabf5e043a1ecad3dabbc5d0342092c1fd5baace02358f9913',['çocuklar','atatürk','arkadaş','hayat','zaman','sorular','ankara','sözcüklerin','cümle','metnin','anlam','noktalama','sözlük']),
    'Turkce EÇK- 2.pdf': fp('4fad5f4a7c37f9788930982153e43e9e4e812582a1e87a430891db9d0ed13370','6b0b9f71c6ddb155136cf0b4c0998c140f3f59ba90a1101ad0bef0a525860f26',['arkadaş','kalem','konu','zaman','çocuk','kenan','silgi','sorular','anlam','cümlelerde','film','telefon','ankara']),
    'din-511-eba.pdf': fp('16d1ddd43b090a5e0ce6489c5e98a92b1cab440774ed5d568b55127843a7a56d','4a1d82ddcf4ee1dedfc6d0db4d9408a909c72d25a906739e6548b061bde676a3',['allah','örnek','cevap','öğrencinin','ahlak','kültürü','ders','güzel','evrendeki','ihlas','doğadaki','rahman']),
    'din-511-mebi.pdf': fp('ce4fbe7ee4f25d63d326b4f027f4a20da1c11bb330c331b0b3f72c5076c78bf3','65c76da735c248e7f3d4a16a84442c8f76f341cd00f84f6621e023986bd5fae0',['allah','ahlak','bilgisi','kültürü','ayet','ihlas','evrendeki','eğitim','düzen','surenin','kusursuz'])
  };

  const source = (course, kind, family, name, originalName, open, fingerprint) => ({course, kind, family, name, originalName, open, ...(fingerprint || {})});
  const STATIC = [
    source('Matematik','meb','meb','Matematik MEB-1','matematik5-1.pdf',{type:'math',book:1,page:17}),
    source('Matematik','meb','meb','Matematik MEB-2','matematik5-2.pdf',{type:'math',book:2,page:16}),
    source('Matematik','school','eck','Matematik EKÇ-1','Matematik EÇK.pdf',{type:'private',id:'math_eck',page:4},KNOWN_FINGERPRINTS['Matematik EÇK.pdf']),
    source('Matematik','school','fenomen','Matematik Fenomen-1','Fenomen Matematik Soru Bankası - 1.pdf',{type:'private',id:'fenomen_1',page:1},KNOWN_FINGERPRINTS['Fenomen Matematik Soru Bankası - 1.pdf']),
    source('Matematik','school','fenomen','Matematik Fenomen-2','Fenomen Matematik Soru Bankası -2.pdf',{type:'private',id:'fenomen_2',page:1},KNOWN_FINGERPRINTS['Fenomen Matematik Soru Bankası -2.pdf']),
    source('Matematik','school','fenomen','Matematik Fenomen-3','Fenomen Matematik Soru Bankası -3.pdf',{type:'private',id:'fenomen_3',page:1},KNOWN_FINGERPRINTS['Fenomen Matematik Soru Bankası -3.pdf']),

    source('Türkçe','meb','meb','Türkçe MEB-1','Türkçe-1.pdf',{type:'turkish',book:1,page:12}),
    source('Türkçe','meb','meb','Türkçe MEB-2','Türkçe - 2.pdf',{type:'turkish',book:2,page:12}),
    source('Türkçe','school','eck','Türkçe EKÇ-1','Turkce EÇK - 1.pdf',{type:'private',id:'turkish_eck_1',page:7},KNOWN_FINGERPRINTS['Turkce EÇK - 1.pdf']),
    source('Türkçe','school','eck','Türkçe EKÇ-2','Turkce EÇK- 2.pdf',{type:'private',id:'turkish_eck_2',page:6},KNOWN_FINGERPRINTS['Turkce EÇK- 2.pdf']),
    source('Türkçe','school','deep','Türkçe Derin Öğrenme-1','Türkçe Derin Öğrenme EÇK.pdf',{type:'private',id:'turkish_deep_eck',page:8}),
    source('Türkçe','school','material','Türkçe Okul Materyali - Nokta ve Virgül','Nokta-Virgül.pdf',{type:'asset',path:'assets/school-turkish-nokta-virgul-v6520-p-2.webp'},KNOWN_FINGERPRINTS['Nokta-Virgül.pdf']),
    source('Türkçe','school','material','Türkçe Okul Materyali - Büyük Harflerin Kullanımı','Büyük Harflerin Kullanımı.pdf',{type:'asset',path:'assets/school-turkish-buyuk-harf-v6520-p-2.webp'},KNOWN_FINGERPRINTS['Büyük Harflerin Kullanımı.pdf']),
    source('Türkçe','school','material','Türkçe Okul Materyali - Deyim ve Atasözü','Deyim-Atasözü.pdf',{type:'asset',path:'assets/school-turkish-deyim-atasozu-v6520-p-2.webp'},KNOWN_FINGERPRINTS['Deyim-Atasözü.pdf']),
    source('Türkçe','school','material','Türkçe Okul Materyali - İkilemeler ve Pekiştirmeler','İkilemeler-Pekiştirmeler.pdf',{type:'asset',path:'assets/school-turkish-ikileme-pekistirme-v6520-p-1.webp'},KNOWN_FINGERPRINTS['İkilemeler-Pekiştirmeler.pdf']),
    source('Türkçe','school','material','Türkçe Okul Materyali - İsim ve Fiil Ayrımı','İsim - Fiil Ayrımı.pdf',{type:'asset',path:'assets/school-turkish-isim-fiil-v6520-p-2.webp'},KNOWN_FINGERPRINTS['İsim - Fiil Ayrımı.pdf']),

    source('Fen Bilimleri','meb','meb','Fen Bilimleri MEB-1','fenbilimleri5-1.pdf',{type:'science',book:1,page:21}),
    source('Fen Bilimleri','meb','meb','Fen Bilimleri MEB-2','fenbilimleri5-2.pdf',{type:'science',book:2,page:16}),
    source('Fen Bilimleri','school','eck','Fen Bilimleri EKÇ-1','Fen EÇK.pdf',{type:'private',id:'science_eck',page:2},KNOWN_FINGERPRINTS['Fen EÇK.pdf']),

    source('Sosyal Bilgiler','meb','meb','Sosyal Bilgiler MEB-1','sosyalbilgiler5-1.pdf',{type:'social',book:1,page:12}),
    source('Sosyal Bilgiler','meb','meb','Sosyal Bilgiler MEB-2','sosyalbilgiler5-2.pdf',{type:'social',book:2,page:12}),

    source('Din Kültürü','meb','meb','Din Kültürü MEB-1','din-kulturu-ve-ahlak-bilgisi-5sinif-ders-kitabi.pdf',{type:'religion',course:'Din Kültürü',topic:0,page:14}),
    source('Din Kültürü','school','eba','Din Kültürü EBA-1','din-511-eba.pdf',{type:'pdf',path:'assets/din-511-eba.pdf'},KNOWN_FINGERPRINTS['din-511-eba.pdf']),
    source('Din Kültürü','school','mebi','Din Kültürü MEBİ-1','din-511-mebi.pdf',{type:'pdf',path:'assets/din-511-mebi.pdf'},KNOWN_FINGERPRINTS['din-511-mebi.pdf']),

    source('Peygamberimizin Hayatı','meb','meb','Peygamberimizin Hayatı MEB-1','peygamberimizin-hayati-5sinif-ders-kitabi.pdf',{type:'religion',course:'Peygamberimizin Hayatı',topic:0,page:12}),

    source('Almanca','meb','meb','Almanca MEB Ders Kitabı-1','almanca5dkckl.pdf',{type:'german',topic:0,book:'L',page:11}),
    source('Almanca','meb','meb','Almanca MEB Çalışma Kitabı-1','almanca5ckckl.pdf',{type:'german',topic:0,book:'A',page:11}),
    source('Almanca','meb','meb','Almanca MEB Öğretmen Kılavuzu-1','almanca5okckl.pdf',{type:'german',topic:0,book:'H',page:9}),

    source('İngilizce','meb','meb','İngilizce MEB Ders Kitabı-1','ingilizce5dk.pdf',{type:'english',topic:0,book:'L',page:27}),
    source('İngilizce','meb','meb','İngilizce MEB Çalışma Kitabı-1','ingilizce5ck.pdf',{type:'english',topic:0,book:'A',page:9}),
    source('İngilizce','meb','meb','İngilizce MEB Öğretmen Kılavuzu-1','ingilizce5ok.pdf',{type:'english',topic:0,book:'H',page:26})
  ];

  function normalize(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function words(text) {
    const count = new Map();
    normalize(text).split(' ').filter(x => x.length > 3 && !STOP.has(x) && !/^\d+$/.test(x)).forEach(x => count.set(x, (count.get(x) || 0) + 1));
    return [...count].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr')).slice(0, 36).map(x => x[0]);
  }
  async function digest(value) {
    const bytes = value instanceof ArrayBuffer ? value : new TextEncoder().encode(String(value || ''));
    const data = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(data)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  async function fingerprint(item, file) {
    if (file?.arrayBuffer) item.fileHash = await digest(await file.arrayBuffer());
    const clean = normalize(item.text || '');
    item.contentHash = clean ? await digest(clean) : '';
    item.topicSignature = words(item.text || item.name);
    item.originalName = item.originalName || item.name;
    return item;
  }
  function similarity(a, b) {
    const A = new Set(a || []), B = new Set(b || []);
    if (A.size < 12 || B.size < 12) return 0;
    const common = [...A].filter(x => B.has(x)).length;
    return common / (A.size + B.size - common);
  }
  function allStored() {
    const rows = [...STATIC];
    Object.entries(state?.materials || {}).forEach(([key, items]) => {
      const at = key.lastIndexOf('|'), c = key.slice(0, at), t = Number(key.slice(at + 1));
      (Array.isArray(items) ? items : []).forEach((item, index) => rows.push({...item, course:c, kind:'school', family:item.family || inferFamily(item.originalName || item.name), stored:{course:c, topic:t, index}}));
    });
    (Array.isArray(state?.resourceCatalogV6580) ? state.resourceCatalogV6580 : []).forEach(item => rows.push(item));
    return rows;
  }
  function inferFamily(name) {
    const x = normalize(name);
    if (/derin öğrenme/.test(x)) return 'deep';
    if (/fenomen/.test(x)) return 'fenomen';
    if (/\b(eçk|ekç|eck|ekc)\b|ek çalışma|çalışma kitabı/.test(x)) return 'eck';
    if (/\beba\b/.test(x)) return 'eba';
    if (/\bmebi\b|mebi̇/.test(x)) return 'mebi';
    return 'material';
  }
  function familyLabel(course, family) {
    if (family === 'eck') return `${course} EKÇ`;
    if (family === 'deep') return `${course} Derin Öğrenme`;
    if (family === 'fenomen') return `${course} Fenomen`;
    if (family === 'eba') return `${course} EBA`;
    if (family === 'mebi') return `${course} MEBİ`;
    return `${course} Okul Kaynağı`;
  }
  function nextName(course, family, rows = allStored()) {
    const prefix = familyLabel(course, family), re = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)$', 'i');
    const used = rows.filter(x => x.course === course && (x.family || inferFamily(x.originalName || x.name)) === family).map(x => Number(String(x.name || '').match(re)?.[1] || 0));
    return `${prefix}-${Math.max(0, ...used) + 1}`;
  }
  function duplicateOf(item, course, rows = allStored()) {
    return rows.find(existing =>
      (item.fileHash && existing.fileHash && item.fileHash === existing.fileHash) ||
      (item.contentHash && existing.contentHash && item.contentHash === existing.contentHash) ||
      (existing.course === course && similarity(item.topicSignature, existing.topicSignature) >= .92)
    );
  }
  function prepareImport(item, course, topicIndex, requestedName) {
    item.originalName = item.originalName || item.name || requestedName;
    const duplicate = duplicateOf(item, course);
    if (duplicate) return {ok:false, message:`Bu kaynak zaten eklenmiş: ${duplicate.name}. Dosya adı farklı olsa bile içerik veya konu yapısı aynı.`};
    const family = inferFamily(requestedName || item.originalName);
    return {ok:true, family, name:nextName(course, family), originalName:item.originalName, topicIndex};
  }
  function registerIntegratedSource(meta) {
    if (!meta?.course || !COURSE_ORDER.includes(meta.course)) throw new Error('Kaynağın dersi belirtilmeli.');
    const item = {...meta, kind:meta.kind || 'school', family:meta.family || inferFamily(meta.originalName || meta.name)};
    const duplicate = duplicateOf(item, item.course);
    if (duplicate) return {ok:false, duplicate:duplicate.name};
    item.originalName = item.originalName || item.name || 'Yeni kaynak';
    item.name = nextName(item.course, item.family);
    state.resourceCatalogV6580 = Array.isArray(state.resourceCatalogV6580) ? state.resourceCatalogV6580 : [];
    state.resourceCatalogV6580.push(item); persist();
    return {ok:true, name:item.name};
  }

  function openAsset(path, title) {
    document.getElementById('resource-preview-v6580')?.remove();
    const modal = document.createElement('div'); modal.id = 'resource-preview-v6580'; modal.className = 'resource-preview-v6580';
    modal.innerHTML = `<div><div class="row between"><strong>${esc(title)}</strong><button type="button">✕ Kapat</button></div><img src="${esc(path)}" alt="${esc(title)}"></div>`;
    modal.querySelector('button').onclick = () => modal.remove(); document.body.appendChild(modal);
  }
  function openSource(index) {
    const row = collect()[index]; if (!row) return;
    if (row.stored) return v622ViewSource(row.stored.course, row.stored.topic, row.stored.index);
    const o = row.open || {};
    if (o.type === 'math') return openMebBookV618(o.book, o.page, row.name);
    if (o.type === 'turkish') return turkOpenPage(o.book, o.page);
    if (o.type === 'science') return fenOpenSource(o.book, o.page);
    if (o.type === 'social') return socialOpenPage(o.book, o.page);
    if (o.type === 'religion') return relOpenPage(o.course, o.topic, o.page);
    if (o.type === 'german') return germanOpenPage(o.topic, o.book, o.page);
    if (o.type === 'english') return englishOpenPage(o.topic, o.book, o.page);
    if (o.type === 'private') return openPrivateSourceV649(o.id, o.page);
    if (o.type === 'asset') return openAsset(o.path, row.name);
    if (o.type === 'pdf') return window.open(o.path, '_blank', 'noopener');
    alert('Bu kaynağın uygulama içi önizlemesi henüz yok.');
  }
  function collect() {
    const seen = new Set(), out = [];
    allStored().forEach(row => {
      const key = row.fileHash || row.contentHash || `${row.course}|${normalize(row.originalName || row.name)}`;
      if (!key || seen.has(key)) return; seen.add(key); out.push(row);
    });
    return out.sort((a,b) => COURSE_ORDER.indexOf(a.course)-COURSE_ORDER.indexOf(b.course) || (a.kind==='meb'?-1:1) - (b.kind==='meb'?-1:1) || String(a.name).localeCompare(String(b.name),'tr',{numeric:true}));
  }
  function rowMarkup(row, index) {
    return `<div class="resource-row-v6580"><div><strong>${esc(row.name)}</strong><small>Asıl dosya: ${esc(row.originalName || row.name)}</small></div><button type="button" onclick="openResourceV6580(${index})">Aç</button></div>`;
  }
  function openLibrary() {
    view = 'resource-library-v6580'; const rows = collect();
    const body = COURSE_ORDER.map(courseName => {
      const indexes = rows.map((row,index) => ({row,index})).filter(x => x.row.course === courseName);
      const meb = indexes.filter(x => x.row.kind === 'meb'), school = indexes.filter(x => x.row.kind !== 'meb');
      const group = (title, list, empty) => `<div class="resource-group-v6580"><h3>${title} <span>${list.length}</span></h3>${list.length ? list.map(x => rowMarkup(x.row,x.index)).join('') : `<p class="muted">${empty}</p>`}</div>`;
      return `<section class="resource-course-v6580" data-course="${esc(courseName)}"><h2>${COURSE_ICONS[courseName]} ${esc(courseName)}</h2>${group('MEB Kaynakları',meb,'MEB kaynağı kayıtlı değil.')}${group('Okul Kaynakları',school,'Bu ders için okul kaynağı bulunmuyor.')}</section>`;
    }).join('');
    app.innerHTML = `${nav()}<div class="resource-head-v6580"><div><h1>📚 Kaynak Kütüphanesi</h1><p>MEB ve okul kaynakları derslere göre tek yerde.</p></div><button type="button" onclick="home()">← Ana sayfa</button></div><div class="resource-library-v6580">${body}</div>`;
    window.scrollTo(0,0);
  }
  function patchHome() {
    const button = document.querySelector('.v651-meb-tool'); if (!button) return;
    button.textContent = '📚 Kaynak Kütüphanesi'; button.onclick = openLibrary;
  }

  const style = document.createElement('style'); style.id = 'resource-library-v6580-style'; style.textContent = `
    .resource-head-v6580{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px}.resource-head-v6580 h1{margin-bottom:4px}.resource-head-v6580 p{margin:0;color:#b9c7da}
    .resource-library-v6580{display:grid;gap:16px}.resource-course-v6580{padding:16px;border-radius:18px;background:#29364d;border:1px solid #829bc444}.resource-course-v6580>h2{margin:0 0 12px}
    .resource-group-v6580{margin-top:12px;padding:12px;border-radius:14px;background:#1e2b40}.resource-group-v6580 h3{display:flex;justify-content:space-between;margin:0 0 9px;font-size:16px}.resource-group-v6580 h3 span{padding:2px 8px;border-radius:999px;background:#536b91;color:#fff;font-size:12px}
    .resource-row-v6580{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-top:1px solid #ffffff13}.resource-row-v6580:first-of-type{border-top:0}.resource-row-v6580 div{min-width:0}.resource-row-v6580 strong,.resource-row-v6580 small{display:block}.resource-row-v6580 small{margin-top:3px;color:#aebdd1;overflow-wrap:anywhere}.resource-row-v6580 button{flex:0 0 auto}
    .resource-preview-v6580{position:fixed;inset:0;z-index:10050;padding:12px;background:#07111de8;overflow:auto}.resource-preview-v6580>div{max-width:850px;margin:auto;padding:14px;border-radius:18px;background:#1c2c43}.resource-preview-v6580 img{display:block;width:100%;max-height:82vh;object-fit:contain;margin-top:12px;border-radius:10px;background:#fff}
    @media(min-width:760px){.resource-library-v6580{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.resource-course-v6580{padding:12px}.resource-row-v6580{align-items:flex-start}.resource-row-v6580 button{padding:9px 12px}}
  `; document.head.appendChild(style);

  window.openResourceLibraryV6580 = openLibrary;
  window.openResourceV6580 = openSource;
  window.registerTeacherSourceV6580 = registerIntegratedSource;
  window.__DURU_RESOURCE_LIBRARY_V6580__ = {VERSION, COURSE_ORDER, STATIC, collect, fingerprint, prepareImport, duplicateOf, nextName, registerIntegratedSource, similarity, normalize};
  const beforeHome = window.home;
  window.home = home = function() { const result = beforeHome.apply(this, arguments); setTimeout(patchHome, 0); patchHome(); return result; };
  patchHome();
})();
