import fs from 'node:fs';

const htmlPath = new URL('../dist/index.html', import.meta.url);
let html = fs.readFileSync(htmlPath, 'utf8');
const match = html.match(/const SCHOOL_MANIFEST=(\{.*?\});\s*let manifest=/s);
if (!match) throw new Error('Okul kaynak paketi bulunamadı');
const manifest = JSON.parse(match[1]);

// Source page numbers refer to the PDF file, not the printed page number.
const science = {
  0: [
    ['Fen EKÇ’deki çap tablosuna göre hangi gök cismi daha büyüktür?', 'Güneş', ['Dünya', 'Ay', 'İkisi eşittir'], 3],
    ['Fen EKÇ’deki tabloda Güneş’in gerçek çapı yaklaşık kaç kilometredir?', '1.392.700 km', ['12.742 km', '149.600 km', '10,9 km'], 3],
    ['Fen EKÇ’deki tabloda Dünya’nın gerçek çapı yaklaşık kaç kilometredir?', '12.742 km', ['1.392.700 km', '10,9 km', '1 mm'], 3],
    ['Fen EKÇ’deki ölçekte Güneş’in çapı yaklaşık ne kadardır?', '10,9 cm', ['1 mm', '10,9 mm', '1 cm'], 3],
    ['Fen EKÇ’deki ölçekte Dünya’nın çapı ne kadardır?', '1 mm', ['10,9 cm', '1 km', '12 cm'], 3],
    ['Fen EKÇ’de Güneş ile Dünya’yı aynı ölçekte çizerken hangisi daha büyük çizilir?', 'Güneş', ['Dünya', 'Ay', 'İkisi aynı büyüklükte'], 3],
    ['Güneş ve Dünya çaplarını karşılaştırınca hangi sonuç çıkar?', 'Güneş’in çapı Dünya’nınkinden çok büyüktür', ['Dünya’nın çapı daha büyüktür', 'Çapları eşittir', 'Çapları karşılaştırılamaz'], 4],
    ['Fen EKÇ’de astronomik birim (AU) yaklaşık hangi uzaklığı anlatır?', 'Dünya ile Güneş arasındaki uzaklığı', ['Dünya’nın çapını', 'Ay’ın çapını', 'Güneş’in sıcaklığını'], 4],
    ['Astronomik birim (AU) ne tür bir ölçü birimidir?', 'Uzunluk', ['Zaman', 'Sıcaklık', 'Kütle'], 4],
    ['Fen EKÇ’ye göre 1 AU yaklaşık kaç milyon kilometredir?', '149,6 milyon km', ['12,7 milyon km', '1,4 milyon km', '10,9 milyon km'], 4]
  ],
  1: [
    ['Fen EKÇ’ye göre Ay’daki kraterler nasıl oluşur?', 'Gök taşlarının Ay yüzeyine çarpmasıyla', ['Yağmurun toprağı aşındırmasıyla', 'Ağaç köklerinin büyümesiyle', 'Deniz dalgalarıyla'], 5],
    ['Fen EKÇ’de Ay yüzeyindeki çukurlara ne ad verilir?', 'Krater', ['Okyanus', 'Vadi', 'Kıta'], 5],
    ['Fen EKÇ’deki krater deneyinde unla kaplı yüzey neyi temsil eder?', 'Ay yüzeyini', ['Güneş’i', 'Dünya’nın çekirdeğini', 'Ay ışığını'], 5],
    ['Fen EKÇ’deki krater deneyinde misket neyi temsil eder?', 'Gök taşını', ['Güneş’i', 'Dünya’yı', 'Yıldızı'], 5],
    ['Krater derinliğine düşme yüksekliğinin etkisini araştırırken neyi değiştirirsin?', 'Misketin bırakıldığı yüksekliği', ['Misketin rengini', 'Kabın adını', 'Unun rengini'], 5],
    ['Krater derinliğine düşme yüksekliğinin etkisini araştırırken neyi ölçersin?', 'Oluşan çukurun derinliğini', ['Misketin rengini', 'Kabın adını', 'Saatin markasını'], 6],
    ['Krater derinliğine misketin kütlesinin etkisini araştırırken neyi değiştirirsin?', 'Misketin kütlesini', ['Bırakma yüksekliğini', 'Unun rengini', 'Kabın yerini'], 6],
    ['Misket kütlesinin etkisini anlamak için hangi koşul aynı kalmalıdır?', 'Bırakma yüksekliği', ['Misketin kütlesi', 'Çukurun derinliği', 'Çukurun genişliği'], 6],
    ['Aynı deneyde farklı kütlede misketler kullanmanın amacı nedir?', 'Kütlenin krater üzerindeki etkisini karşılaştırmak', ['Misketleri renge göre dizmek', 'Unu saymak', 'Kabı süslemek'], 6],
    ['Fen EKÇ’deki Ay evreleri modelinde köpük küre neyi temsil eder?', 'Ay’ı', ['Güneş’i', 'Dünya’yı', 'Bir krateri'], 8]
  ],
  2: [
    ['Fen EKÇ’deki Ay evreleri modelinde ışık kaynağı neyi temsil eder?', 'Güneş’i', ['Ay’ı', 'Dünya’yı', 'Krateri'], 8],
    ['Fen EKÇ’deki Ay evreleri modelinde elde tutulan küre neyi temsil eder?', 'Ay’ı', ['Dünya’yı', 'Güneş’i', 'Bir yıldızı'], 8],
    ['Fen EKÇ’ye göre Ay’ın Dünya’dan farklı biçimlerde görünmesine ne denir?', 'Ay’ın evreleri', ['Güneş lekeleri', 'Mevsimler', 'Gelgitler'], 8],
    ['Ay’ın evrelerinin oluşmasında hangi hareket etkilidir?', 'Ay’ın Dünya çevresinde dolanması', ['Güneş’in Dünya çevresinde dolanması', 'Dünya’nın durması', 'Ay’ın ışık üretmesi'], 8],
    ['Fen EKÇ’deki çalışma kâğıdına göre Ay tamamen aydınlık görünüyorsa evresi nedir?', 'Dolunay', ['Yeni ay', 'İlk dördün', 'Son dördün'], 9],
    ['Fen EKÇ’deki çalışma kâğıdına göre Ay hiç görünmüyorsa evresi nedir?', 'Yeni ay', ['Dolunay', 'İlk dördün', 'Son dördün'], 9],
    ['Fen EKÇ’deki çalışma kâğıdına göre Ay’ın sağ yarısı aydınlıksa evresi nedir?', 'İlk dördün', ['Son dördün', 'Yeni ay', 'Dolunay'], 9],
    ['Fen EKÇ’deki çalışma kâğıdına göre Ay’ın sol yarısı aydınlıksa evresi nedir?', 'Son dördün', ['İlk dördün', 'Yeni ay', 'Dolunay'], 9],
    ['Fen EKÇ’ye göre Ay’ın Dünya çevresinde dolanması yaklaşık kaç gün sürer?', '28 gün', ['1 gün', '7 gün', '365 gün'], 11],
    ['Yeni ay evresinden yaklaşık bir ay sonra Ay hangi evreye döner?', 'Yeni ay', ['Dolunay', 'İlk dördün', 'Son dördün'], 12]
  ],
  3: [
    ['Fen EKÇ’deki hareket şemasına göre Dünya neyin çevresinde dolanır?', 'Güneş’in', ['Ay’ın', 'Kendi gölgesinin', 'Bir kraterin'], 13],
    ['Dünya’nın Güneş çevresindeki bir dolanımı yaklaşık ne kadar sürer?', 'Bir yıl', ['Bir gün', 'Bir hafta', 'Bir ay'], 13],
    ['Dünya’nın kendi çevresinde dönmesi hangi olayı oluşturur?', 'Gece ve gündüzü', ['Ay’ın kraterlerini', 'Ay’ın çapını', 'Güneş’in çapını'], 13],
    ['Dünya’nın kendi çevresindeki bir dönüşü yaklaşık ne kadar sürer?', 'Bir gün', ['Bir yıl', 'Bir ay', 'Bir hafta'], 13],
    ['Fen EKÇ’deki şemaya göre Ay hangi gök cisminin çevresinde dolanır?', 'Dünya’nın', ['Yalnız Güneş’in', 'Mars’ın', 'Kendi kraterinin'], 13],
    ['Ay’ın kendi ekseni çevresindeki hareketine ne denir?', 'Dönme', ['Dolanma', 'Işıma', 'Büyüme'], 13],
    ['Ay’ın Dünya çevresindeki hareketine ne denir?', 'Dolanma', ['Dönme', 'Işıma', 'Büyüme'], 13],
    ['Dünya’nın Güneş çevresindeki hareketine ne denir?', 'Dolanma', ['Dönme', 'Titreşme', 'Yansıma'], 13],
    ['Fen EKÇ’deki şemaya göre Güneş kendi çevresinde hangi hareketi yapar?', 'Dönme', ['Dolanma', 'Öteleme', 'Durma'], 13],
    ['Dünya’dan Ay’ın hep aynı yüzünün görülmesi hangi iki sürenin yakınlığıyla ilgilidir?', 'Ay’ın dönme ve Dünya çevresinde dolanma süreleri', ['Dünya’nın dönme ve dolanma süreleri', 'Güneş ve Dünya’nın çapları', 'Gece ve gündüz süreleri'], 13]
  ]
};

