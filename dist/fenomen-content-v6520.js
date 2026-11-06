(() => {
  'use strict';

  const definitions = [
    {topic: 1, sourceId: 'fenomen_2', test: 7, title: 'Eş Uzunlukta Doğru Parçası Çizme', pages: [[1, 6], [2, 11]], answers: 'BADBCDBCDAB'},
    {topic: 1, sourceId: 'fenomen_2', test: 8, title: 'Temel Geometrik Kavramlar, Çemberler, Dikme ve Eş Doğru Parçaları', pages: [[3, 4], [4, 8]], answers: 'CDCDCACD'},
    {topic: 2, sourceId: 'fenomen_1', test: 10, title: 'Açı Ölçüsü ve Eş Açılar', pages: [[1, 6], [2, 12]], answers: 'DAACDCCDBDDC'},
    {topic: 2, sourceId: 'fenomen_1', test: 11, title: 'Açı Türleri', pages: [[3, 7], [4, 13]], answers: 'BCCDBDBDCABBD'},
    {topic: 3, sourceId: 'fenomen_3', test: 12, title: 'Düzlemde İki veya Üç Doğrunun Birbirine Göre Durumları', pages: [[1, 8], [2, 14]], answers: 'DCDDABCCDBDDDC'},
    {topic: 3, sourceId: 'fenomen_3', test: 13, title: 'Düzlemde İki veya Üç Doğrunun Birbirine Göre Durumları', pages: [[3, 4], [4, 8]], answers: 'DDCDDCDA'},
    {topic: 3, sourceId: 'fenomen_3', test: 14, title: 'Komşu ve Ters Açılar', pages: [[5, 6], [6, 12]], answers: 'DCDADDDBDCDD'}
  ];

  const pageForQuestion = (definition, questionNo) => {
    const row = definition.pages.find(([, lastQuestion]) => questionNo <= lastQuestion);
    return row ? row[0] : definition.pages.at(-1)[0];
  };

  const explanation = definition => {
    if (definition.test === 7) return 'Doğru seçenek, birim karelerde yatay ve düşey uzaklıklar karşılaştırılarak doğrulandı.';
    if (definition.test === 8) return 'Doğru seçenek; doğru, ışın, doğru parçası, çember ve diklik özellikleri birlikte kontrol edilerek doğrulandı.';
    if (definition.test === 10) return 'Doğru seçenek, açıölçer okuması ve eş açı ölçüleri karşılaştırılarak doğrulandı.';
    if (definition.test === 11) return 'Doğru seçenek; dar, dik, geniş, doğru ve tam açı tanımları kullanılarak doğrulandı.';
    if (definition.test === 14) return 'Doğru seçenek, komşu açıların ortak kolu ve ters açıların eş ölçülü olması kullanılarak doğrulandı.';
    return 'Doğru seçenek, doğruların kesişme, paralellik ve diklik durumları kaynak çizimi üzerinde kontrol edilerek doğrulandı.';
  };

  const questions = definitions.flatMap(definition => [...definition.answers].map((answer, index) => {
    const questionNo = index + 1;
    const page = pageForQuestion(definition, questionNo);
    const visualUrl = `assets/school-${definition.sourceId}-p-${page}.webp`;
    return {
      c: 'Matematik',
      t: definition.topic,
      id: `FENOMEN-${definition.test}-${questionNo}`,
      prompt: `Fenomen Test ${definition.test}, ${questionNo}. soruyu kaynak sayfasından çöz.`,
      answer,
      options: ['A', 'B', 'C', 'D'],
      hint: 'Sorunun metnini, şekillerini ve birim karelerini kaynak görselinden dikkatle incele.',
      explain: `${explanation(definition)} Doğru seçenek ${answer}.`,
      visualUrl,
      sourceLabel: `Fenomen Test ${definition.test} · Soru ${questionNo}`,
      sourceKind: 'source-verbatim-visual',
      privateSource: {
        sourceId: definition.sourceId,
        page,
        label: `Fenomen Test ${definition.test} · Soru ${questionNo} · dosya s. ${page}`
      }
    };
  }));

  const byTopic = new Map();
  questions.forEach(question => {
    const key = `${question.c}|${question.t}`;
    const rows = byTopic.get(key) || [];
    rows.push(question);
    byTopic.set(key, rows);
  });

  const clone = value => JSON.parse(JSON.stringify(value));
  window.__DURU_FENOMEN_V6520__ = {
    definitions: clone(definitions),
    questions: clone(questions),
    school(courseName, topicIndex) {
      return clone(byTopic.get(`${courseName}|${Number(topicIndex)}`) || []);
    }
  };
})();
