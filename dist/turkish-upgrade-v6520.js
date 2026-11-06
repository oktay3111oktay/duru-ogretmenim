/* V6.52.0: Yeni Türkçe hiyerarşisi, sıralı okul testleri ve veri koruması. */
(() => {
  'use strict';

  if (typeof TURKISH_PAGES === 'object') {
    TURKISH_PAGES['2:104'] = 'assets/meb-turkish-v6520-b2-p-104.webp';
  }
  const DATA = window.DURU_TURKISH_V6520;
  if (!DATA || typeof state !== 'object' || typeof topics !== 'object') return;
  const COURSE = 'Türkçe';
  const clone = value => JSON.parse(JSON.stringify(value));
  const legacyTopics = clone(topics[COURSE] || []);
  const legacySchool = [];
  try {
    for (let t = 0; t < legacyTopics.length; t += 1) {
      const rows = window.__DURU_V649_TEST__?.school?.(COURSE, t) || [];
      rows.forEach(q => { if (['turkish_eck_1', 'turkish_eck_2'].includes(q?.privateSource?.sourceId)) legacySchool.push(clone(q)); });
    }
  } catch (error) { console.warn('Önceki Türkçe EKÇ soruları okunamadı.', error); }
  const uniqueQuestions = rows => {
    const seen = new Set();
    return rows.filter(q => {
      const id = String(q.id || `${q.prompt}|${q.answer}`).toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();
      if (!q?.prompt || !Array.isArray(q.options) || q.options.length !== 4 || !q.options.includes(q.answer) || seen.has(id)) return false;
      seen.add(id); return true;
    });
  };
  const makeOldQuestion = (prompt, answer, wrong, explain) => ({
    prompt, answer, options: [answer, ...wrong],
    hint: 'Metnin verdiği bilgi ve duygudan hareket et.', explain
  });
  const oldTopicQuestions = {
    turkish_eck_1: [
      makeOldQuestion('Metinde eski çocukluk ile bugünkü çocukluğun karşılaştırılmasının temel amacı nedir?', 'Çocukların yaşamındaki değişimi göstermek', ['Kent adlarını öğretmek', 'Servis araçlarını tanıtmak', 'Bir bayramı kutlamak'], 'Karşılaştırma, özgür oyun ve doğayla ilişkinin nasıl değiştiğini gösterir.'),
      makeOldQuestion('Eski çocukluğun ağaçlar ve sokak oyunlarıyla anlatılması metne hangi duyguyu katar?', 'Geçmişe özlem', ['Korku', 'Öfke', 'Şaşkınlık'], 'Yazar geçmişteki özgür ve doğal yaşamı özlemle anar.'),
      makeOldQuestion('“Özgürlüğün tuşlarda aranması” sözüyle en çok hangi durum eleştirilir?', 'Çocukların ekrana bağımlı kalması', ['Çocukların kitap okuması', 'Okula yürüyerek gitmesi', 'Bahçede oyun kurması'], 'Tuşlar ekranlı araçları, söz ise özgür deneyimin ekranla sınırlanmasını anlatır.'),
      makeOldQuestion('Servis penceresinden sarkmanın tehlikeli gösterilmesi hangi düşünceyi destekler?', 'Güvenlik kurallarına uymak gerekir', ['Her yolculuk iptal edilmelidir', 'Çocuklar hiç konuşmamalıdır', 'Okullar eve taşınmalıdır'], 'Metindeki uyarı, yolculuk sırasında güvenli davranmanın önemini gösterir.'),
      makeOldQuestion('Doğadan uzaklaşan kent çocuklarının en çok hangi deneyimi azalmıştır?', 'Açık havada özgürce oyun kurma', ['Ders kitabı okuma', 'Sınıfta yazı yazma', 'Takvim kullanma'], 'Metin, doğa ve sokakla kurulan özgür çocukluk ilişkisini öne çıkarır.'),
      makeOldQuestion('Metnin ana düşüncesine en uygun öneri hangisidir?', 'Çocuklara güvenli oyun ve doğa alanları sağlanmalı', ['Bütün parklar kapatılmalı', 'Her oyun yalnız ekranda oynanmalı', 'Çocuklar gün boyu serviste kalmalı'], 'Metnin eleştirisi, çocukların oyun ve doğayla yeniden buluşması gerektiğini düşündürür.'),
      makeOldQuestion('Yazarın geçmişten çok sayıda somut örnek vermesi ne sağlar?', 'Anlatılan çocukluğun gözümüzde canlanmasını', ['Metnin konusunun değişmesini', 'Bütün cümlelerin soru olmasını', 'Olayların belirsizleşmesini'], 'Meyve, ağaç ve sokak gibi ayrıntılar anlatımı somutlaştırır.'),
      makeOldQuestion('Metindeki “kaybedilen” sözcüğü hangi anlamı güçlendirir?', 'Değerli bir yaşantının giderek azalmasını', ['Bir eşyanın bulunmasını', 'Yarış kazanılmasını', 'Yeni bir servis alınmasını'], 'Sözcük, eski çocukluk olanaklarının yitirilmesini vurgular.'),
      makeOldQuestion('23 Nisan’ın anılması metinde hangi düşünceye bağlanır?', 'Çocukların gerçek ihtiyaçlarını yeniden düşünmeye', ['Yalnız süsleme yapmaya', 'Servis sayısını artırmaya', 'Bütün oyunları yasaklamaya'], 'Yazar, çocuk bayramını çocukların yaşam koşullarını düşünmek için bir fırsat sayar.'),
      makeOldQuestion('Bu metin için en uygun alternatif başlık hangisidir?', 'Sokaktan Ekrana Değişen Çocukluk', ['Bir Servisin Motoru', 'Takvimdeki Aylar', 'Sınıfın Pencereleri'], 'Başlık, metindeki geçmiş-bugün karşılaştırmasını yansıtır.')
    ],
    turkish_eck_2: [
      makeOldQuestion('Şiirin adım adım yönergeler vermesi metne hangi özellik kazandırır?', 'Bir yapım süreci anlatma', ['Haber verme', 'Tartışma yürütme', 'Resmî duyuru yapma'], 'Şiir, kuş resmini oluşturma işini sıralı adımlarla anlatır.'),
      makeOldQuestion('Kuşu beklerken sabırlı olunmasının istenmesi hangi değeri öne çıkarır?', 'Sabır', ['Kıskançlık', 'Öfke', 'Acelecilik'], 'Kuşun gelmesi uzun sürebileceği için ressamın sabırlı olması gerekir.'),
      makeOldQuestion('Kafes tellerinin sonradan silinmesi neyi düşündürür?', 'Kuşun özgür bırakılmasını', ['Resmin yarım kalmasını', 'Boyaların tükenmesini', 'Ağacın kesilmesini'], 'Tellerin kaldırılması, kuşu kapatmak yerine özgürlüğünü koruma düşüncesini taşır.'),
      makeOldQuestion('Kuşun ötmesi resmin başarısını nasıl gösterir?', 'Resmin canlı ve inandırıcı olduğunu düşündürür', ['Resmin siyah beyaz olduğunu gösterir', 'Kafesin kırıldığını kanıtlar', 'Ressamın uyuduğunu anlatır'], 'Şiirde kuşun ötmesi, yapılan resmin güzelliğinin simgesidir.'),
      makeOldQuestion('Şiirde doğa unsurlarının kullanılması hangi etkiyi oluşturur?', 'Resmi canlı ve hayal edilebilir kılar', ['Yönergeleri gizler', 'Konuyu matematiğe çevirir', 'Şiiri resmî yazı yapar'], 'Ağaç, dal ve kuş gibi unsurlar zihinde bir sahne kurar.'),
      makeOldQuestion('Şiirde eylemlerin belirli bir sırayla verilmesi neden önemlidir?', 'Resmin nasıl tamamlanacağını anlaşılır kılar', ['Sözcükleri alfabetik dizer', 'Bütün dizeleri eşit yapar', 'Kuşun adını değiştirir'], 'Sıralı yönergeler okura süreci izleme olanağı verir.'),
      makeOldQuestion('Ressamın kuşa zorla müdahale etmemesi hangi yaklaşımı gösterir?', 'Doğaya saygı', ['Kuralları önemsememe', 'Yarışı kazanma', 'Eşyaları saklama'], 'Beklemek ve kuşu özgür bırakmak, canlıya saygıyı gösterir.'),
      makeOldQuestion('Bu şiirde gerçek ile hayal nasıl birleşir?', 'Çizilen kuş canlıymış gibi davranır', ['Bütün sözcükler sayı olur', 'Ressam görünmez olur', 'Sayfa bir haritaya dönüşür'], 'Şair, yapılan resimdeki kuşu ötüp gelen canlı bir kuş gibi anlatır.'),
      makeOldQuestion('Şiirin ana duygusuna en uygun ifade hangisidir?', 'Sabırla ve sevgiyle güzel bir şey üretme', ['Hızlıca işi bırakma', 'Doğadan uzak durma', 'Kuşu kafeste tutma'], 'Şiir, üretmenin sabır, hayal ve sevgi istediğini sezdirir.'),
      makeOldQuestion('Şiir için en uygun alternatif başlık hangisidir?', 'Sabırla Çizilen Özgür Kuş', ['Kapalı Pencere', 'Hızlı Yarış', 'Boş Kafesin Kilidi'], 'Başlık; kuşu, sabrı ve özgürlük düşüncesini birlikte yansıtır.')
    ]
  };
  const oldTopic = (id, title, sourceId, label) => {
    const rows = uniqueQuestions(legacySchool.filter(q => q?.privateSource?.sourceId === sourceId));
    const pages = [...new Set(rows.map(q => Number(q.privateSource?.page)).filter(Number.isFinite))];
    const body = sourceId === 'turkish_eck_1'
      ? '“Kentlerde Kaybedilen Çocukluk” metni, geçmişte doğa ve sokak oyunlarıyla yaşanan çocukluğu günümüzde servis, kapalı alan ve ekran çevresinde daralan çocuklukla karşılaştırır. Metni okurken karşılaştırma, ana düşünce, yazarın eleştirisi ve metinden çıkarım yapma becerilerine odaklan.'
      : '“Bir Kuşun Resmini Yapmak” şiiri, bir kuş resmini sabırla oluşturma adımlarını anlatırken doğaya saygı, hayal gücü ve özgürlük düşüncesini birleştirir. Şiirdeki sıralı yönergeleri, imgeleri ve ana duyguyu birlikte değerlendir.';
    return {
      id, group: 'İELEV Kaynakları', title,
      pages: [{ title: label, body, visual: '📘', sourceLabel: label, sourcePage: pages[0] || 1, legacySourceId: sourceId, legacyPages: pages }],
      topicQuestions: (oldTopicQuestions[sourceId] || []).map((q, i) => ({ ...q, id: `T6520-OLD-T-${sourceId}-${i}` })),
      schoolQuestions: rows.map((q, i) => ({ ...q, id: q.id || `T6520-OLD-S-${sourceId}-${i}` }))
    };
  };
  const oldTopics = [
    oldTopic('ilelev-eski-ekc-1', 'Kentlerde Kaybedilen Çocukluk', 'turkish_eck_1', 'Türkçe Ek Çalışma Kitabı 1'),
    oldTopic('ilelev-eski-ekc-2', 'Bir Kuşun Resmini Yapmak', 'turkish_eck_2', 'Türkçe Ek Çalışma Kitabı 2')
  ].filter(x => x.schoolQuestions.length);
  const curriculum = [...DATA.schoolTopics, ...oldTopics, ...DATA.deepTopics, ...DATA.mebThemes];
  const indexById = new Map(curriculum.map((x, i) => [x.id, i]));
  topics[COURSE] = curriculum.map(x => [x.title, x.pages?.[0]?.body || '', x.group]);

  state.turkishV6520 = state.turkishV6520 && typeof state.turkishV6520 === 'object' ? state.turkishV6520 : {};
  const progress = state.turkishV6520;
  progress.completed = progress.completed && typeof progress.completed === 'object' ? progress.completed : {};
  progress.history = progress.history && typeof progress.history === 'object' ? progress.history : {};
  progress.started = progress.started && typeof progress.started === 'object' ? progress.started : {};
  progress.schoolDone = progress.schoolDone && typeof progress.schoolDone === 'object' ? progress.schoolDone : {};
  progress.schoolNext = progress.schoolNext && typeof progress.schoolNext === 'object' ? progress.schoolNext : {};
  progress.version = DATA.version;

  function item(index) { return curriculum[Number(index)] || null; }
  function topicId(index) { return item(index)?.id || `missing-${index}`; }
  function isDone(index) { return !!progress.completed[topicId(index)]; }
  function schoolParts(index) {
    const rows = uniqueQuestions((item(index)?.schoolQuestions || []).map(q => ({ ...clone(q), c: COURSE, t: Number(index) })));
    if (!rows.length) return [];
    const count = Math.max(1, Math.floor(rows.length / 10));
    if (count === 1) return [rows];
    const parts = [];
    for (let n = 0; n < count - 1; n += 1) parts.push(rows.slice(n * 10, n * 10 + 10));
    parts.push(rows.slice((count - 1) * 10));
    return parts;
  }
  function schoolComplete(index) {
    const parts = schoolParts(index), done = progress.schoolDone[topicId(index)] || {};
    return parts.every((_, n) => !!done[n]);
  }
  function schoolDoneCount(index) {
    const done = progress.schoolDone[topicId(index)] || {};
    return schoolParts(index).filter((_, n) => !!done[n]).length;
  }
  function fullyDone(index) { return isDone(index) && schoolComplete(index); }
  function accessible(index) {
    index = Number(index);
    if (!Number.isInteger(index) || !item(index)) return false;
    if (state.unlockAllV651 === true || isDone(index)) return true;
    return index === 0 || fullyDone(index - 1);
  }
  function markStarted(index) {
    const id = topicId(index);
    if (!progress.started[id]) { progress.started[id] = new Date().toISOString(); persist(); }
  }

  const doneBefore = window.done;
  window.done = done = function(c, i) { return c === COURSE ? isDone(i) : doneBefore(c, i); };
  const unlockedBefore = window.unlockedAfter;
  window.unlockedAfter = function(c, i) { return c === COURSE ? (state.unlockAllV651 === true || fullyDone(i)) : unlockedBefore(c, i); };
  const oldAccessible = window.topicAccessibleV651;
  window.topicAccessibleV651 = function(c, i) { return c === COURSE ? accessible(i) : oldAccessible(c, i); };

  const status = index => isDone(index) && !schoolComplete(index) ? '🏫 Okul Testi bekliyor' : fullyDone(index) ? '✅ Konu tamamlandı' : !accessible(index) ? '🔒 Kilitli' : progress.started[topicId(index)] ? '📚 Çalışılıyor' : '📖 Öğrenmeye hazır';
  const schoolLabel = index => {
    const parts = schoolParts(index); if (!parts.length) return '';
    const next = Number(progress.schoolNext[topicId(index)] || 0) % parts.length;
    return `🏫 Okul Testi (${parts.length})${schoolComplete(index) ? ` · Sıradaki ${next + 1}` : ` · ${next + 1}. test`}`;
  };
  function courseMarkup() {
    const completed = curriculum.filter((_, i) => fullyDone(i)).length;
    let group = '';
    const cards = curriculum.map((topic, index) => {
      const nextGroup = topic.group !== group ? `<h2 class="tr-group-v6520">${esc(topic.group)}</h2>` : '';
      group = topic.group;
      const locked = !accessible(index), normalDone = isDone(index), parts = schoolParts(index);
      return `${nextGroup}<section class="course-topic tr-topic-v6520 ${locked ? 'course-locked' : ''}" data-topic-id="${esc(topic.id)}"><div class="course-topic-head"><span class="course-number">${index + 1}</span><div><h2>${esc(topic.title)}</h2><small>${status(index)}</small></div></div><div class="course-actions"><button class="${locked ? '' : 'primary'}" ${locked ? 'disabled' : ''} onclick="lesson(${index},0)">${normalDone ? '↻ Tekrar çalış' : '📖 Konuyu öğren'}</button><button ${locked ? 'disabled' : ''} onclick="startQuiz('Türkçe',${index},'normal')">📝 Konu testi</button><button ${!normalDone ? 'disabled' : ''} onclick="startQuiz('Türkçe',${index},'extra')">✨ Ekstra test</button>${parts.length ? `<button ${!normalDone ? 'disabled' : ''} onclick="startTurkishSchoolV6520(${index})">${schoolLabel(index)}</button>` : ''}</div></section>`;
    }).join('');
    return `<div class="course-screen tr-course-v6520"><div class="course-top"><button class="home-red" onclick="home()" aria-label="Ana sayfa">⌂</button><div class="course-top-title"><b>📚 Türkçe</b><small>${completed}/${curriculum.length} konu tamamlandı</small></div><div class="lesson-top-right"><b>⭐ ${state.points}</b><button onclick="toggleTheme()" aria-label="Tema değiştir">☀️/🌙</button></div></div><div class="course-summary"><b>Kaynak sırası</b><span>İELEV Kaynakları → İELEV Derin Öğrenme → MEB Kaynakları</span></div>${pendingNotice()}<div class="course-list">${cards}</div></div>`;
  }

  function openSourcePage(url, label) {
    document.getElementById('tr-source-modal-v6520')?.remove();
    const modal = document.createElement('div'); modal.id = 'tr-source-modal-v6520'; modal.className = 'fen-modal turk-fen-modal';
    modal.innerHTML = `<div class="fen-modal-inner" role="dialog" aria-modal="true"><div class="fen-modal-bar"><strong>${esc(label || 'Kaynak sayfası')}</strong><button type="button">✕ Kapat</button></div><img class="fen-modal-page" src="${esc(url)}" alt="${esc(label || 'Kaynak sayfası')}"></div>`;
    modal.querySelector('button').onclick = () => modal.remove(); document.body.appendChild(modal);
  }
  window.openTurkishSourceV6520 = openSourcePage;
  function lessonMarkup(index, part) {
    const topic = item(index), pages = topic?.pages || [], entry = pages[part]; if (!entry) return '';
    let source = '', sourceVisual = '';
    if (entry.mebBook && entry.mebPage) {
      const image = typeof TURKISH_PAGES === 'object' ? TURKISH_PAGES[`${entry.mebBook}:${entry.mebPage}`] : '';
      source = `<button onclick="turkOpenPage(${entry.mebBook},${entry.mebPage})">📖 MEB ${entry.mebBook}. kitap · s. ${entry.mebPage}</button>`;
      if (image) sourceVisual = `<img class="fen-page" src="${esc(image)}" alt="Türkçe MEB ${entry.mebBook}. kitap sayfa ${entry.mebPage}" loading="lazy">`;
    }
    else if (entry.sourceUrl) source = `<button onclick='openTurkishSourceV6520(${JSON.stringify(entry.sourceUrl)},${JSON.stringify(entry.sourceLabel)})'>📄 ${esc(entry.sourceLabel)} · s. ${entry.sourcePage}</button>`;
    else if (entry.legacySourceId && entry.legacyPages?.length) source = `<div class="tr-source-links-v6520">${entry.legacyPages.map(p => `<button onclick="openPrivateSourceV649('${entry.legacySourceId}',${p})">📄 s. ${p}</button>`).join('')}</div>`;
    return `<div class="lesson-screen tr-lesson-v6520"><div class="lesson-top"><button class="home-red" onclick="openCourse('Türkçe')">←</button><div class="lesson-top-title"><b>${esc(topic.title)}</b><small>${esc(topic.group)} · Bölüm ${part + 1}/${pages.length}</small></div></div><section class="card tr-lesson-card-v6520"><div class="tr-lesson-visual-v6520">${esc(entry.visual || '📚')}</div><h1>${esc(entry.title)}</h1><p>${esc(entry.body)}</p>${sourceVisual}<div class="tr-source-box-v6520"><b>Doğrulanmış kaynak bağlantısı</b>${source || '<p>Bu sayfa için ayrı bir kaynak görseli gerekmiyor.</p>'}</div></section><div class="fen-bottom">${part ? `<button onclick="lesson(${index},${part - 1})">← Önceki</button>` : `<button onclick="openCourse('Türkçe')">← Konu listesi</button>`}<button class="primary" onclick="${part < pages.length - 1 ? `lesson(${index},${part + 1})` : `startQuiz('Türkçe',${index},'normal')`}">${part < pages.length - 1 ? 'Sonraki bölüm →' : 'Konu testine geç →'}</button></div></div>`;
  }

  const openBefore = window.openCourse;
  window.openCourse = openCourse = function(c) {
    if (c !== COURSE) return openBefore.apply(this, arguments);
    course = COURSE; view = 'course'; app.innerHTML = courseMarkup(); window.scrollTo(0, 0);
  };
  const lessonBefore = window.lesson;
  window.lesson = lesson = function(index, part = 0) {
    if (course !== COURSE) return lessonBefore.apply(this, arguments);
    index = Number(index); part = Number(part);
    if (!accessible(index)) return alert('Bu konu kilitli. Önce önceki konunun Konu Testini ve varsa bütün Okul Testlerini tamamlamalısın.');
    markStarted(index); topic = index; view = 'lesson'; app.innerHTML = lessonMarkup(index, part); window.scrollTo(0, 0);
  };
  function prepare(rows, index) { return uniqueQuestions(rows).map((q, n) => ({ ...clone(q), id: q.id || `TR6520-${topicId(index)}-${n}`, c: COURSE, t: index })); }
  const quizBefore = window.startQuiz;
  window.startQuiz = startQuiz = function(c, index, kind) {
    if (c !== COURSE) return quizBefore.apply(this, arguments);
    index = Number(index); if (!accessible(index)) return alert('Bu konu kilitli.');
    const topicData = item(index); let rows = prepare(topicData.topicQuestions || [], index);
    if (kind === 'extra') {
      if (!isDone(index)) return alert('Ekstra Test için önce Konu Testini tamamlamalısın.');
      const school = prepare(topicData.schoolQuestions || [], index);
      rows = [...school.slice(10, 20), ...rows].slice(0, 10);
    } else rows = rows.slice(0, 10);
    if (rows.length < 5) return alert('Bu test için en az 5 doğrulanmış soru bulunamadı.');
    course = COURSE; topic = index; markStarted(index); startSession(rows, kind, [`${COURSE}|${index}`]);
    if (session) { session._turkishV6520 = { topicId: topicId(index), index, kind }; persist(); }
  };
  window.startTurkishSchoolV6520 = function(index) {
    index = Number(index); if (!isDone(index)) return alert('Okul Testi için önce Konu Testini tamamlamalısın.');
    const parts = schoolParts(index); if (!parts.length) return alert('Bu konuda Okul Testi bulunmuyor.');
    const id = topicId(index), next = Number(progress.schoolNext[id] || 0) % parts.length, rows = prepare(parts[next], index);
    course = COURSE; topic = index; startSession(rows, 'school', [`${COURSE}|${index}`]);
    if (session) { session._turkishV6520 = { topicId: id, index, kind: 'school', schoolIndex: next, schoolCount: parts.length }; persist(); }
  };

  const questionBefore = window.question;
  window.question = question = function() {
    const result = questionBefore.apply(this, arguments), q = session?.phase === 'test' ? session?.qs?.[session.idx] : session?.pending?.[0];
    if (!q?.visualUrl || document.querySelector('.tr-question-source-v6520')) return result;
    const card = document.querySelector('#app .card'), heading = card?.querySelector('h2'); if (!card || !heading) return result;
    const box = document.createElement('div'); box.className = 'tr-question-source-v6520';
    box.innerHTML = `<b>📚 ${esc(q.sourceLabel || 'Kaynak sayfası')}</b><img src="${esc(q.visualUrl)}" alt="${esc(q.sourceLabel || 'Kaynak sorusu')}"><button type="button">Tam sayfayı net aç</button>`;
    box.querySelector('button').onclick = () => openSourcePage(q.visualUrl, q.sourceLabel); heading.after(box); return result;
  };

  const finishBefore = window.finishSession;
  window.finishSession = finishSession = function() {
    const s = session, meta = s?._turkishV6520, ready = !!meta && (!Array.isArray(s.pending) || s.pending.length === 0);
    if (!ready) return finishBefore.apply(this, arguments);
    const legacyKey = `${COURSE}|${meta.index}`;
    const oldDone = state.done[legacyKey], oldHistory = clone(state.history[legacyKey] || []);
    const oldSchool = clone(state.completedSchoolTestsV6519 || {});
    const result = finishBefore.apply(this, arguments);
    if (oldDone === undefined) delete state.done[legacyKey]; else state.done[legacyKey] = oldDone;
    if (oldHistory.length) state.history[legacyKey] = oldHistory; else delete state.history[legacyKey];
    state.completedSchoolTestsV6519 = oldSchool;
    const date = new Date().toISOString(), id = meta.topicId;
    if (meta.kind === 'normal') {
      progress.completed[id] = progress.completed[id] || date;
      progress.history[id] = progress.history[id] || [];
      progress.history[id].push({ date, score: Math.round((s.initial || 0) / Math.max(1, s.qs.length) * 100) });
    }
    if (meta.kind === 'school') {
      progress.schoolDone[id] = progress.schoolDone[id] || {};
      progress.schoolDone[id][meta.schoolIndex] = date;
      progress.schoolNext[id] = (Number(meta.schoolIndex) + 1) % Number(meta.schoolCount || 1);
    }
    persist(); return result;
  };

  window.__DURU_TURKISH_V6520_TEST__ = { curriculum, legacyTopics, oldTopics, item, indexById, isDone, schoolParts, schoolComplete, schoolDoneCount, fullyDone, accessible, courseMarkup, lessonMarkup, uniqueQuestions };
  if (view === 'course' && course === COURSE) openCourse(COURSE);
})();