for (const [topic, rows] of Object.entries(science)) {
  if (rows.length !== 10) throw new Error(`Fen ${topic}: 10 soru bulunmalı`);
  manifest.schoolQuestions[`Fen Bilimleri|${topic}`] = rows.map(([prompt, answer, wrong, page], index) => ({
    c: 'Fen Bilimleri', t: Number(topic), id: `SCHOOL-FEN-NEW-${topic}-${index}`,
    prompt, answer, options: [answer, ...wrong],
    hint: 'Kaynak sayfasındaki bilgiye veya deneyin amacına bak.',
    explain: `Doğru cevap: ${answer}.`,
    privateSource: {sourceId: 'science_eck', page, label: `Fen EKÇ · dosya s. ${page}`},
    newInV6513: true
  }));
}

const mathPages = {
  0: [4, 5], 1: [4, 5, 14, 15, 16, 19, 20, 21, 22, 23, 24],
  2: [17, 18], 3: [14, 15, 19, 20, 24, 25], 4: [26, 27], 5: [28, 29],
  6: [6, 7, 8, 9, 10, 11, 12, 13], 12: [62, 63, 64, 65, 72, 73],
  13: [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 104, 105, 106, 107, 108, 109],
  14: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117],
  15: [119, 120, 121, 122, 123, 124, 125, 126, 127, 128], 21: [145, 146, 147, 148]
};
for (const [topic, pages] of Object.entries(mathPages)) {
  const row = manifest.mappings[`Matematik|${topic}`]?.find(item => item.sourceId === 'math_eck');
  if (row) row.pages = pages;
}

