/* Duru'nun Akıllı Öğretmeni - 5. sınıf Din Kültürü, 1. ünite
   EBA (15 açık uçlu ana soru) ve MEBİ (7 yazılı hazırlığı sorusu) kazanımlarını
   temel alan YENİ, özgün 32 açık uçlu soru. Mevcut sınav/puan/rozet/GTT koduna dokunmaz.
   Resmî materyaller kendi MEB/EBA adreslerinde açılır; içerikler bu depoya kopyalanmaz. */
(function () {
  'use strict';
  const COURSE = 'Din Kültürü';
  const SOURCE_URLS = {
    EBA: 'https://eba-public-small.eba.gov.tr/prod/media/landing/19196668-8f9a-4ac6-8ca3-4d510b89c52a.pdf',
    MEBI: 'https://mebi.eba.gov.tr/pdf-file?url=upload%2Fmidterm-question%2Fpdf%2Fad31b62b55.pdf'
  };
  const TOPIC_OUTCOMES = ['DKAB.5.1.1', 'DKAB.5.1.2', 'DKAB.5.1.3', 'DKAB.5.1.4'];
  const TOPIC_NAMES = ['Evrendeki Mükemmel Düzen', 'Allah’ın Varlığı ve Birliği', 'Allah’ın Güzel İsimleri', 'İhlas Suresi'];
  // Her satır: [özgün açık uçlu soru, örnek yanıt, ilgili MEB kaynağı, PDF sayfası].
  const BANK = [
    [
      ['Bir gölün suyu sıcak günlerde azalıyor, yağışlı günlerde yeniden artıyor. Gölün su seviyesini etkileyen iki doğa olayını ve aralarındaki ilişkiyi açıklayınız.', 'Güneşin etkisiyle buharlaşma olur. Su buharı yoğunlaşıp bulut oluşturur; yağışla su yeniden göle ve çevreye ulaşır. Böylece su döngüsü devam eder.', 'EBA', 3],
      ['Arıların azaldığı bir elma bahçesinde meyve sayısı neden değişebilir? Canlılar arasındaki ilişkiyi açıklayınız.', 'Arılar çiçeklerin tozlaşmasına yardımcı olur. Arıların azalması tozlaşmayı ve meyve oluşumunu azaltabilir. Canlılar birbiriyle ilişki içindedir.', 'EBA', 3],
      ['Sonbaharda toprağa düşen yaprakların ilkbahardaki bitki gelişimine nasıl katkı sağlayabileceğini üç aşamada açıklayınız.', 'Yapraklar yere düşer, ayrıştırıcı canlılar onları parçalar, oluşan besin maddeleri toprağa karışır ve bitkiler bunlardan yararlanır.', 'EBA', 5],
      ['Dünya atmosferinin canlıların yaşaması bakımından önemli olan iki işlevini yazınız.', 'Atmosfer, Güneş’ten gelen bazı zararlı ışınlara karşı koruma sağlar ve küçük gök cisimlerinin önemli bir kısmının yeryüzüne ulaşmasını önler.', 'EBA', 3],
      ['Ay’ın hilalden dolunaya kadar farklı şekillerde görülmesi ve kuşların mevsimsel göçleri hangi ortak özelliği gösterir?', 'Her iki olay da belirli zamanlarda tekrarlanan örüntüler içerir. Bu gözlemler doğadaki düzenli işleyiş üzerinde düşünmemizi sağlar.', 'EBA', 6],
      ['Bir kekte malzemelerin belirli miktarlarda kullanılmasıyla doğadaki denge arasında nasıl bir benzerlik kurulabilir?', 'Tarifteki malzemelerin ölçüsü sonucu etkiler. Doğada da pek çok koşulun birbiriyle uyumlu olması canlıların yaşamını etkiler. İkisinde de ölçü ve denge önemlidir.', 'EBA', 3],
      ['Aynı bahçede farklı bitkilerin su, toprak ve güneş ışığından yararlanmasını evrendeki düzen açısından yorumlayınız.', 'Bitkiler gelişmek için çevre koşullarından yararlanır ve birbirinden farklı özellikler gösterir. Bu durum doğadaki çeşitliliği ve karşılıklı ilişkileri fark etmemizi sağlar.', 'MEBI', 1],
      ['Su döngüsünün buharlaşma, yoğunlaşma, yağış ve yüzeysel akış aşamalarını sıralayıp her aşamayı birer sözcük grubuyla açıklayınız.', 'Buharlaşma: suyun buhara dönüşmesi; yoğunlaşma: bulutların oluşması; yağış: suyun yeryüzüne dönmesi; yüzeysel akış: suyun akarsu, göl ve denizlere ulaşması.', 'EBA', 4]
    ],
    [
      ['Bir saatin çarklarının uyum içinde çalışmasıyla insan vücudundaki organların birlikte çalışmasını karşılaştırınız. Bu benzetmenin din dersindeki mesajını yazınız.', 'Saatin parçaları ve vücudun organları belirli görevler üstlenerek birlikte çalışır. Din dersinde bu uyum, Allah’ın yarattığı düzen üzerinde düşünmeyle ilişkilendirilir.', 'EBA', 6],
      ['Bir tohumun filizlenmesinde gözlemlenen koşulları ve bu gözlemden Allah’ın varlığı ile ilgili yapılan inanç temelli çıkarımı ayrı ayrı yazınız.', 'Gözlem: Tohumun büyümesinde su, hava, uygun sıcaklık ve ışık gibi koşullar etkilidir. İnanç temelli çıkarım: Bu düzenin Allah’ın yaratmasıyla ilişkili olduğu düşünülür.', 'MEBI', 2],
      ['Gün batımı, kuşların hareketleri ve meyve ağaçlarının gelişimini inceleyen öğrenciler hangi ortak düşünceye ulaşabilir? Bir cümleyle açıklayınız.', 'Bu olaylar doğadaki uyum ve düzeni fark etmelerini sağlar; İslam inancında bu düzen Allah’ın yaratmasındaki ölçüyle ilişkilendirilir.', 'MEBI', 1],
      ['Kalbin kanı pompalaması ve akciğerin oksijen alışverişi yapması neden birbirinden bağımsız düşünülemez?', 'Kalp ve akciğer farklı görevler üstlense de vücudun yaşaması için birlikte çalışır. Organlar arasındaki bu uyum, insan vücudundaki düzenin bir örneğidir.', 'MEBI', 1],
      ['Tevhit inancını tanımlayınız ve bu inancın insanın ibadetlerine nasıl yansıyacağına bir örnek veriniz.', 'Tevhit, Allah’ın bir ve tek olduğuna inanmak demektir. Bu inanç, ibadetleri yalnızca Allah’a yöneltmekte görülür.', 'EBA', 6],
      ['İnsanların doğadaki olayları gözlemlemesi ile Allah’ın birliği hakkında düşünmesi arasında nasıl bir bağ kurulabilir?', 'İnsan gözlem yaparak doğadaki düzeni fark eder. İslam inancına göre bu düzen, insanı Allah’ın varlığı ve birliği hakkında düşünmeye yöneltebilir.', 'EBA', 6],
      ['Bir öğrenci doğadaki her olayın birbirinden tamamen bağımsız olduğunu söylüyor. Ona su, toprak ve bitki üzerinden bir karşı örnek veriniz.', 'Bitki büyümek için topraktaki maddelere ve suya ihtiyaç duyar; su döngüsü de bitkilerin yaşamını etkiler. Böylece doğadaki olayların ilişkili olduğu görülür.', 'EBA', 4],
      ['İhlas suresini henüz okumamış bir arkadaşınıza “Allah’ın birliği” ifadesinin ne anlama geldiğini günlük dille açıklayınız.', 'İslam inancına göre Allah tektir, ortağı ve benzeri yoktur. Yaratma ve ilahlık bakımından O’na eş bir varlık kabul edilmez.', 'EBA', 6]
    ],
    [
      ['Şiddetli yağmurun yağmasındaki güç ile yağmurun canlılara fayda sağlamasını Allah’ın hangi iki güzel ismiyle ilişkilendirirsiniz? Gerekçenizi yazınız.', 'Kadir, Allah’ın her şeye güç yetirmesini; Rahman, bütün varlıklara merhamet etmesini anlatır. Yağmur örneğinde güç ve merhamet birlikte düşünülebilir.', 'EBA', 7],
      ['Bir çocuk kimsenin duymadığı bir dua ediyor. Bu örnek Allah’ın hangi ismiyle ilişkilendirilir? Anlamını açıklayınız.', 'Semi: Allah’ın her şeyi işitmesidir. İnsanlar duymasa da Allah’ın duaları işittiğine inanılır.', 'EBA', 8],
      ['Bir kişinin kimseye açıklamadığı düşünceleri bilmek ile onun davranışlarını görmek arasında hangi iki isim bakımından fark vardır?', 'Âlim, Allah’ın her şeyi bilmesi; Basir, her şeyi görmesi anlamına gelir. İlki bilgiye, ikincisi görmeye vurgu yapar.', 'EBA', 9],
      ['Besmelede merhameti ifade eden iki güzel ismi yazınız. Bu isimlerin davranışlarımıza nasıl örnek olabileceğini belirtiniz.', 'Rahman ve Rahîm. Bu isimlerin anlamını düşünmek, ihtiyaç sahibi insanlara ve canlılara şefkatle yaklaşmaya örnek olabilir.', 'EBA', 7],
      ['Bir kişi “Allah her şeyi bilir ama her şeye gücü yetmez.” diyor. Bu ifadeyi hangi iki isim üzerinden değerlendirirsiniz?', 'Âlim, Allah’ın her şeyi bildiğini; Kadir, her şeye gücünün yettiğini ifade eder. İslam inancına göre söylenen ikinci kısım doğru değildir.', 'MEBI', 2],
      ['“Yaratan bilmez mi?” ve “Allah onların yaptıklarını görür.” anlamındaki ifadeler hangi güzel isimleri hatırlatır?', 'Birinci ifade Âlim ismini, ikinci ifade Basir ismini hatırlatır. Âlim bilmek, Basir görmek anlamıyla ilişkilidir.', 'MEBI', 3],
      ['Bir arkadaşınız zor bir gün geçiriyor. Allah’ın merhametini ve her şeyi bilmesini anlatan iki ismi kullanarak kısa bir dua örneği yazınız.', 'Örnek: “Ey Rahman olan Allah’ım, arkadaşıma merhametinle yardım et. Ey Âlim olan Allah’ım, onun sıkıntısını en iyi Sen bilirsin.”', 'EBA', 8],
      ['Allah’ın güzel isimlerini araştıran bir öğrenci güvenilir bilgiye nasıl ulaşabilir? İki farklı kaynak veya kontrol yolu öneriniz.', 'Kur’an-ı Kerim’in ilgili ayetlerinden ve ders kitabı gibi güvenilir dinî kaynaklardan yararlanabilir; bulduğu anlamları karşılaştırıp doğrulayabilir.', 'MEBI', 2]
    ],
    [
      ['İhlas suresinin “De ki: O, Allah’tır, tektir.” anlamındaki ayeti hangi temel inancı anlatır? Açıklayınız.', 'Allah’ın bir ve tek olduğu, ortağının bulunmadığı tevhit inancını anlatır.', 'EBA', 9],
      ['“Allah Samed’dir.” ifadesi ile insanların günlük hayatta birbirlerine ihtiyaç duyması arasında nasıl bir fark vardır?', 'İnsanlar birbirlerine ve birçok şeye ihtiyaç duyar. Samed, Allah’ın hiçbir şeye muhtaç olmadığı, bütün varlıkların O’na muhtaç olduğu anlamındadır.', 'EBA', 11],
      ['İhlas suresinde geçen “Doğurmamış ve doğmamıştır.” ifadesinin Allah hakkında anlattığını kendi cümlelerinizle yazınız.', 'Allah insanlar gibi doğan veya çocuk sahibi olan bir varlık değildir. O, yaratılmışların özelliklerinden uzaktır.', 'MEBI', 3],
      ['“O’nun hiçbir dengi yoktur.” ifadesi hangi yanlış düşünceyi reddeder? Bir örnek üzerinden açıklayınız.', 'Allah’a eş veya benzer bir varlık bulunduğu düşüncesini reddeder. İslam inancına göre hiçbir varlık Allah ile eş tutulamaz.', 'EBA', 10],
      ['Sınava çalışan bir öğrenci, “Allah’a güvenmek için hiç çalışmama gerek yok.” diyor. İhlas suresinin mesajıyla birlikte bu düşünceyi değerlendiriniz.', 'Allah’a güvenmek, kişinin kendi sorumluluklarını bırakması demek değildir. Öğrenci çalışmalı, elinden geleni yaptıktan sonra Allah’a dua edip güvenmelidir.', 'EBA', 11],
      ['İhlas suresinin dört ayetinin Türkçe anlamını birer kısa cümle halinde doğru sırayla özetleyiniz.', '1) Allah tektir. 2) Allah Samed’dir, hiçbir şeye muhtaç değildir. 3) Doğurmamış ve doğmamıştır. 4) O’nun hiçbir dengi yoktur.', 'EBA', 10],
      ['“Yalnızca senden yardım dileriz.” ifadesi ile “Allah Samed’dir.” ifadesi aynı surede mi geçer? Doğru sureyi belirterek açıklayınız.', '“Allah Samed’dir.” ifadesi İhlas suresindedir. “Yalnızca senden yardım dileriz.” ifadesi Fatiha suresinde geçer.', 'EBA', 10],
      ['İhlas suresinin vermek istediği mesajı tevhit, Samed ve benzersiz sözcüklerini kullanarak iki cümleyle özetleyiniz.', 'İhlas suresi tevhit inancını, yani Allah’ın bir ve tek olduğunu anlatır. Allah Samed’dir, hiçbir şeye muhtaç değildir ve benzersizdir.', 'MEBI', 4]
    ]
  ];
  const escHtml = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const norm = v => String(v || '').toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const safeSource = kind => SOURCE_URLS[kind] || SOURCE_URLS.EBA;
  const itemLinks = () => '<a href="' + SOURCE_URLS.EBA + '" target="_blank" rel="noopener noreferrer">📄 EBA · Açık uçlu çalışma soruları (24 sayfa)</a>' +
    '<a href="' + SOURCE_URLS.MEBI + '" target="_blank" rel="noopener noreferrer">📄 MEBİ · Yazılıya hazırlanıyorum (7 sayfa)</a>';
  function uniqueQuestions(index) {
    const seen = new Set();
    try {
      if (typeof RELIGION_DATA !== 'undefined') (RELIGION_DATA[COURSE]?.[index]?.questions || []).forEach(q => seen.add(norm(q.prompt)));
      if (typeof v622AllQuestions === 'function') (v622AllQuestions(COURSE, index) || []).forEach(q => seen.add(norm(q.prompt)));
      if (window.__DURU_V649_TEST__?.exact) (window.__DURU_V649_TEST__.exact(COURSE,index)||[]).forEach(q => seen.add(norm(q.prompt)));
    } catch (e) { console.warn('Din kaynak soruları: mevcut soruların bir kısmı karşılaştırılamadı.',e); }
    return BANK[index].filter(row => { const id=norm(row[0]); if(seen.has(id))return false;seen.add(id);return true; });
  }
  let active = null;
  function showPractice() {
    if (!active) return;
    const root = document.getElementById('app');
    if (!root) return;
    const {t, questions, index, answers} = active;
    const isEnd = index >= questions.length;
    const navBtns = '<button type="button" id="din-written-back">← Konulara dön</button>';
    if (isEnd) {
      root.innerHTML='<div class="rel-block"><h2>Yazılı çalışması tamamlandı</h2><p>' + questions.length + ' özgün açık uçlu soru gözden geçirildi. Bunlar otomatik puanlanan konu testlerinden bağımsızdır.</p><div class="rel-actions">' + navBtns + '<button type="button" class="primary" id="din-written-restart">Yeniden çalış</button></div></div>';
      document.getElementById('din-written-restart').onclick=()=>{active.index=0;showPractice()};
    } else {
      const row=questions[index], answer=answers[index]||'', source=row[2], pg=row[3];
      root.innerHTML='<div class="rel-block"><div class="rel-top"><button type="button" id="din-written-home">⌂</button><div><strong>Din · Yazılıya hazırlık</strong><div>'+escHtml(TOPIC_NAMES[t])+'</div></div><span>'+ (index+1) + '/' + questions.length + '</span></div>' +
        '<section class="card"><p class="muted">'+TOPIC_OUTCOMES[t]+' · '+escHtml(source)+' kaynak kazanımı · PDF s. '+pg+'</p><h2>'+escHtml(row[0])+'</h2>' +
        '<label for="din-written-answer">Cevabını kendi cümlelerinle yaz</label><textarea id="din-written-answer" rows="6" placeholder="Önce kendin düşün ve yaz...">'+escHtml(answer)+'</textarea>' +
        '<div class="rel-actions"><button type="button" id="din-written-reveal">Örnek cevabı göster</button><button type="button" class="primary" id="din-written-next">Cevabımı kaydet ve devam et →</button></div><div id="din-written-sample" hidden class="card" style="background:#f5f8ff"><b>Örnek cevap (tek doğru anlatım olmak zorunda değildir)</b><p>'+escHtml(row[1])+'</p></div></section>' +
        '<section class="card"><h3>Resmî çalışma belgeleri</h3><div class="rel-actions din-official-links">'+itemLinks()+'</div><p class="muted">Bu çalışma, resmî soruların birebir kopyası değildir. Kaynak kazanımlarına göre yeni hazırlanmıştır.</p></section>' +
        '<div class="rel-actions">' + navBtns + '</div></div>';
      document.getElementById('din-written-home').onclick=()=>window.home();
      document.getElementById('din-written-reveal').onclick=()=>{document.getElementById('din-written-sample').hidden=false;};
      document.getElementById('din-written-next').onclick=()=>{answers[index]=document.getElementById('din-written-answer').value;active.index++;showPractice();};
    }
    document.getElementById('din-written-back').onclick=()=>window.openCourse(COURSE);
    window.scrollTo(0,0);
  }
  window.startDinWrittenPractice2026 = function (index) {
    const t=Number(index);
    if (!Number.isInteger(t)||t<0||t>=BANK.length)return;
    if (typeof window.topicAccessibleV651 === 'function' && !window.topicAccessibleV651(COURSE,t)) {
      alert('Önceki konuyu tamamlayınca bu yazılı çalışması açılacaktır.');
      return;
    }
    if (typeof window.savedTestV617 === 'function' && window.savedTestV617()) {
      alert('Önce duraklatılmış testini tamamlamalısın.');
      return;
    }
    const qs=uniqueQuestions(t);
    if (!qs.length) {alert('Bu konuda mevcut sorulardan farklı yeni soru kalmadı.');return;}
    active={t,questions:qs,index:0,answers:[]};
    course=COURSE;topic=t;view='din-written-work';
    showPractice();
  };
  function decorateCourse() {
    if (typeof course !== 'string'||course!==COURSE||view!=='course')return;
    const cards=[...document.querySelectorAll('#app .rel-item')];
    for(let i=0;i<4&&i<cards.length;i++){
      const card=cards[i],host=card.querySelector('.rel-actions')||card;
      if(card.querySelector('.din-2026-sources'))continue;
      const box=document.createElement('div');
      box.className='din-2026-sources';
      box.style.cssText='margin-top:12px;padding-top:10px;border-top:1px solid #8998aa44';
      const locked=typeof window.topicAccessibleV651==='function'&&!window.topicAccessibleV651(COURSE,i);
      box.innerHTML='<p class="muted small">Yazılıya hazırlık · '+TOPIC_OUTCOMES[i]+'</p><div class="rel-actions din-official-links">'+itemLinks()+'</div>';
      const button=document.createElement('button');button.type='button';button.textContent='✍️ 8 yeni açık uçlu soru';button.className='primary';button.disabled=locked;
      button.title=locked?'Önceki konuyu tamamla':'MEB EBA ve MEBİ belgelerinden yeni üretilen sorular';
      button.addEventListener('click',()=>window.startDinWrittenPractice2026(i));box.appendChild(button);host.appendChild(box);
    }
  }
  const previousOpen=window.openCourse;
  if(typeof previousOpen==='function'){
    window.openCourse=openCourse=function(c){const res=previousOpen.apply(this,arguments);if(c===COURSE)decorateCourse();return res;};
  }
  const previousLesson=window.lesson;
  if(typeof previousLesson==='function'){
    window.lesson=lesson=function(i,part){const res=previousLesson.apply(this,arguments);if(course===COURSE&&Number(i)<4&&view==='lesson'){
      const host=document.querySelector('#app .rel-actions');
      if(host&&!document.getElementById('din-written-lesson-btn')){
        const btn=document.createElement('button');btn.id='din-written-lesson-btn';btn.textContent='✍️ Yazılı çalışma soruları';btn.onclick=()=>window.startDinWrittenPractice2026(Number(i));host.appendChild(btn);
      }
    }return res;};
  }
  const css=document.createElement('style');css.textContent='.din-official-links{display:flex;gap:8px;flex-wrap:wrap}.din-official-links a{color:#155e75;text-decoration:underline;padding:6px 0;font-size:13px}.din-2026-sources .rel-actions{margin:3px 0 8px}.din-2026-sources button{font-size:14px}#din-written-answer{display:block;width:100%;min-height:130px;margin:12px 0;font-size:16px;line-height:1.45;resize:vertical}';document.head.appendChild(css);
  if(typeof view!=='undefined'&&view==='course'&&course===COURSE)decorateCourse();
  window.__DIN_YAZILI_2026__={version:'2026-11-02',count:BANK.map(a=>a.length),sourceUrls:SOURCE_URLS,outcomes:TOPIC_OUTCOMES};
})();
