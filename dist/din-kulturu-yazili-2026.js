/* Duru'nun Akıllı Öğretmeni · 5. sınıf Din Kültürü
   511 EBA ve 511 MEBİ belgeleri: konu içeriği, dört seçenekli test ve GTT ek paketi. */
(function () {
  'use strict';

  const COURSE = 'Din Kültürü';
  const SOURCES = {
    EBA: { file: './assets/din-511-eba.pdf', label: '511 EBA · Açık Uçlu Çalışma Soruları', pages: '3–11' },
    MEBI: { file: './assets/din-511-mebi.pdf', label: '511 MEBİ · Yazılıya Hazırlanıyorum', pages: '2–4' }
  };
  const TOPICS = ['Evrendeki Mükemmel Düzen', 'Allah’ın Varlığı ve Birliği', 'Allah’ın Güzel İsimleri', 'İhlas Suresi'];
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const safePage = value => Math.max(1, Number(value) || 1);

  // PDF’deki açık uçlu çalışmalar, 10 yaş düzeyinde tek doğru cevabı olan dört seçenekli sorulara dönüştürüldü.
  // Doğrudan belgeye dayanmayan deney/ödev sorusu eklenmedi.
  const QUESTION_BANK = [
    [
      q('EBA’da kek tarifi ile atmosfer örneği birlikte hangi düşünceyi anlatır?', 'Ölçü ve dengenin önemli olduğunu', ['Ölçü ve dengenin önemli olduğunu','Her şeyin rastgele oluştuğunu','Ölçünün gereksiz olduğunu','Sadece kek yapmayı'], 'EBA', 3, 'Tarifteki ölçüler ve atmosferdeki hassas dengeyi birlikte düşün.'),
      q('Elma bahçesindeki arılar, çiçeklerin meyveye dönüşmesine nasıl yardım eder?', 'Tozlaşmaya yardım ederek', ['Tozlaşmaya yardım ederek','Yaprakları boyayarak','Gölü kurutarak','Ağaçları keserek'], 'EBA', 3, 'Metinde arıların çiçeklere konduğu anlatılıyor.'),
      q('Sıcak bir günde göl suyunun azalmasının temel nedeni hangisidir?', 'Suyun buharlaşması', ['Suyun buharlaşması','Suyun donması','Arıların uçması','Yaprakların düşmesi'], 'EBA', 3, 'Sıcaklık arttığında suyun bir kısmı buhar hâline geçer.'),
      q('Su döngüsünde su buharının bulutlara dönüşmesine ne denir?', 'Yoğunlaşma', ['Yoğunlaşma','Buharlaşma','Tozlaşma','Göç'], 'EBA', 4, 'Buharlaşmadan sonra su buharı soğuyup küçük damlacıklara dönüşür.'),
      q('Kuşların mevsimsel göçü ve Ay’ın evreleri hangi ortak özelliğe sahiptir?', 'Düzenli aralıklarla tekrar etmeleri', ['Düzenli aralıklarla tekrar etmeleri','Sadece gündüz görülmeleri','İnsanlar tarafından yapılmaları','Hiç değişmemeleri'], 'EBA', 6, 'İki olayın da belli bir düzeni vardır.'),
      q('Yere düşen yaprakların zamanla toprağa karışması bitkilere nasıl yarar sağlar?', 'Toprağa besin maddesi kazandırır', ['Toprağa besin maddesi kazandırır','Güneşi söndürür','Yağmuru durdurur','Ay’ı büyütür'], 'EBA', 5, 'Yapraklar ayrışınca toprak bitkiler için daha zengin hâle gelir.')
    ],
    [
      q('Saatin parçalarının ve vücuttaki organların uyumlu çalışması bize neyi fark ettirir?', 'Bir düzen içinde birlikte çalıştıklarını', ['Bir düzen içinde birlikte çalıştıklarını','Birbirlerine hiç ihtiyaç duymadıklarını','Rastgele hareket ettiklerini','Sadece saatlerin önemli olduğunu'], 'EBA', 6, 'Saatteki parçalar ve organlar farklı görevlerle bir bütünü oluşturur.'),
      q('Bir çiçeğin büyümesinde su, güneş ışığı ve hava gibi etkenleri görmek neyi gösterir?', 'Canlıların belirli koşullara ihtiyaç duyduğunu', ['Canlıların belirli koşullara ihtiyaç duyduğunu','Çiçeklerin hiç büyümediğini','Suyun gereksiz olduğunu','Güneşin yalnız geceleri çıktığını'], 'MEBI', 2, 'MEBİ metnindeki çiçeğin büyüme aşamalarını hatırla.'),
      q('Doğadaki düzen üzerinde düşünen bir öğrenci hangi inanç konusu hakkında fikir yürütebilir?', 'Allah’ın varlığı ve birliği hakkında', ['Allah’ın varlığı ve birliği hakkında','Sadece oyun kuralları hakkında','Sınıf sıraları hakkında','Yemek tarifleri hakkında'], 'MEBI', 2, 'Kaynakta düzenin Allah’ın varlığı ve birliğiyle ilişkilendirildiği anlatılır.'),
      q('Tevhit inancı ne demektir?', 'Allah’ın bir ve tek olduğuna inanmak', ['Allah’ın bir ve tek olduğuna inanmak','Birden çok yaratıcıya inanmak','Hiçbir şeyin düzeni olmadığını düşünmek','Sadece gökyüzünü incelemek'], 'EBA', 6, 'İhlas suresinin ana mesajını da düşün.'),
      q('Kalp ile akciğerin birlikte çalışması hangi örneğe uygundur?', 'Vücuttaki uyum ve düzene', ['Vücuttaki uyum ve düzene','Rastgeleliğe','İsrafa','Yalnızlığa'], 'MEBI', 1, 'İki organ farklı görev yapar; ikisi de yaşamak için gereklidir.'),
      q('Bir tohumun filizlenmesini dikkatle gözlemlemek öğrenciye ne kazandırabilir?', 'Yaratılış ve düzen üzerinde düşünme', ['Yaratılış ve düzen üzerinde düşünme','Doğaya zarar verme isteği','Sorumluluktan kaçma','Bilgiye ilgisizlik'], 'MEBI', 2, 'Kaynakta çiçeğin büyüme aşamaları gözleniyor.')
    ],
    [
      q('Allah’ın her şeye güç yetirmesini anlatan güzel isim hangisidir?', 'Kadir', ['Kadir','Semi','Basir','Âlim'], 'EBA', 7, 'Kaynakta yağmurun güçlü biçimde yağması örneği veriliyor.'),
      q('İnsanların duymadığı bir duayı da Allah’ın işitmesi hangi isimle anlatılır?', 'Semi', ['Semi','Kadir','Basir','Rahim'], 'EBA', 8, 'Semi, işitmekle ilişkilidir.'),
      q('Allah’ın her şeyi bilmesini anlatan güzel isim hangisidir?', 'Âlim', ['Âlim','Basir','Rahman','Kadir'], 'EBA', 9, 'Bilmek anlamını taşıyan ismi seç.'),
      q('Allah’ın her şeyi görmesini anlatan güzel isim hangisidir?', 'Basir', ['Basir','Semi','Rahim','Kadir'], 'MEBI', 3, 'MEBİ’de “yaptıklarını görür” ifadesi geçiyor.'),
      q('Allah’ın bütün varlıklara merhametini anlatan isim hangisidir?', 'Rahman', ['Rahman','Kadir','Âlim','Basir'], 'EBA', 7, 'Yağmurun canlılara nimet ulaştırması örneğini düşün.'),
      q('Esmaül Hüsna ifadesi ne anlama gelir?', 'Allah’ın güzel isimleri', ['Allah’ın güzel isimleri','Bir dağın adı','Sadece bir ibadet saati','Bir oyun türü'], 'MEBI', 2, 'MEBİ belgesindeki esmayihüsna sorusunu hatırla.')
    ],
    [
      q('İhlas suresinin ilk ayetinin anlamı hangisidir?', 'De ki: O, Allah’tır, tektir.', ['De ki: O, Allah’tır, tektir.','Yalnızca sana kulluk ederiz.','Bizi doğru yola ilet.','O, Rahman ve Rahim’dir.'], 'EBA', 10, 'Kaynakta ayetlerin anlamları arasından İhlas suresine ait olanları seçme çalışması var.'),
      q('“Allah Samed’dir.” ifadesi ne anlatır?', 'Allah’ın hiçbir şeye muhtaç olmadığını', ['Allah’ın hiçbir şeye muhtaç olmadığını','Allah’ın uyuduğunu','Allah’ın yalnızca insanları gördüğünü','Allah’ın bir yeri olmadığını'], 'EBA', 10, 'Samed için kaynakta parantez içinde açıklama veriliyor.'),
      q('Aşağıdakilerden hangisi İhlas suresinde yer almaz?', 'Yalnızca sana kulluk ederiz.', ['Yalnızca sana kulluk ederiz.','O, Allah’tır, tektir.','O doğurmamış ve doğmamıştır.','O’nun hiçbir dengi yoktur.'], 'EBA', 10, 'Bu ifade Fatiha suresindedir.'),
      q('İhlas suresindeki “Doğurmamış ve doğmamıştır.” ifadesi neyi anlatır?', 'Allah’ın yaratılmışlara benzemediğini', ['Allah’ın yaratılmışlara benzemediğini','Allah’ın çok yorulduğunu','İnsanların Allah’ı yarattığını','Her insanın aynı olduğunu'], 'MEBI', 3, 'İhlas suresi Allah’ın eşsiz olduğunu anlatır.'),
      q('“O’nun hiçbir dengi yoktur.” sözü hangi düşünceyi vurgular?', 'Allah’ın benzerinin olmadığını', ['Allah’ın benzerinin olmadığını','Herkesin Allah’a eşit olduğunu','İnsanların hiç çalışmaması gerektiğini','Sadece gecenin önemli olduğunu'], 'EBA', 10, 'Denk, eş veya benzer demektir.'),
      q('İhlas suresinin ana mesajı hangisidir?', 'Allah’ın bir, tek ve eşsiz olması', ['Allah’ın bir, tek ve eşsiz olması','Sadece yağmurun nasıl yağdığı','Ders çalışmadan başarılı olmak','Bütün hayvanların aynı olması'], 'MEBI', 4, 'MEBİ’de suredeki asıl mesajı özetleme isteniyor.')
    ]
  ];

  const SOURCE_LESSONS = [
    [
      { source:'EBA', page:3, title:'Ölçü ve denge', body:'Kek tarifindeki ölçüler değişirse sonuç değişir. EBA belgesinde bu örnek; atmosferin canlı yaşamı için çok hassas bir denge içinde olmasıyla birlikte düşünülür. Çevremizdeki düzeni fark etmek, dikkatle gözlem yapmamıza yardım eder.' },
      { source:'EBA', page:4, title:'Canlılar ve su döngüsü', body:'Tohum, toprak, su, güneş ışığı ve arılar birbirini etkiler. Su buharlaşır, bulutlarda yoğunlaşır ve yağışla yeniden yeryüzüne döner. Bu örnekler canlılar ile cansız varlıkların bir düzen içinde ilişkili olduğunu gösterir.' },
      { source:'MEBI', page:1, title:'Doğadaki güzellik ve plan', body:'MEBİ belgesindeki öğrenciler gün batımını, sebze ve meyvelerin yetişmesini, kuşların uyumlu hareketlerini gözlemler. Bu örnekler doğadaki güzellik ve düzen üzerinde düşünmeye yardımcı olur.' }
    ],
    [
      { source:'EBA', page:6, title:'Uyum üzerinde düşünmek', body:'Saatin parçaları birlikte çalışır; vücudumuzdaki organlar da farklı görevlerle uyum içindedir. Bu tür örnekler, Allah’ın varlığı ve birliği hakkında düşünmeye yardımcı olur. Tevhit, Allah’ın bir ve tek olduğuna inanmak demektir.' },
      { source:'MEBI', page:2, title:'Çiçeğin büyümesinden öğrenmek', body:'Bir çiçeğin büyümesi için tohum, toprak, su, hava ve güneş ışığı gerekir. Bu aşamaları dikkatle gözlemlemek; doğadaki düzeni fark etmeye ve Allah’ın varlığı ile birliği üzerinde düşünmeye yardımcı olur.' }
    ],
    [
      { source:'EBA', page:7, title:'Güzel isimleri örnekle öğrenelim', body:'Kadir, Allah’ın her şeye güç yetirmesini anlatır. Rahman, Allah’ın bütün varlıklara merhametini anlatır. Yağmurun hem güçlü biçimde yağması hem de canlılara nimet ulaştırması bu iki ismi birlikte düşünmeye örnektir.' },
      { source:'MEBI', page:3, title:'Bilmek, işitmek ve görmek', body:'Âlim, Allah’ın her şeyi bilmesi; Semi, her şeyi işitmesi; Basir, her şeyi görmesi anlamında kullanılır. Bir ismi doğru anlamıyla eşleştirmek için soruda geçen ipucuna dikkat et: bilmek, işitmek ya da görmek.' }
    ],
    [
      { source:'EBA', page:10, title:'İhlas suresinin ayetleri', body:'İhlas suresi; Allah’ın tek olduğunu, Samed olduğunu, doğurmadığını ve doğmadığını, hiçbir denginin bulunmadığını bildirir. Ayetleri sırayla öğrenirken her ayetin kısa anlamını da düşün.' },
      { source:'MEBI', page:4, title:'Surenin ana mesajı', body:'İhlas suresi Allah’ın eşsiz olduğunu anlatır. Allah bir ve tektir; hiçbir şeye muhtaç değildir ve O’nun benzeri yoktur. Bu nedenle sure, Allah’ın varlığı ve birliği konusuyla da bağlantılıdır.' }
    ]
  ];

  function q(prompt, answer, options, source, page, hint) {
    return {
      c: COURSE, prompt, answer, options, hint,
      explain: `Doğru cevap: ${answer}. Bu bilgi ${SOURCES[source].label} belgesinin ${page}. sayfasındaki çalışma ile ilişkilidir.`,
      sourceRef: { source, page }, din511Source: true
    };
  }

  if (typeof RELIGION_DATA !== 'object' || !Array.isArray(RELIGION_DATA[COURSE])) return;
  const data = RELIGION_DATA[COURSE];

  // Her konu testinde kaynak belgelerden gelen 6 yeni soru vardır; kalan dört soru önceki testten korunur.
  data.slice(0, 4).forEach((item, topicIndex) => {
    if (item.__din511Applied) return;
    const existing = Array.isArray(item.questions) ? item.questions.map(question => ({ ...question })) : [];
    item.questions = QUESTION_BANK[topicIndex].concat(existing.slice(0, 4));
    item.__din511Applied = true;
  });

  window.openDin511Pdf = function (source, page) {
    const item = SOURCES[source];
    if (!item) return;
    window.open(`${item.file}#page=${safePage(page)}`, '_blank', 'noopener');
  };

  function sourceLinks(topicIndex) {
    const items = SOURCE_LESSONS[topicIndex] || [];
    const used = [...new Set(items.map(item => item.source))];
    return used.map(source => {
      const first = items.find(item => item.source === source);
      const item = SOURCES[source];
      return `<a href="${item.file}#page=${first.page}" target="_blank" rel="noopener noreferrer">📄 ${esc(item.label)} · s. ${first.page}</a>`;
    }).join('');
  }

  function decorateCourse() {
    if (typeof course !== 'string' || course !== COURSE || view !== 'course') return;
    const cards = [...document.querySelectorAll('#app .rel-item')];
    cards.slice(0, 4).forEach((card, topicIndex) => {
      if (card.querySelector('.din511-course-source')) return;
      const box = document.createElement('section');
      box.className = 'din511-course-source';
      box.innerHTML = `<b>📚 511 EBA + MEBİ ek kaynak çalışması</b><p>${esc(TOPICS[topicIndex])} için 2 kısa kaynak bölümü ve konu testine eklenmiş 6 soru.</p><div class="din511-links">${sourceLinks(topicIndex)}</div>`;
      const host = card.querySelector('.rel-actions') || card;
      host.insertAdjacentElement('beforebegin', box);
    });
  }

  function sourceLesson(topicIndex, sourceIndex) {
    const sections = SOURCE_LESSONS[topicIndex];
    const section = sections && sections[sourceIndex];
    const topicData = data[topicIndex];
    if (!section || !topicData) return window.openCourse(COURSE);
    if (typeof window.topicAccessibleV651 === 'function' && !window.topicAccessibleV651(COURSE, topicIndex)) {
      alert('Bu konu kilitli. Önce bir önceki konuyu tamamlamalısın.');
      return;
    }
    course = COURSE;
    topic = topicIndex;
    view = 'lesson';
    const source = SOURCES[section.source];
    const baseCount = topicData.__din511BaseStageCount || topicData.stages.length;
    app.innerHTML = `<div class="rel-block din511-lesson"><div class="rel-top"><button onclick="home()">⌂</button><div><strong>Din Kültürü</strong><div>${esc(topicData.title)}</div></div><b>⭐ ${state.points}</b></div><div class="rel-top"><h3>511 EBA + MEBİ kaynak çalışması</h3><span>Bölüm ${sourceIndex + 1}/${sections.length}</span></div><div class="fen-segments">${sections.map((_, index) => `<span class="${index <= sourceIndex ? 'on' : ''}"></span>`).join('')}</div><section class="din511-panel"><p class="din511-kicker">${esc(source.label)} · PDF s. ${section.page}</p><h2>${esc(section.title)}</h2><p>${esc(section.body)}</p><div class="din511-links"><a href="${source.file}#page=${section.page}" target="_blank" rel="noopener noreferrer">📄 PDF’de bu sayfayı aç</a></div></section><div class="rel-actions"><button onclick="${sourceIndex === 0 ? `lesson(${topicIndex},${baseCount - 1})` : `din511Lesson(${topicIndex},${sourceIndex - 1})`}">← Önceki</button><button class="primary" onclick="${sourceIndex + 1 < sections.length ? `din511Lesson(${topicIndex},${sourceIndex + 1})` : `startQuiz('${COURSE}',${topicIndex},'normal')`}">${sourceIndex + 1 < sections.length ? 'Sonraki kaynak bölümü →' : 'Konu testi →'}</button></div></div>`;
    try { rememberScreen({ type:'lesson', course:COURSE, topic:topicIndex, part:baseCount + sourceIndex }); } catch (_) {}
    window.scrollTo(0, 0);
  }

  window.din511Lesson = sourceLesson;
  const oldOpenCourse = window.openCourse;
  window.openCourse = openCourse = function (name) {
    const result = oldOpenCourse.apply(this, arguments);
    if (name === COURSE) decorateCourse();
    return result;
  };

  const oldLesson = window.lesson;
  window.lesson = lesson = function (topicIndex, part = 0) {
    if (course === COURSE && Number(topicIndex) >= 0 && Number(topicIndex) < 4) {
      const item = data[Number(topicIndex)];
      const baseCount = item.__din511BaseStageCount || (item.__din511BaseStageCount = item.stages.length);
      if (Number(part) >= baseCount) return sourceLesson(Number(topicIndex), Number(part) - baseCount);
    }
    const result = oldLesson.apply(this, arguments);
    if (course === COURSE && Number(topicIndex) >= 0 && Number(topicIndex) < 4 && view === 'lesson') {
      const item = data[Number(topicIndex)];
      const baseCount = item.__din511BaseStageCount || (item.__din511BaseStageCount = item.stages.length);
      if (Number(part) === baseCount - 1) {
        const actions = [...document.querySelectorAll('#app .rel-actions')].pop();
        const next = actions && actions.querySelector('button.primary');
        if (next) {
          next.textContent = '511 kaynak çalışması →';
          next.setAttribute('onclick', `lesson(${Number(topicIndex)},${baseCount})`);
        }
      }
    }
    return result;
  };

  const style = document.createElement('style');
  style.textContent = `.din511-course-source{margin:11px 0;padding:11px 12px;border:1px solid #61b6be77;border-radius:13px;background:#0d4c5a24}.din511-course-source p{margin:6px 0;font-size:14px}.din511-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}.din511-links a{color:#8ce6ee;text-decoration:underline;font-size:14px}.din511-lesson{padding-bottom:36px}.din511-panel{margin:15px 0;padding:18px;border-radius:18px;background:#144553;color:#f1fbfc;border:1px solid #76d5df}.din511-panel h2{margin-top:4px}.din511-panel p{font-size:18px;line-height:1.65}.din511-kicker{font-size:14px!important;opacity:.88}`;
  document.head.appendChild(style);

  // V6.51 GTT altyapısı bu fonksiyonu çağırarak yalnızca güncellemeden önce tamamlanmış konuların yeni sorularını sunar.
  window.__DURU_DIN_511_TEST__ = {
    version: '2026-11-02',
    sources: SOURCES,
    school(courseName, topicIndex) {
      if (courseName !== COURSE || !Number.isInteger(Number(topicIndex)) || Number(topicIndex) < 0 || Number(topicIndex) > 3) return [];
      return QUESTION_BANK[Number(topicIndex)].map((item, index) => ({ ...item, id:`DIN-511-${topicIndex}-${index}`, c:COURSE, t:Number(topicIndex), din511Source:true }));
    }
  };

  if (typeof view !== 'undefined' && view === 'course' && course === COURSE) decorateCourse();
})();