// Both Turkish booklets have two unnumbered PDF pages before printed page 1.
if (!manifest.sourcePageOffsetV6513) {
  for (const rows of Object.values(manifest.mappings)) for (const row of rows) {
    if (row.sourceId !== 'turkish_eck_1' && row.sourceId !== 'turkish_eck_2') continue;
    row.pages = [...new Set(row.pages.map(page => Number(page) + 2))];
  }
  manifest.sourcePageOffsetV6513 = true;
}

// These existing Turkish topic questions are not proven to be from the EKÇ.
// Preserve the exercises and student history, but remove false page attribution.
for (let topic = 0; topic < 24; topic++) for (const q of manifest.schoolQuestions[`Türkçe|${topic}`] || []) {
  q.prompt = q.prompt.replace(/^Okul çalışma kitabındaki “[^”]+” ile eşleşen beceriyi düşün\.\s*/, '');
  q.privateSource = null;
  q.sourceStatus = 'topic-practice-only';
}

for (const rows of Object.values(manifest.schoolQuestions)) for (const q of rows) {
  if (q.privateSource?.sourceId !== 'math_eck') continue;
  const map = manifest.mappings[`Matematik|${q.t}`]?.find(item => item.sourceId === 'math_eck');
  if (!map) continue;
  const text = `${q.prompt} ${q.answer}`.toLocaleLowerCase('tr-TR');
  let page = map.pages[0];
  if (q.t === 1) page = /dik|paralel|kesiş|en kısa/.test(text) ? 14 : 4;
  if (q.t === 3) page = /tümler|bütünler/.test(text) ? 25 : /ters açı|kesiş/.test(text) ? 19 : 14;
  if (q.t === 5) page = /toplam|üçüncü açısı|üçüncü açı/.test(text) ? 29 : 28;
  if (q.t === 6) page = /yarıçap|pergel/.test(text) ? 11 : 9;
  if (q.t === 7) page = /basama|milyon \+|rakam/.test(text) ? 36 : 30;
  if (q.t === 8) page = /2 raf daha/.test(text) ? 54 : 50;
  if (q.t === 12) page = 62;
  if (q.t === 13) page = /yüzde|%/.test(text) ? 104 : /ondalık|0,/.test(text) ? 86 : 74;
  if (q.t === 14) page = /ondalık|0,/.test(text) ? 100 : 91;
  if (q.t === 14 && /%/.test(text)) page = 104;
  if (q.t === 15) page = /grafik|sütun/.test(text) ? 123 : 121;
  if (q.t === 18) page = 135;
  if (q.t === 20) page = 143;
  if (q.t === 21) page = 145;
  if (q.t === 22) page = 148;
  q.privateSource.page = page;
  q.privateSource.label = `Matematik EKÇ · ilgili konu, dosya s. ${page}`;
  q.prompt = q.prompt.replace(/^Okul çalışma kitabındaki “[^”]+” etkinliğini düşün\.\s*/, '');
  q.hint = 'İlgili EKÇ sayfasındaki örneği veya açıklamayı düşün.';
}

const probability = manifest.schoolQuestions['Matematik|21'][9];
probability.prompt = 'Adil bir madeni para atıldığında yazı gelme olasılığı, tura gelme olasılığına göre nasıldır?';
probability.answer = 'Eşittir';
probability.options = ['Eşittir', 'Daha büyüktür', 'Daha küçüktür', 'İmkânsızdır'];
probability.explain = 'Adil parada yazı ve tura eşit olasılıklıdır.';

const percent = manifest.schoolQuestions['Matematik|13'][9];
percent.answer = '%20';
percent.options = ['%22', '%20', '%19', '%21'];
percent.privateSource.page = 104;
percent.explain = '100 eş parçanın 20 tanesi boyalıysa boyalı bölüm %20 olur.';

const mathReplacements = {
  4: [
    [3, 'Bir çokgenin iki kenarının birleştiği noktaya ne denir?', 'Köşe', ['Kenar', 'Çap', 'Yarıçap'], 26],
    [4, 'Bir çokgeni çevreleyen doğru parçalarının her birine ne denir?', 'Kenar', ['Köşe', 'Merkez', 'Çap'], 26],
    [5, 'Aşağıdaki şekillerden hangisi çokgen değildir?', 'Çember', ['Üçgen', 'Dörtgen', 'Beşgen'], 26],
    [6, 'Çokgenin iç açısı hangi noktada oluşur?', 'İki kenarın birleştiği köşede', ['Kenarın ortasında', 'Şeklin dışında', 'Çemberin merkezinde'], 26],
    [7, 'Bir çokgeni adlandırırken hangi özelliğine bakılır?', 'Kenar sayısına', ['Rengine', 'Çizildiği kâğıda', 'Büyüklüğüne'], 26],
    [8, 'Kenarları eğri çizgilerden oluşan kapalı şekil çokgen midir?', 'Hayır', ['Evet', 'Yalnız kırmızıysa', 'Yalnız büyükse'], 26],
    [9, 'Altı kenarlı kapalı bir çokgenin kaç köşesi olur?', '6', ['3', '5', '7'], 26]
  ],
  8: [
    [5, 'Bir market 9 koli aldı. Her kolide 27 meyve suyu varsa toplam kaç meyve suyu vardır?', '243', ['216', '236', '252'], 50],
    [6, 'EKÇ’deki çarpma alıştırmasına göre 99 × 10 kaçtır?', '990', ['99', '909', '9.900'], 51],
    [7, 'EKÇ’deki bölme alıştırmasına göre 640 ÷ 10 kaçtır?', '64', ['6', '640', '6.400'], 52],
    [8, '130 kalem üçerli paketlenirse kaç tam paket hazırlanır?', '43', ['42', '44', '39'], 57],
    [9, 'Bir okulda 35 sınıfın her birinde 18 sıra var. Her sırada 2 öğrenci oturursa toplam kaç öğrenci olur?', '1.260', ['630', '1.160', '1.360'], 59]
  ],
  20: [
    [5, 'Bir işlem sırası 8’den başlayıp önce 3 çıkarıyor, sonra sonucu 4 ile çarpıyor. Sonuç kaçtır?', '20', ['5', '17', '32'], 143],
    [6, 'Bir işlem sırası 12’den başlayıp önce 3’e bölüyor, sonra 5 ekliyor. Sonuç kaçtır?', '9', ['4', '7', '12'], 143],
    [7, 'Bir işlem sırası 4’ten başlayıp önce 2 ile çarpıyor, sonra 1 çıkarıyor. Sonuç kaçtır?', '7', ['5', '8', '9'], 143],
    [8, 'Bir algoritmada adımların sırası değişirse sonuç için ne söylenebilir?', 'Sonuç değişebilir', ['Sonuç hep aynı kalır', 'Hiç işlem yapılamaz', 'Sayılar silinir'], 142],
    [9, 'Pelin 1’den 12’ye kadar olan doğal sayıları topluyor. Toplam kaçtır?', '78', ['66', '72', '84'], 143]
  ]
};
for (const [topic, rows] of Object.entries(mathReplacements)) for (const [index, prompt, answer, wrong, page] of rows) {
  manifest.schoolQuestions[`Matematik|${topic}`][index] = {
    c: 'Matematik', t: Number(topic), id: `SCHOOL-MATH-NEW-${topic}-${index}`,
    prompt, answer, options: [answer, ...wrong],
    hint: 'İlgili EKÇ sayfasındaki soruyu veya kavramı düşün.',
    explain: `Doğru cevap: ${answer}.`,
    privateSource: {sourceId: 'math_eck', page, label: `Matematik EKÇ · dosya s. ${page}`},
    newInV6513: true
  };
}

html = html.replace('🏫 Sorunun kaynak sayfası', '📚 İlgili kaynak sayfası');
const updated = html.replace(match[1], JSON.stringify(manifest));
fs.writeFileSync(htmlPath, updated, 'utf8');
console.log(`EKÇ paketi güncellendi: 230 matematik, 40 fen kaynak sorusu ve 240 Türkçe konu alıştırması`);
