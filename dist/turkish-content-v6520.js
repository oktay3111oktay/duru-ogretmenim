/* V6.52.0: Türkçe okul materyalleri, Derin Öğrenme ve MEB tema içeriği. */
(() => {
  'use strict';
  const SOURCE = {
    punct: ['school-turkish-nokta-virgul-v6520', 11, 'Nokta-Virgül.pdf'],
    caps: ['school-turkish-buyuk-harf-v6520', 13, 'Büyük Harflerin Kullanımı.pdf'],
    idiom: ['school-turkish-deyim-atasozu-v6520', 9, 'Deyim-Atasözü.pdf'],
    emph: ['school-turkish-ikileme-pekistirme-v6520', 2, 'İkilemeler-Pekiştirmeler.pdf'],
    noun: ['school-turkish-isim-fiil-v6520', 5, 'İsim - Fiil Ayrımı.pdf'],
    deep: ['school-turkish-deep-v6520', 264, 'Türkçe Derin Öğrenme EÇK.pdf']
  };
  const sourceUrl = (slug, page) => `assets/${slug}-p-${page}.webp`;
  const page = (title, body, source, pageNo, visual = '📚') => ({
    title, body, visual, sourceLabel: source?.[2] || '', sourcePage: pageNo || 0,
    sourceUrl: source && pageNo ? sourceUrl(source[0], pageNo) : ''
  });
  const question = (prompt, answer, options, explain, extra = {}) => ({
    prompt, answer, options, hint: 'Soruyu dikkatle oku; önce kuralı veya metindeki kanıtı bul.', explain, ...extra
  });
  const four = (answer, distractors) => [answer, ...distractors.filter(x => x !== answer)].slice(0, 4);
  const conceptQuestions = (rows, prefix = '') => rows.slice(0, 10).map((row, index) => {
    const [term, meaning, ...wrong] = row;
    return question(`${prefix}${term} için doğru açıklama hangisidir?`, meaning, four(meaning, wrong), `${term}: ${meaning}`, { id: `T6520-C-${index}-${term}` });
  });
  const sourceMeta = (src, pageNo, label) => ({
    visualUrl: sourceUrl(src[0], pageNo),
    sourceLabel: `${src[2]} · s. ${pageNo}`,
    privateSource: { sourceId: src[0], page: pageNo, label: label || `${src[2]} · s. ${pageNo}` }
  });

  const schoolTopics = [
    {
      id: 'ilelev-nokta-virgul', group: 'İELEV Kaynakları', title: 'Nokta ve virgül', source: SOURCE.punct,
      pages: [
        page('Noktanın temel görevi', 'Nokta, tamamlanmış cümlenin sonuna konur. Ayrıca bazı kısaltmalarda, sıra sayılarında, tarihlerde ve saat yazımında kullanılır. Bir özel adın sonuna yalnızca özel ad olduğu için nokta konmaz.', SOURCE.punct, 2, '●'),
        page('Virgülle sıralama', 'Virgül, görevleri aynı olan sözcükleri ve art arda gelen cümleleri ayırır: “Elma, armut ve muz aldım.”', SOURCE.punct, 5, '，'),
        page('Hitap, ara söz ve açıklama', 'Hitaplardan sonra, evet-hayır gibi cevap sözlerinden sonra ve cümle içindeki ara sözleri ayırmak için virgül kullanılabilir.', SOURCE.punct, 7, '💬'),
        page('Kaynak hatasını fark edelim', 'Materyalin 10. sayfasındaki “Özel isimlerin sonuna nokta gelir.” ifadesi yanlıştır. Doğru kural şudur: Nokta, özel adlara değil; tamamlanmış cümlelerin sonuna gelir.', SOURCE.punct, 10, '🔎')
      ],
      concepts: [
        ['Tamamlanmış cümlenin sonu', 'nokta konur', 'virgül konur', 'iki nokta konur', 'hiçbir işaret konmaz'],
        ['Eş görevli sözcükler', 'virgülle ayrılır', 'noktayla ayrılır', 'bitişik yazılır', 'tırnağa alınır'],
        ['Sıra sayısı yazımı', '5. sınıf biçiminde nokta kullanılabilir', '5, sınıf yazılır', '5: sınıf yazılır', 'yalnız yazıyla yazılır'],
        ['Saat yazımı', '09.30 biçimi kullanılabilir', '09,30 yazılmalıdır', '09?30 yazılır', 'işaret kullanılmaz'],
        ['Hitap sözü', 'ardından virgül gelebilir', 'ardından kesme işareti gelir', 'küçük harfle başlamak zorundadır', 'cümleden atılır'],
        ['Ara söz', 'iki virgül arasında gösterilebilir', 'yalnız cümle sonunda olur', 'özel ad sayılır', 'bitişik yazılır'],
        ['Evet ve hayır', 'cümlenin başındaysa ardından virgül gelebilir', 'her zaman tırnağa alınır', 'sonuna kesme işareti gelir', 'büyük harfle yazılamaz'],
        ['Özel ad', 'yalnız özel ad olduğu için sonuna nokta almaz', 'her zaman nokta alır', 'her zaman virgül alır', 'küçük harfle başlar'],
        ['Tarih', 'gün, ay ve yılı ayırmada nokta kullanılabilir', 'yalnız virgülle yazılır', 'işaretsiz yazılmalıdır', 'tırnağa alınır'],
        ['Unvan kısaltması', 'Dr. gibi noktalı yazılabilir', 'Dr, yazılır', 'Dr? yazılır', 'daima açık yazılır']
      ],
      conceptPages: [4,5,4,5,6,7,7,10,5,4]
    },
    {
      id: 'ilelev-buyuk-harf', group: 'İELEV Kaynakları', title: 'Büyük harflerin kullanımı', source: SOURCE.caps,
      pages: [
        page('Cümle ve özel adlar', 'Cümleler büyük harfle başlar. Kişi, hayvanlara verilmiş özel ad, şehir, ülke ve belirli yer adları da büyük harfle başlar.', SOURCE.caps, 2, 'A'),
        page('Kurum, millet, dil ve bayram', 'Kurum ve kuruluş adlarının, millet ve dil adlarının, bayram ve özel gün adlarının her önemli sözcüğü büyük harfle başlar.', SOURCE.caps, 5, '🏫'),
        page('Tarih, eser ve unvan', 'Belirli bir tarihi bildiren gün ve ay adları büyük harfle; genel zaman bildirenler küçük harfle başlar. Kitap ve eser adlarında bağlaçlar çoğunlukla küçük yazılır. Unvanlar özel ada bağlıysa büyük harfle başlar.', SOURCE.caps, 8, '📅'),
        page('Gezegen, yön ve tarihî dönem', 'Gezegen ve yıldız adları özel ad olarak büyük harfle başlar. Yön sözcüğü özel bölge adı kuruyorsa büyük, yalnız yön bildiriyorsa küçük yazılır. Tarihî olay, çağ ve dönem adları büyük harfle başlar.', SOURCE.caps, 11, '🌍')
      ],
      concepts: [
        ['Cümle başlangıcı', 'büyük harfle başlar', 'küçük harfle başlar', 'rakamla başlar', 'tırnakla başlar'],
        ['Kişi adı', 'büyük harfle başlar', 'küçük harfle başlar', 'bitişik yazılır', 'noktayla biter'],
        ['Kurum adı', 'adı oluşturan önemli sözcükler büyük harfle başlar', 'tamamı küçük yazılır', 'yalnız son sözcük büyüktür', 'virgülle ayrılır'],
        ['Millet ve dil adı', 'büyük harfle başlar', 'küçük harfle başlar', 'rakamla yazılır', 'kesmeyle ayrılır'],
        ['Belirli tarih', 'gün ve ay adı büyük harfle başlayabilir', 'gün ve ay daima küçük yazılır', 'yalnız yıl büyük yazılır', 'işaret kullanılmaz'],
        ['Genel zaman bildiren ay', 'küçük harfle başlar', 'büyük harfle başlar', 'tamamı büyük yazılır', 'tırnağa alınır'],
        ['Eser adı', 'önemli sözcükler büyük harfle başlar', 'tamamı küçük yazılır', 'yalnız bağlaçlar büyüktür', 'sonuna virgül konur'],
        ['Gezegen adı', 'özel ad olduğunda büyük harfle başlar', 'her zaman küçük yazılır', 'rakamla yazılır', 'kesinlikle tırnağa alınır'],
        ['Yön adı', 'özel bölge adı kuruyorsa büyük olabilir', 'her durumda büyüktür', 'her durumda küçüktür', 'sonuna nokta gelir'],
        ['Tarihî dönem', 'büyük harfle başlar', 'küçük harfle başlar', 'yalnız rakamla yazılır', 'virgülle ayrılır']
      ],
      conceptPages: [2,2,4,5,7,7,8,10,11,12]
    },
    {
      id: 'ilelev-deyim-atasozu', group: 'İELEV Kaynakları', title: 'Deyimler ve atasözleri', source: SOURCE.idiom,
      pages: [
        page('Deyim nedir?', 'Deyim, çoğu zaman gerçek anlamından uzaklaşan, kalıplaşmış bir söz grubudur. Genellikle öğüt vermez; bir durumu etkili ve kısa anlatır.', SOURCE.idiom, 2, '💬'),
        page('Atasözü nedir?', 'Atasözü, uzun deneyimlerden doğan, topluma öğüt veya genel bir yargı veren kalıplaşmış sözdür. Kimin söylediği belli değildir.', SOURCE.idiom, 5, '🧠'),
        page('Nasıl ayırırız?', 'Bir söz genel kural, öğüt veya yaşam deneyimi bildiriyorsa atasözü; bir durumu ya da duyguyu kalıplaşmış biçimde anlatıyorsa deyim olma olasılığı yüksektir.', SOURCE.idiom, 8, '⚖️')
      ],
      concepts: [
        ['Deyim', 'bir durumu etkili anlatan kalıplaşmış söz grubudur', 'her zaman öğüt veren tam cümledir', 'yalnız gerçek anlamlıdır', 'sahibi bilinen şiirdir'],
        ['Atasözü', 'deneyim ve öğüt taşıyan kalıplaşmış sözdür', 'iki kelimelik her sözdür', 'yalnız mecazlı fiildir', 'özel addır'],
        ['“Etekleri zil çalmak”', 'çok sevinmek anlamındaki deyimdir', 'üzülmek anlamındaki atasözüdür', 'gerçek bir olaydır', 'kurum adıdır'],
        ['“Damlaya damlaya göl olur”', 'az birikimlerin çoğalacağını anlatan atasözüdür', 'yalnız yağmuru anlatan deyimdir', 'özel addır', 'soru cümlesidir'],
        ['Kalıplaşma', 'sözcüklerin istenildiği gibi değiştirilememesidir', 'her kelimenin ayrı yazılmasıdır', 'yalnız büyük harf kullanılmasıdır', 'sözün sahibinin bilinmesidir'],
        ['Öğüt ve genel yargı', 'atasözlerinde sık görülür', 'deyimlerde zorunludur', 'yalnız şiirde görülür', 'özel adlarda görülür'],
        ['Durum anlatımı', 'deyimlerin temel görevlerinden biridir', 'yalnız atasözlerinde olur', 'noktalama kuralıdır', 'fiilleri yok eder'],
        ['Söyleyeni bilinmeme', 'atasözlerinin ortak özelliklerindendir', 'her deyimin sahibini gösterir', 'özel ad kuralıdır', 'bağlaç özelliğidir'],
        ['“Gözden düşmek”', 'değerini yitirmek anlamındaki deyimdir', 'görme olayıdır', 'atasözüdür', 'kurum adıdır'],
        ['“İşleyen demir ışıldar”', 'çalışmanın yararını anlatan atasözüdür', 'yalnız demiri anlatan deyimdir', 'soru cümlesidir', 'hayvan adıdır']
      ],
      conceptPages: [2,5,4,5,3,6,4,5,4,6]
    },
    {
      id: 'ilelev-ikileme-pekistirme', group: 'İELEV Kaynakları', title: 'İkilemeler ve pekiştirmeler', source: SOURCE.emph,
      pages: [
        page('İkilemeler', 'Anlamı güçlendirmek için aynı, yakın, zıt veya sesçe benzer sözcükler yan yana kullanılabilir: yavaş yavaş, eş dost, irili ufaklı. İkilemeler ayrı yazılır; aralarına virgül veya kısa çizgi konmaz.', SOURCE.emph, 1, '2×'),
        page('Pekiştirmeler', 'Sıfatın ilk hecesine m, p, r veya s seslerinden uygun olanı getirilerek pekiştirme yapılabilir: yemyeşil, masmavi, sapsarı, tertemiz. Pekiştirme sözcükleri bitişik yazılır.', SOURCE.emph, 2, '✨')
      ],
      concepts: [
        ['İkilemelerin yazımı', 'ayrı yazılır', 'bitişik yazılır', 'kısa çizgiyle yazılır', 'virgülle yazılır'],
        ['Pekiştirme sözcükleri', 'bitişik yazılır', 'ayrı yazılır', 'iki noktayla yazılır', 'kesmeyle ayrılır'],
        ['“Yemyeşil”', 'pekiştirmedir', 'ikilemedir', 'atasözüdür', 'özel addır'],
        ['“Yavaş yavaş”', 'ikilemedir', 'pekiştirmedir', 'kurum adıdır', 'terimdir'],
        ['“İrili ufaklı”', 'zıt anlamlı sözcüklerle kurulmuş ikilemedir', 'pekiştirmedir', 'atasözüdür', 'özel addır'],
        ['“Eş dost”', 'yakın anlamlı sözcüklerle kurulmuş ikilemedir', 'pekiştirmedir', 'fiildir', 'sayıdır'],
        ['“Masmavi”', 'pekiştirmedir', 'ayrı yazılan ikilemedir', 'deyimdir', 'atasözüdür'],
        ['İkilemede virgül', 'kullanılmaz', 'zorunludur', 'yalnız sonda kullanılır', 'iki kez kullanılır'],
        ['“Kıkır kıkır”', 'ayrı yazılır', 'kısa çizgiyle yazılır', 'bitişik yazılır', 'kesmeyle ayrılır'],
        ['Pekiştirmenin amacı', 'anlamı güçlendirmektir', 'anlamı zayıflatmaktır', 'özel ad oluşturmaktır', 'cümleyi soru yapmaktır']
      ],
      conceptPages: [1,1,2,1,1,1,2,1,2,1]
    },
    {
      id: 'ilelev-isim-fiil', group: 'İELEV Kaynakları', title: 'İsim ve fiil ayrımı', source: SOURCE.noun,
      pages: [
        page('İsimler', 'Varlıkları, kavramları ve duyguları karşılayan sözcükler isimdir: masa, çocuk, sevgi. İsimlere “-mek/-mak” getirildiğinde anlamlı bir eylem oluşmaz.', SOURCE.noun, 2, '🏷️'),
        page('Fiiller', 'İş, oluş ve hareket bildiren sözcükler fiildir: koşmak, büyümek, uyumak. Fiilin kök ya da gövdesine “-mek/-mak” getirilebilir.', SOURCE.noun, 3, '🏃'),
        page('Bağlamı kontrol et', 'Aynı biçimdeki sözcük cümlede farklı görev alabilir. “Yüzme çok yararlı.” cümlesinde yüzme bir etkinliğin adı; “Her gün yüzme.” cümlesinde olumsuz emir anlamında fiildir. Sözcüğün cümledeki görevine bak.', SOURCE.noun, 4, '🔎')
      ],
      concepts: [
        ['İsim', 'varlık, kavram veya duygu adıdır', 'iş ve hareket bildirir', 'her zaman -mak alır', 'yalnız cümle sonunda bulunur'],
        ['Fiil', 'iş, oluş veya hareket bildirir', 'yalnız varlık adıdır', 'özel addır', 'noktalama işaretidir'],
        ['“-mek/-mak” denemesi', 'fiili bulmaya yardım eder', 'bütün isimleri fiile çevirir', 'özel adları ayırır', 'noktalama belirler'],
        ['“Koşmak”', 'fiildir', 'isimdir', 'zamirdir', 'bağlaçtır'],
        ['“Sevgi”', 'isimdir', 'fiildir', 'ünlemdir', 'bağlaçtır'],
        ['“Çocuklar bahçede koştu.”', 'koştu sözcüğü fiildir', 'bahçede sözcüğü fiildir', 'çocuklar sözcüğü fiildir', 'cümlede fiil yoktur'],
        ['“Koşu başladı.”', 'koşu sözcüğü isimdir', 'koşu sözcüğü çekimli fiildir', 'başladı isimdir', 'cümlede isim yoktur'],
        ['Bağlam', 'sözcüğün cümledeki görevini belirlemeye yardım eder', 'her sözcüğü özel ad yapar', 'sadece noktalama gösterir', 'sözcüğü kısaltır'],
        ['“Yüzme çok yararlıdır.”', 'yüzme etkinlik adıdır', 'yüzme olumsuz emirdir', 'yüzme bağlaçtır', 'yüzme özel addır'],
        ['“Havuzda yüzme!”', 'yüzme olumsuz emir bildiren fiildir', 'yüzme yalnız isimdir', 'yüzme sayı sıfatıdır', 'yüzme bağlaçtır']
      ],
      conceptPages: [2,2,3,2,2,2,3,3,4,4]
    }
  ];
  schoolTopics.forEach(topic => {
    topic.topicQuestions = conceptQuestions(topic.concepts);
    topic.schoolQuestions = conceptQuestions(topic.concepts, 'Kaynağa göre ')
      .map((q, i) => ({ ...q, id: `T6520-S-${topic.id}-${i}`, ...sourceMeta(topic.source, topic.conceptPages?.[i] || 1) }));
  });
  const punctuationSource = schoolTopics.find(topic => topic.id === 'ilelev-nokta-virgul');
  if (punctuationSource?.schoolQuestions?.[7]) {
    punctuationSource.schoolQuestions[7].prompt = 'PDF’nin 10. sayfasındaki “Özel isimlerin sonuna NOKTA gelir.” ifadesinin doğru düzeltmesi hangisidir?';
    punctuationSource.schoolQuestions[7].explain = 'Bu ifade kaynakta hatalıdır. Özel adın sonuna yalnız özel ad olduğu için nokta konmaz; nokta tamamlanmış cümlenin sonuna gelir.';
  }
  const appQ = (prompt, answer, ...items) => {
    const explain = items.pop();
    return question(prompt, answer, [answer, ...items.filter(item => item !== answer)].slice(0, 4), explain);
  };
  const applications = {
    'ilelev-nokta-virgul': [
      appQ('Hangi cümlenin sonuna nokta konmalıdır?','Bugün hava çok güzel','Bugün hava nasıl','Eyvah, geç kaldım','Kitap masada mı','Tamamlanmış haber cümlesi noktayla biter.'),
      appQ('Hangi cümlede virgül doğru kullanılmıştır?','Çantama kitap, defter ve kalem koydum.','Çantama, kitap defter ve kalem koydum.','Çantama kitap defter ve, kalem koydum.','Çantama kitap defter ve kalem, koydum.','Eş görevli sözcükler virgülle ayrılır.'),
      appQ('“Duru___ buraya gelir misin?” boşluğuna ne gelmelidir?',',','.', '?','!',',','Hitap sözünden sonra virgül gelir.'),
      appQ('Hangi yazım doğrudur?','Yarışmada 2. oldum.','Yarışmada 2, oldum.','Yarışmada 2: oldum.','Yarışmada 2? oldum.','Sıra sayısı rakamla yazılırken nokta kullanılabilir.'),
      appQ('Hangi saat yazımı materyaldeki kurala uygundur?','09.30','09,30','09?30','09!30','Saat ve dakika arasında nokta kullanılabilir.'),
      appQ('Hangi tarih yazımı noktayla doğrudur?','23.04.1920','23,04,1920','23?04?1920','23!04!1920','Gün, ay ve yıl noktayla ayrılabilir.'),
      appQ('“Evet___ ben de geliyorum.” boşluğuna ne gelmelidir?',',','.',':',';',',','Cümlenin başındaki kabul sözünden sonra virgül gelir.'),
      appQ('Hangi cümlede ara söz doğru ayrılmıştır?','Ali, sınıf başkanımız, konuştu.','Ali sınıf, başkanımız konuştu.','Ali sınıf başkanımız konuştu,.','Ali. sınıf başkanımız. konuştu.','Ara söz iki virgül arasında gösterilebilir.'),
      appQ('Hangi cümlede nokta kullanılmamalıdır?','Duru','Ders bitti.','Saat 09.30 oldu.','5. sınıfa gidiyorum.','Bir özel ad, yalnız özel ad olduğu için nokta almaz.'),
      appQ('“Yarın geleceğim___ dedi.” boşluğuna ne gelmelidir?',',','.', '?','!',',','Tırnak içinde olmayan aktarma sözünden sonra virgül gelebilir.')
    ],
    'ilelev-buyuk-harf': [
      appQ('Hangi cümle doğru büyük harfle başlamıştır?','Bugün parka gittik.','bugün parka gittik.','BUGÜN parka gittik.','buGün parka gittik.','Cümle büyük harfle başlar.'),
      appQ('Hangi kişi adı doğru yazılmıştır?','Mustafa Kemal Atatürk','mustafa Kemal Atatürk','Mustafa kemal atatürk','mustafa kemal atatürk','Kişi adları büyük harfle başlar.'),
      appQ('Hangi kurum adı doğru yazılmıştır?','Türk Dil Kurumu','Türk dil kurumu','türk Dil Kurumu','Türk dil Kurumu','Kurum adlarındaki önemli sözcükler büyük harfle başlar.'),
      appQ('Hangi dil adı doğru yazılmıştır?','Türkçe','türkçe','TÜrkçe','tÜRKÇE','Dil adları büyük harfle başlar.'),
      appQ('Belirli bir tarihi bildiren doğru yazım hangisidir?','29 Ekim 1923','29 ekim 1923','29 EKİM 1923','29 eKim 1923','Belirli tarih bildiren ay adı büyük harfle başlar.'),
      appQ('Genel zaman bildiren doğru kullanım hangisidir?','Her yaz temmuz ayında yüzeriz.','Her yaz Temmuz ayında yüzeriz.','Her Yaz temmuz ayında yüzeriz.','Her yaz TEMMUZ ayında yüzeriz.','Belirli tarih bildirmeyen ay adı küçük yazılır.'),
      appQ('Hangi gezegen adı doğru yazılmıştır?','Mars','mars','mArs','MARS gezegeni her durumda böyle yazılır','Gezegen adı özel addır.'),
      appQ('Yalnız yön bildiren doğru kullanım hangisidir?','Kuzeye doğru yürüdük.','kuzeye doğru yürüdük.','KUZEYE doğru yürüdük.','KuzeyE doğru yürüdük.','Cümle başındaki yön sözcüğü büyük harfle başlar; özel bölge adı değilse sonraki kullanım küçük olur.'),
      appQ('Hangi bayram adı doğru yazılmıştır?','Cumhuriyet Bayramı','Cumhuriyet bayramı','cumhuriyet Bayramı','cumhuriyet bayramı','Bayram adları büyük harfle başlar.'),
      appQ('Hangi tarihî dönem adı doğru yazılmıştır?','Kurtuluş Savaşı','Kurtuluş savaşı','kurtuluş Savaşı','kurtuluş savaşı','Tarihî olay ve dönem adları büyük harfle başlar.')
    ],
    'ilelev-deyim-atasozu': [
      appQ('“Etekleri zil çalmak” ne anlatır?','Çok sevinmeyi','Çok üzülmeyi','Gerçekten zil takmayı','Uyumayı','Bu söz çok sevinmek anlamındaki bir deyimdir.'),
      appQ('“Ayağını yorganına göre uzat.” ne öğütler?','Harcamayı imkâna göre yapmayı','Daha uzun uyumayı','Yorgan satın almayı','Hızlı koşmayı','Atasözü, imkânlara göre davranmayı öğütler.'),
      appQ('Hangisi atasözüdür?','Ne ekersen onu biçersin.','Gözden düşmek','Burnundan solumak','Etekleri zil çalmak','Genel bir yargı ve öğüt veren söz atasözüdür.'),
      appQ('Hangisi deyimdir?','Gözden düşmek','Damlaya damlaya göl olur.','İşleyen demir ışıldar.','Sakla samanı, gelir zamanı.','Gözden düşmek değerini yitirmek anlamındaki deyimdir.'),
      appQ('Bir söz topluma öğüt veriyorsa hangi türe daha yakındır?','Atasözüne','Deyime','İkilemeye','Özel ada','Atasözleri genel yargı ve öğüt taşıyabilir.'),
      appQ('Bir söz bir duyguyu kalıplaşmış biçimde anlatıyorsa hangi türe daha yakındır?','Deyime','Atasözüne','Terime','Kısaltmaya','Deyimler bir durumu veya duyguyu etkili anlatır.'),
      appQ('“Burnundan solumak” hangi durumu anlatır?','Çok öfkeli olmayı','Rahat uyumayı','Koşmayı','Hapşırmayı','Deyim çok öfkeli olmayı anlatır.'),
      appQ('“Damlaya damlaya göl olur.” sözünün ana düşüncesi nedir?','Küçük birikimler zamanla büyür.','Her gün yağmur yağar.','Göller yalnız damladan oluşur.','Su içilmemelidir.','Atasözü küçük birikimlerin önemini anlatır.'),
      appQ('Deyimlerde sözcükler neden gelişigüzel değiştirilemez?','Kalıplaşmış oldukları için','Özel ad oldukları için','Rakamla yazıldıkları için','Soru oldukları için','Deyimler kalıplaşmış sözlerdir.'),
      appQ('Atasözlerinin söyleyeni genellikle neden bilinmez?','Toplumun ortak deneyiminden doğdukları için','Hepsi yeni yazıldığı için','Yalnız çocuklar söylediği için','Hiç anlam taşımadıkları için','Atasözleri toplumun ortak birikimidir.')
    ],
    'ilelev-ikileme-pekistirme': [
      appQ('Hangi söz ikilemedir?','yavaş yavaş','yemyeşil','masmavi','tertemiz','Aynı sözcüğün tekrarıyla ikileme kurulmuştur.'),
      appQ('Hangi söz pekiştirmedir?','sapsarı','gece gündüz','eş dost','irili ufaklı','Sapsarı bitişik yazılan bir pekiştirmedir.'),
      appQ('İkilemenin doğru yazıldığı seçenek hangisidir?','kıkır kıkır','kıkır-kıkır','kıkır,kıkır','kıkırkıkır','İkilemeler ayrı yazılır; araya işaret konmaz.'),
      appQ('“Bembeyaz” sözcüğü cümleye ne katar?','Beyazlığın çok güçlü olduğunu','Beyazlığın az olduğunu','Soru anlamını','Olumsuzluk anlamını','Pekiştirme anlamı güçlendirir.'),
      appQ('Hangi ikileme zıt anlamlı sözcüklerle kurulmuştur?','irili ufaklı','yavaş yavaş','eş dost','cıvıl cıvıl','İri ve ufak zıt anlamlıdır.'),
      appQ('Hangi ikileme yakın anlamlı sözcüklerle kurulmuştur?','eş dost','ileri geri','yavaş yavaş','sapsarı','Eş ve dost yakın anlamlıdır.'),
      appQ('“Tertemiz oda” sözünde pekiştirilen sözcük hangisidir?','temiz','oda','ter','temiz oda','Temiz sıfatı ter- hecesiyle pekiştirilmiştir.'),
      appQ('İkilemelerin arasına hangisi konmaz?','Virgül','Boşluk','İkinci sözcük','Anlam ilişkisi','İkilemenin sözcükleri arasına virgül konmaz.'),
      appQ('Hangi cümlede ikileme vardır?','Çocuk koşa koşa geldi.','Bahçe yemyeşildi.','Gömlek bembeyazdı.','Masa tertemizdi.','Koşa koşa bir ikilemedir.'),
      appQ('Hangi cümlede pekiştirme vardır?','Gökyüzü masmaviydi.','Yavaş yavaş yürüdü.','Eş dost toplandı.','Gece gündüz çalıştı.','Masmavi bir pekiştirme sözcüğüdür.')
    ],
    'ilelev-isim-fiil': [
      appQ('“Çocuk güldü.” cümlesinde fiil hangisidir?','güldü','çocuk','cümlesinde','hangisidir','Gülmek bir hareket bildirir.'),
      appQ('“Sevgi insanı güçlendirir.” cümlesinde “sevgi” nedir?','İsim','Fiil','Bağlaç','Ünlem','Sevgi bir duygu adıdır.'),
      appQ('Hangi sözcüğe “-mek/-mak” getirildiğinde anlamlı bir fiil olur?','koş','masa','kalem','sevgi','Koşmak anlamlı bir fiildir.'),
      appQ('Hangi sözcük varlık adıdır?','kitap','okudu','koştu','büyüdü','Kitap bir varlığın adıdır.'),
      appQ('Hangi sözcük oluş bildirir?','büyüdü','masa','sevgi','çocuk','Büyümek bir oluş fiilidir.'),
      appQ('“Koşu yarın başlayacak.” cümlesinde “koşu” nedir?','İsim','Fiil','Ünlem','Bağlaç','Koşu bir etkinliğin adıdır.'),
      appQ('“Her gün koş.” cümlesinde “koş” nedir?','Fiil','İsim','Sıfat','Zamir','Koş sözcüğü hareket bildiren emir fiilidir.'),
      appQ('“Yüzme sağlığa yararlıdır.” cümlesinde “yüzme” nedir?','Etkinlik adı olan isim','Olumsuz emir fiili','Bağlaç','Özel ad','Yüzme burada bir etkinliği adlandırır.'),
      appQ('“Derin suda yüzme!” cümlesinde “yüzme” nedir?','Olumsuz emir bildiren fiil','Etkinlik adı olan isim','Sıfat','Zamir','Cümlede yapmama emri bildirir.'),
      appQ('İsim-fiil ayrımında en güvenilir yol hangisidir?','Sözcüğün cümledeki anlam ve görevine bakmak','Yalnız harf saymak','Her sözcüğe isim demek','Yalnız ilk harfe bakmak','Bağlam, sözcüğün görevini belirler.')
    ]
  };
  schoolTopics.forEach(topic => { if (applications[topic.id]) topic.topicQuestions = applications[topic.id].map((q,i)=>({...q,id:`T6520-A-${topic.id}-${i}`})); });
  const emph = schoolTopics.find(topic => topic.id === 'ilelev-ikileme-pekistirme');
  if (emph) emph.schoolQuestions.splice(0, 3,
    {...question('Aşağıdaki cümlelerin hangisinde PEKİŞTİRMELİ BİR SÖZCÜK kullanılmıştır?','Yemyeşil tarlalarda yürüyüş yaptık.',['Gece gündüz demeden çalıştı.','Yemyeşil tarlalarda yürüyüş yaptık.','Ağır ağır çıkacaksın bu merdivenlerden.','Yalan yanlış laflarla kafamı karıştırma.'],'“Yemyeşil” pekiştirmeli sözcüktür.'),id:'T6520-EXACT-EMPH-1',...sourceMeta(SOURCE.emph,2)},
    {...question('Aşağıdaki cümlelerin hangisinde yazım hatası yapılmıştır?','Çocuklar bahçede kıkır-kıkır gülüşüyordu.',['Masmavi gökyüzünü izlemek huzur veriyordu.','Çocuklar bahçede kıkır-kıkır gülüşüyordu.','Yemyeşil ağaçların arasından geçtik.','Kapıyı güç bela açmayı başardık.'],'İkilemeler ayrı yazılır; “kıkır kıkır” olmalıdır.'),id:'T6520-EXACT-EMPH-2',...sourceMeta(SOURCE.emph,2)},
    {...question('İkilemeler ve pekiştirmeli sözcüklerle ilgili bilgilerden hangisi YANLIŞTIR?','İkilemelerin arasına virgül konulabilir.',['İkilemeler her zaman ayrı yazılır.','Pekiştirmeli sözcükler bitişik yazılır.','İkilemelerin arasına virgül konulabilir.','Her ikisi de cümlede anlamı güçlendirme işlevi görür.'],'İkilemelerin arasına virgül konmaz.'),id:'T6520-EXACT-EMPH-3',...sourceMeta(SOURCE.emph,2)}
  );

  const deepSections = [
    ['deep-sozcukte-anlam', 'Sözcükte Anlam', [1, 2, 3], [[8, 13], [14, 38]]],
    ['deep-cumlede-anlam', 'Cümlede Anlam', [4, 5, 6, 7, 8], [[39, 44], [45, 77]]],
    ['deep-paragrafta-anlam', 'Paragrafta Anlam', [9, 10, 11, 12, 13], [[78, 84], [85, 116]]],
    ['deep-sozel-mantik', 'Sözel Mantık', [14], [[117, 122], [123, 129]]],
    ['deep-metin-turleri', 'Metin Türleri', [15, 16], [[130, 138], [139, 151]]],
    ['deep-sozcuk-turleri', 'Sözcük Türleri', [17, 18, 19], [[152, 160], [161, 179]]],
    ['deep-yazim-kurallari', 'Yazım Kuralları', [20], [[180, 185], [186, 192]]],
    ['deep-noktalama', 'Noktalama İşaretleri', [21, 22], [[193, 198], [199, 210]]],
    ['deep-medya-gorsel', 'Medya Okuryazarlığı ve Görsel Okuma', [23, 24], [[211, 218], [219, 234]]]
  ];
  const deepConcepts = {
    'Sözcükte Anlam': [['Bağlam', 'sözcüğün cümlede kazandığı anlamı gösterir'], ['Gerçek anlam', 'sözcüğün temel anlamıdır'], ['Mecaz anlam', 'temel anlamdan uzaklaşan kullanımdır'], ['Terim anlam', 'bir alana özgü anlamdır']],
    'Cümlede Anlam': [['Neden-sonuç', 'bir olayın sebebi ve sonucu birlikte verilir'], ['Amaç-sonuç', 'yapılmak istenen hedefi bildirir'], ['Koşul', 'sonucun gerçekleşmesini bir şarta bağlar'], ['Öznel yargı', 'kişiden kişiye değişebilir']],
    'Paragrafta Anlam': [['Konu', 'paragrafın ne hakkında olduğunu gösterir'], ['Ana düşünce', 'yazarın vermek istediği temel mesajdır'], ['Yardımcı düşünce', 'ana düşünceyi destekleyen ayrıntıdır'], ['Başlık', 'metnin konusu ve ana düşüncesiyle uyumlu olmalıdır']],
    'Sözel Mantık': [['Tablo kurma', 'verilenleri düzenli karşılaştırmayı sağlar'], ['Kesin bilgi', 'bütün olasılıklarda değişmeyen bilgidir'], ['Eleme', 'kurala uymayan seçenekleri kaldırmaktır'], ['Sıralama', 'önce-sonra ilişkisini gösterir']],
    'Metin Türleri': [['Öyküleyici metin', 'kişi, yer, zaman ve olay içerir'], ['Bilgilendirici metin', 'bir konuda bilgi vermeyi amaçlar'], ['Şiir', 'dize ve kıtalardan oluşabilir'], ['Haber', 'güncel bir olayı açık ve doğrulanabilir biçimde aktarır']],
    'Sözcük Türleri': [['İsim', 'varlık ve kavramları karşılar'], ['Fiil', 'iş, oluş ve hareket bildirir'], ['Sıfat', 'ismi niteler veya belirtir'], ['Zamir', 'ismin yerini tutar']],
    'Yazım Kuralları': [['Özel ad', 'büyük harfle başlar'], ['Bağlaç olan de', 'ayrı yazılır'], ['Ek olan -de', 'sözcüğe bitişik yazılır'], ['Soru eki mi', 'önceki sözcükten ayrı yazılır']],
    'Noktalama İşaretleri': [['Nokta', 'tamamlanmış cümlenin sonuna gelir'], ['Virgül', 'eş görevli ögeleri ayırabilir'], ['Soru işareti', 'soru bildiren cümlenin sonuna gelir'], ['İki nokta', 'açıklama veya örnekten önce gelebilir']],
    'Medya Okuryazarlığı ve Görsel Okuma': [['Kaynak', 'bilginin kimden ve nereden geldiğini gösterir'], ['Güvenilirlik', 'kanıt ve kaynakla kontrol edilir'], ['Grafik', 'veriyi görsel olarak karşılaştırır'], ['Reklam', 'ikna etmeyi amaçlayan mesajlar içerebilir']]
  };
  const deepTests = {
    1:[14,'ABBCBDDDABBCDCBACB'],2:[23,'BDACBBAAADCB'],3:[34,'BDDCAADDABCC'],
    4:[45,'ACDBDDBDADCA'],5:[52,'DABDCBCABADD'],6:[60,'ABCDCBDABCBA'],7:[67,'BCADBBACDCAB'],8:[73,'BCBDD BACACDD'.replaceAll(' ','')],
    9:[85,'CABAABAD'],10:[92,'BBADDBAD'],11:[99,'CDDCDCAB'],12:[105,'CACACDBAB CDB'.replaceAll(' ', '')],13:[112,'DBADCCAB'],
    14:[123,'CDCADCACB'],15:[139,'DBCBD BABADB'.replaceAll(' ', '')],16:[147,'ACCCACBACBAA'],
    17:[161,'DCABABBCACAD'],18:[168,'BADCA CCBDB'.replaceAll(' ', '')],19:[175,'CACBBABCCDAD'],20:[186,'CDADBADBCABC'],
    21:[199,'CACBDDCA CADB'.replaceAll(' ', '')],22:[206,'DCBCABDBCCBC'],23:[219,'ABABDCDCADBD'],24:[228,'DBCDACDCA']
  };
  const deepFinals = [
    [238, '1. Ara Tatil', 'CDAAACDBBDCCDACBDACD'],
    [244, 'Yarıyıl', 'AACCCDBCDDBAABBCAADD'],
    [250, '2. Ara Tatil', 'AABDDADCBBCCBCADABBC'],
    [256, 'Yıl Sonu', 'BDBCADCDACACBCADBDCD']
  ];
  const deepSupplement = [
    [0,'BTT 1',17,'DDABCDC'],[0,'ÜDT 1',19,'CB'],[0,'BTT 2',25,'BCBAAAB'],[0,'ÜDT 2',27,'CCDBB'],[0,'BTT 3',36,'DA'],[0,'ÜDT 3',37,'AC'],[0,'BDS 1',38,'CBDADBBCCDDDBCB'],
    [1,'BTT 4',47,'CAAD'],[1,'ÜDT 4',48,'BC'],[1,'BTT 5',54,'BADA'],[1,'ÜDT 5',55,'BA'],[1,'BTT 6',61,'CDAA'],[1,'ÜDT 6',63,'AAA'],[1,'BTT 7',69,'BBAB'],[1,'ÜDT 7',70,'BD'],[1,'BTT 8',75,'ACBCB'],[1,'ÜDT 8',76,'DB'],[1,'BDS 2',77,'BABBCCAADDADCCCC'],
    [2,'BTT 9',87,'ABC'],[2,'ÜDT 9',88,'CDA'],[2,'BTT 10',94,'AB'],[2,'ÜDT 10',95,'BBD'],[2,'BTT 11',101,'ADCC'],[2,'ÜDT 11',102,'BCB'],[2,'BTT 12',107,'BB'],[2,'ÜDT 12',108,'CD'],[2,'BTT 13',114,'DDCD'],[2,'ÜDT 13',115,'CB'],[2,'BDS 3',116,'BBCBCBCC'],
    [3,'BTT 14',125,'ACBCAABAD'],[3,'ÜDT 14',127,'CCCBBCDCAC'],[3,'BDS 4',129,'BDACCCDDCBD'],
    [4,'BTT 15',141,'DCCA'],[4,'ÜDT 15',142,'CABAACBA'],[4,'BTT 16',149,'DC'],[4,'ÜDT 16',150,'AD'],[4,'BDS 5',151,'DBBBABACDAABBBCDB'],
    [5,'BTT 17',163,'AA'],[5,'ÜDT 17',164,'BDA'],[5,'BTT 18',170,'CA'],[5,'ÜDT 18',171,'BD'],[5,'BTT 19',177,'CB'],[5,'ÜDT 19',178,'BA'],[5,'BDS 6',179,'DADDCDBCBD'],
    [6,'BTT 20',188,'BBDDA'],[6,'ÜDT 20',190,'BBBB'],[6,'BDS 7',192,'DBCDBDBADAC'],
    [7,'BTT 21',201,'DADDBD'],[7,'ÜDT 21',202,'BD'],[7,'BTT 22',208,'BCADDD'],[7,'ÜDT 22',209,'BCBA'],[7,'BDS 8',210,'BDBDADBBAA'],
    [8,'BTT 23',221,'ACADA'],[8,'ÜDT 23',222,'BDDC'],[8,'BTT 24',230,'DACCBDBADC'],[8,'ÜDT 24',232,'BAADA'],[8,'BDS 9',234,'AABCCADBBBD']
  ];
  const visualQuestions = (testNo, pageNo, keys, topicIndex, label = `Test ${testNo}`) => [...keys].map((answer, i) => question(
    `${label}, ${i + 1}. soruyu kaynak sayfasından çöz.`, answer, ['A', 'B', 'C', 'D'],
    `Kitapçığın cevap anahtarına göre doğru seçenek ${answer}.`,
    { id: `DEEP-${pageNo}-${String(label).replace(/\s+/g,'-')}-${i + 1}`, c: 'Türkçe', t: topicIndex, ...sourceMeta(SOURCE.deep, pageNo, `${label} · Soru ${i + 1}`) }
  ));
  const deepTopics = deepSections.map((row, topicIndex) => {
    const [id, title, tests, ranges] = row, concepts = deepConcepts[title];
    const topicQuestions = conceptQuestions(concepts.flatMap(([a,b]) => [[a,b,'bu kavramla ilgisizdir','yalnız bir noktalama işaretidir','özel addır'], [`${a} sorusunda ilk adım`, `${b} bilgisini kullanmaktır`, 'rastgele seçenek işaretlemektir', 'metni okumamaktır', 'kanıtı görmezden gelmektir']]));
    topicQuestions.push(
      question(`${title} sorusunda doğru çözüm sırası hangisidir?`, 'Soruyu oku, kanıtı bul, seçenekleri karşılaştır', ['Soruyu oku, kanıtı bul, seçenekleri karşılaştır','Metni okumadan işaretle','Yalnız ilk kelimeye bak','Bütün seçenekleri doğru say'], 'Doğru çözüm, soruyu ve kanıtı dikkatle incelemeyi gerektirir.'),
      question(`${title} testinde cevap kontrolü nasıl yapılmalıdır?`, 'Kuralı veya metin kanıtını kullanarak', ['Kuralı veya metin kanıtını kullanarak','Yalnız tahmin ederek','En uzun seçeneği seçerek','Her soruda aynı harfi seçerek'], 'Cevap, öğrenilen kural veya metindeki kanıtla doğrulanır.')
    );
    const schoolQuestions = tests.flatMap(testNo => {
      const [pageNo, keys] = deepTests[testNo];
      return visualQuestions(testNo, pageNo, keys, topicIndex);
    });
    deepSupplement.filter(([section]) => section === topicIndex).forEach(([, label, pageNo, keys]) => {
      schoolQuestions.push(...visualQuestions(label.replace(/\D/g, '') || label, pageNo, keys, topicIndex, label));
    });
    if (topicIndex === deepSections.length - 1) deepFinals.forEach(([pageNo, label, keys], index) => schoolQuestions.push(...visualQuestions(`F${index + 1}`, pageNo, keys, topicIndex, label)));
    return {
      id, group: 'İELEV Derin Öğrenme', title, source: SOURCE.deep,
      pages: [
        page(`${title} · Konu anlatımı`, `Bu bölümde ${concepts.map(x => x[0].toLocaleLowerCase('tr-TR')).join(', ')} kavramlarını örneklerle öğreneceğiz. Soruyu çözerken önce verilen bilgiyi, sonra isteneni belirle.`, SOURCE.deep, ranges[0][0], '🧠'),
        page('Kavramları ilişkilendir', concepts.map(([a,b]) => `${a}: ${b}.`).join(' '), SOURCE.deep, Math.min(ranges[0][1], ranges[0][0] + 2), '🔗'),
        page('Kaynak uygulamaları', `Kitapçıktaki ${ranges[1][0]}-${ranges[1][1]}. sayfalardaki testler cevap anahtarıyla ilişkilendirilmiştir. Görsel sorularda kaynak sayfası doğrudan soru alanında açılır.`, SOURCE.deep, ranges[1][0], '📄')
      ], topicQuestions, schoolQuestions
    };
  });

  const mebQ = (prompt, answer, wrong, explain) => question(prompt, answer, [answer, ...wrong], explain);
  const mebThemeData = [
    {
      id:'meb-oyun-dunyasi', title:'1. Tema: Oyun Dünyası', book:1,
      texts:[
        ['Oyun Durdu',12,'Başlık ve görsellerden hareketle dinleyeceğin içeriği tahmin et. Dinlerken bilmediğin sözcükleri not al; anlamlarını önce cümlenin bağlamından tahmin et, sonra TDK sözlüğünden doğrula.','🎧'],
        ['Topsuz Basketbol Oyunu',26,'Moni, patlayan topu oyunun sonu değil yeni bir problem olarak görür. Tahmin etme stratejisiyle ipuçlarını kullanır, çözüm üretir ve pes etmez. Metnin önemli iletisi şudur: Bir problem varsa yeni bir çözüm denemek mümkündür.','🏀'],
        ['Bir İp Bul, Oyuna Başla',35,'Tek bir ip; atlama, halat çekme, baskı, örgü veya salıncak gibi birçok etkinliğe dönüşebilir. Metin aynı zamanda akıcı okumanın hızlı okumak değil; uygun hız, doğru söyleyiş, vurgu ve tonlamayla anlamı yansıtmak olduğunu öğretir.','🪢'],
        ['Bir Güzel Hediye',45,'Anlatıcı, kuzeni Buse’nin doğum günü için biriktirdiği parayla oyuncakçıya gider. İyi bir hediye seçerken yalnız fiyatı değil, alacağımız kişinin ilgisini, ihtiyacını ve hediyenin taşıdığı anlamı düşünmemiz gerekir.','🎁'],
        ['Çocukluk',58,'Şair, Affan Dede’den çocukluğunu satın aldığını hayal eder; uçurtma, çember, horoz şekeri ve bahçe imgeleriyle çocukluk sevincini canlandırır. Şiirin temel duygusu çocukluğa duyulan özlem ve neşedir.','🪁']
      ],
      questions:[
        mebQ('“Oyun Durdu” içeriğini dinlemeden önce başlık ve görsellere bakmanın amacı nedir?','İçerikle ilgili gerekçeli tahmin yapmak',['Metni ezberlemek','Bütün cevapları görmek','Noktalama işaretlerini silmek'],'Başlık ve görseller, dinlenecek içerik için ipucu verir.'),
        mebQ('“Oyun Durdu” sayfasına göre bilmediğin bir sözcüğün anlamını nasıl doğrulamalısın?','Bağlamdan tahmin edip TDK sözlüğüne bakarak',['Rastgele bir anlam seçerek','Sözcüğü metinden çıkararak','Yalnız arkadaşına sorup bırakarak'],'Önce bağlamdan tahmin edilir, ardından güvenilir sözlükle kontrol edilir.'),
        mebQ('Moni, basketbol topu patlayınca nasıl davranır?','Oyunu sürdürmek için yeni bir çözüm arar',['Maçı hemen bırakır','Arkadaşlarını suçlar','Topu görmezden gelir'],'Moni problemi öğrenme ve çözüm üretme fırsatı sayar.'),
        mebQ('“Topsuz Basketbol Oyunu” metninin iletisine en uygun söz hangisidir?','Pes etme, başka bir yol düşün',['Sorun varsa oyun biter','Yalnız hazır araçlarla oyna','İlk denemede vazgeç'],'Metin, karşılaşılan soruna yaratıcı çözüm bulmayı vurgular.'),
        mebQ('“Bir İp Bul, Oyuna Başla” metnindeki etkinliklerin ortak malzemesi nedir?','İp',['Top','Raket','Bisiklet'],'Metin, farklı oyun ve etkinliklerin bir iple yapılabileceğini anlatır.'),
        mebQ('Akıcı okuma ne demektir?','Uygun hız, doğru vurgu ve tonlamayla anlamı yansıtmak',['Olabildiğince hızlı okumak','Her sözcükte durmak','Metni sessizce ezberlemek'],'Akıcı okumada amaç hız rekoru değil, anlamı doğru yansıtmaktır.'),
        mebQ('“Bir Güzel Hediye”de anlatıcı oyuncakçıya neden gider?','Kuzeni Buse’ye doğum günü hediyesi almak için',['Kendi oyuncağını satmak için','Okul çantasını unutmak için','Dükkânda çalışmak için'],'Anlatıcı kuzenini şaşırtacak anlamlı bir hediye arar.'),
        mebQ('Bir hediye seçerken en doğru yaklaşım hangisidir?','Hediye alacağımız kişinin ilgi ve ihtiyacını düşünmek',['Yalnız en pahalı ürünü seçmek','Kendi istediğimizi almak','Hiç düşünmeden ilk ürünü almak'],'Hediyeyi değerli yapan, alacağımız kişiye uygun ve anlamlı olmasıdır.'),
        mebQ('“Çocukluk” şiirinde çocukluk sevincini canlandıran nesnelerden biri hangisidir?','Uçurtma',['Bilgisayar kasası','Trafik levhası','Dosya dolabı'],'Uçurtma, çember ve horoz şekeri şiirde çocukluğu canlandırır.'),
        mebQ('“Çocukluk” şiirinin temel duygusu nedir?','Çocukluğa duyulan özlem ve neşe',['Sınav korkusu','Yolculuk öfkesi','Yalnızlık isteği'],'Şair çocukluk oyunlarını ve güzelliklerini özlemle anar.')
      ]
    },
    {
      id:'meb-ataturku-tanimak', title:'2. Tema: Atatürk’ü Tanımak', book:1,
      texts:[
        ['Mustafa',68,'İzleme öncesinde başlık ve görsellerden içerik tahmini yapılır. İçerik; Atatürk’ün çocuklara, eğitime ve öğrenmeye verdiği değeri anlamaya odaklanır. İzlerken anlaşılmayan bölümler not edilmeli, önemli bilgiler kanıtlarıyla belirlenmelidir.','🎬'],
        ['Oğlu Hüseyin’den Emine Ana’ya Mektuplar',76,'Mart 1920 tarihli mektupta Hüseyin, annesine ve ailesine duyduğu özlemi anlatır. Mektup; Millî Mücadele günlerindeki ayrılığı, vatan sorumluluğunu ve aile sevgisini birinci kişinin içten anlatımıyla gösterir.','✉️'],
        ['Gazi Mustafa Kemal ve Sığırtmaç Mustafa',89,'1929’da hasta ve yorgun olduğu hâlde sığırları otlatan küçük Mustafa ile Gazi Mustafa Kemal’in yolu kesişir. Metin, Atatürk’ün eğitime verdiği değeri ve bir çocuğun yaşamına gösterdiği ilgiyi anlatır.','👦'],
        ['Atatürk ve Çiftlik',104,'Atatürk, 1925’te Ankara çevresinde örnek bir çiftlik kurulmasını ister. Yeşile duyduğu özlemi, verimsiz görülen bir arazinin emek, bilim ve planlamayla halkın yararına dönüştürülmesi düşüncesiyle birleştirir.','🌳'],
        ['Toprağımız Temizdir',112,'İngiltere Kralı VIII. Edward Dolmabahçe’de Atatürk’ü ziyaret ederken düşüp elini yaralar. Atatürk’ün “Bizim topraklarımız temizdir.” sözü; konuğa güven veren, ince düşünceli ve esprili bir ev sahipliği örneğidir.','🤝']
      ],
      questions:[
        mebQ('“Mustafa” içeriğini izlerken özellikle hangi konuya odaklanılır?','Atatürk’ün çocuklara ve eğitime verdiği değere',['Oyuncak fiyatlarına','Hava durumuna','Spor kurallarına'],'Sayfadaki hazırlık soruları Atatürk, çocuk ve eğitim ilişkisini öne çıkarır.'),
        mebQ('İzleme sırasında anlaşılmayan bir bölüm için en doğru davranış hangisidir?','Bölümü not edip uygun zamanda sormak',['İçeriği hemen kapatmak','Rastgele anlam vermek','Bütün notları silmek'],'Not almak, izleme bittikten sonra soruyu açıkça sormayı sağlar.'),
        mebQ('Hüseyin’in Mart 1920 tarihli mektubunda öne çıkan duygu nedir?','Ailesine duyduğu özlem',['Yarışma heyecanı','Alışveriş sevinci','Oyun merakı'],'Hüseyin annesini ve kardeşlerini içten sözlerle anar.'),
        mebQ('“Oğlu Hüseyin’den Emine Ana’ya Mektuplar” hangi dönemin izlerini taşır?','Millî Mücadele dönemi',['Taş Devri','Uzay Çağı','Lale Devri'],'Mektubun tarihi ve içeriği Millî Mücadele yıllarındaki ayrılığı yansıtır.'),
        mebQ('Sığırtmaç Mustafa metnin başında neden çok yorgundur?','Hastayken sığırları otlatmak zorunda olduğu için',['Gece boyunca oyun oynadığı için','Uzun bir geziye çıktığı için','Yarış kazandığı için'],'Metinde Mustafa’nın sıtma olduğu ve çalışmayı sürdürdüğü anlatılır.'),
        mebQ('Atatürk’ün “En büyük savaş, cahilliğe karşı yapılan savaştır.” sözü neyi vurgular?','Eğitimin önemini',['Daha çok silahı','Yalnız bedensel gücü','Sessiz kalmayı'],'Cahilliği yenmenin yolu öğrenme ve eğitimdir.'),
        mebQ('Atatürk neden Ankara’da örnek bir çiftlik kurmak ister?','Bilim ve emekle halka yararlı bir örnek oluşturmak için',['Yalnız kendine ev yapmak için','Ağaçları kesmek için','Şehri terk etmek için'],'Çiftlik, tarım ve yeşillendirme konusunda topluma örnek olacak biçimde düşünülür.'),
        mebQ('Atatürk’ün çiftliğin yeşillendirilmesini istemesi hangi özelliğini gösterir?','Doğa sevgisini ve geleceği düşünmesini',['Yenilikten korkmasını','Plansız davranmasını','Çalışmayı sevmemesini'],'Metin, Atatürk’ün yeşile özlemini ve halkın geleceğine verdiği önemi açıklar.'),
        mebQ('VIII. Edward’ın eli nerede yaralanır?','Dolmabahçe Sarayı’nda',['Bir okul bahçesinde','Ankara’daki çiftlikte','Bir tren istasyonunda'],'Kral, Dolmabahçe Sarayı’na girerken düşer.'),
        mebQ('“Bizim topraklarımız temizdir.” sözü Atatürk’ün hangi yönünü gösterir?','İnce düşünceli ve esprili ev sahipliğini',['Konuğunu önemsememesini','Tedaviyi reddetmesini','Toprağı kirletmesini'],'Atatürk konuğunu rahatlatan nazik ve esprili bir cevap verir.')
      ]
    },
    {
      id:'meb-duygularimi-taniyorum', title:'3. Tema: Duygularımı Tanıyorum', book:1,
      texts:[
        ['Duygularımız',122,'Duygular, bir durumla ilgili düşüncelerimizin ardından verdiğimiz psikolojik ve bedensel tepkilerdir. Mutluluk, üzüntü, korku ve öfke gibi temel duyguların yanında çevreden öğrenilen ikincil duygular da vardır. Duyguyu adlandırmak, anlatmak ve yönetmek sorun çözmeyi kolaylaştırır.','😊'],
        ['Her Yüreğe Nakış Gerek',134,'Metin; merhamet, vefa ve yardımseverlik değerlerini Ayşenur’un bahçesindeki yaşlı ıhlamur ağacı ve el emeği çevresinde işler. Bir kişinin davranışlarını değerlendirirken yalnız sonucuna değil, niyetine ve başkaları üzerindeki etkisine de bakmak gerekir.','🧵'],
        ['Korkuluk',143,'Şiirde korkuluk konuşan bir varlık gibi anlatılır. Korkuya teslim olmak yerine sevgi, neşe ve içten bir gülümsemeyle güçlenme düşüncesi öne çıkar; bu kullanım kişileştirme sanatına örnektir.','🌾'],
        ['Altı Üstü Bir Yarış',154,'Dinleme öncesinde amaç, süre, yöntem ve kullanılacak materyaller belirlenir. Yarış öncesi, sırası ve sonrasındaki duygular karşılaştırılır; metindeki bilinmeyen sözcüklerin anlamı bağlamdan çıkarılır.','🏁'],
        ['Fahrünnisa',165,'Sessiz ve çekingen görünen Fahrünnisa, ders anlatması istendiğinde konuyu ne kadar derinden kavradığını gösterir. Metin, bir insanı dış görünüşüne veya sessizliğine bakarak yargılamamamız gerektiğini öğretir.','👩‍🎓']
      ],
      questions:[
        mebQ('Duygu nedir?','Bir durumla ilgili düşüncelerimizin ardından oluşan psikolojik tepki',['Yalnız yüzümüzdeki çizgi','Ezberlenen bir kural','Her zaman aynı kalan eşya'],'Duygular düşünce, beden ve davranışlarımızla kendini gösterebilir.'),
        mebQ('Hangisi temel duygulardan biridir?','Korku',['Takvim','Dolap','Cetvel'],'Korku, mutluluk, üzüntü ve öfke temel duygular arasındadır.'),
        mebQ('Duygularımızı adlandırabilmek bize nasıl yardım eder?','Kendimizi anlatmayı ve sorun çözmeyi kolaylaştırır',['Bütün duyguları yok eder','Hiç konuşmamayı sağlar','Her olayı aynı yapar'],'Duyguyu tanımak, onu uygun biçimde anlatmanın ilk adımıdır.'),
        mebQ('“Her Yüreğe Nakış Gerek” metninde hangi değerler öne çıkar?','Merhamet, vefa ve yardımseverlik',['Kibir, öfke ve bencillik','Acele, korku ve sessizlik','Yarış, puan ve ödül'],'Metnin hazırlık ve olay örgüsü bu insani değerler çevresinde kurulur.'),
        mebQ('“Korkuluk” şiirinde korkuyu azaltan güç olarak ne gösterilir?','Sevgi ve içten gülümseme',['Daha çok korkutmak','Yalnız kalmak','Sorunu saklamak'],'Şiir, korkunun sevgi ve neşeyle aşılabileceğini söyler.'),
        mebQ('Korkuluğun kendi ağzından konuşması hangi söz sanatına örnektir?','Kişileştirme',['Abartısız tanım','Sayısal veri','Karşılaştırma tablosu'],'İnsan olmayan korkuluğa konuşma ve düşünme özelliği verilir.'),
        mebQ('“Altı Üstü Bir Yarış”ı dinlemeden önce hangisi belirlenmelidir?','Dinleme amacı, süresi ve yöntemi',['Yalnız sayfanın rengi','Metindeki bütün cevaplar','Sonucun puanı'],'Planlı dinleme, dikkati ve anlamayı güçlendirir.'),
        mebQ('Bir yarışın öncesi ve sonundaki duyguları karşılaştırmak neyi gösterir?','Duyguların duruma göre değişebildiğini',['Duyguların hiç değişmediğini','Her yarışın aynı bittiğini','Yalnız kazananın duygu taşıdığını'],'Beklenti, heyecan, sevinç veya üzüntü süreç içinde değişebilir.'),
        mebQ('Fahrünnisa öğretmenini neden şaşırtır?','Sessiz görünmesine rağmen konuyu çok iyi kavradığı için',['Dersi terk ettiği için','Soruyu duymadığı için','Kitabını evde bıraktığı için'],'Fahrünnisa, söz aldığında derin bir anlayışla dersi anlatır.'),
        mebQ('“Fahrünnisa” metninin ana iletisi hangisidir?','İnsanları sessizliğine veya görünüşüne bakarak yargılama',['Yalnız ön sırada otur','Her soruda hemen konuş','Sessiz kişiler öğrenemez'],'Metin, dışarıdan edinilen ilk izlenimin yanıltıcı olabileceğini gösterir.')
      ]
    },
    {
      id:'meb-geleneklerimiz', title:'4. Tema: Geleneklerimiz', book:2,
      texts:[
        ['Nasreddin Hoca',12,'Nasreddin Hoca 1208’de Sivrihisar’ın Hortu köyünde doğmuş, Konya’da eğitim görmüş; imamlık, hocalık ve kadılık yapmıştır. Fıkraları, güldürürken düşündüren kısa olaylarla ahlaklı ve bilgece davranmayı öğretir.','🙂'],
        ['Bugün Bayram',23,'Dinî bayramlar; ziyaret, paylaşma, büyükleri hatırlama ve birlikte sevinme geleneklerini güçlendirir. İzlerken anahtar sözcükleri belirlemek ve bilinmeyen sözcükleri bağlamdan çıkarmak, içeriğin ana düşüncesini bulmayı kolaylaştırır.','🍬'],
        ['Misafir Odası',31,'Şiirde kanepe, koltuk, aile fotoğrafları, guguklu saat, dantelli sehpa ve kolonya ile eski misafir odası canlandırılır. Bu ayrıntılar misafirperverlik, aile bağı ve birlikte geçirilen zamanın değerini gösterir.','🏠'],
        ['Çömlekçilik',46,'Çömlek; kil ve toprak karışımının çarkta şekillendirilip kurutulması ve 800-1200 derece arasında fırınlanmasıyla yapılır. Çömlekçilik, bilgi, el emeği ve sabır isteyen geleneksel bir zanaattır.','🏺'],
        ['Kırık At',61,'Çocuk, bayram hediyesi tekerlekli oyuncak atı kırılınca önce nalbanda, sonra köy demircisi Avadis’e götürür. Tamir sürecini dikkatle izleyerek bir zanaatın araçlarını ve emeğin değerini öğrenir.','🐴']
      ],
      questions:[
        mebQ('Nasreddin Hoca nerede doğmuştur?','Sivrihisar’ın Hortu köyünde',['İstanbul’un Üsküdar ilçesinde','Ankara’nın merkezinde','Bursa’nın bir mahallesinde'],'Metin, doğum yerini Hortu köyü olarak verir.'),
        mebQ('Nasreddin Hoca fıkralarının temel özelliği nedir?','Güldürürken düşündürmesi',['Yalnız tarih vermesi','Hiç olay içermemesi','Sadece korkutması'],'Fıkralar kısa ve güldürücü olaylarla bir ders düşündürür.'),
        mebQ('Dinî bayramlarda yapılan ziyaretlerin en önemli katkısı nedir?','Aile ve toplum bağlarını güçlendirmesi',['İnsanları birbirinden uzaklaştırması','Bütün gelenekleri unutturması','Yalnız alışverişi artırması'],'Ziyaret ve paylaşma, insanlar arasındaki bağı güçlendirir.'),
        mebQ('“Bugün Bayram” içeriğini izlerken anahtar sözcükleri belirlemek ne sağlar?','Temel düşünceyi bulmayı kolaylaştırır',['Görüntüyü durdurur','Sesi tamamen kapatır','Bütün ayrıntıları siler'],'Anahtar sözcükler içeriğin merkezindeki kavramları gösterir.'),
        mebQ('“Misafir Odası” şiirinde misafiri karşılama geleneğini simgeleyen ayrıntı hangisidir?','Misafir kolonyası',['Okul zili','Trafik lambası','Spor ayakkabısı'],'Kolonya, gelen misafire gösterilen özen ve ikramı simgeler.'),
        mebQ('Şiirdeki eski aile fotoğrafları neyi güçlendirir?','Aile bağı ve geçmiş duygusunu',['Yarışma heyecanını','Alışveriş isteğini','Yolculuk korkusunu'],'Fotoğraflar dedeleri, nineleri ve torunları bir araya getirir.'),
        mebQ('Çömlek hangi maddelerin karışımından yapılır?','Kil ve toprak',['Cam ve plastik','Kâğıt ve pamuk','Demir ve bakır'],'Metin çömleği kil ve toprak karışımından yapılan kap olarak tanımlar.'),
        mebQ('Çömlek neden fırında yüksek sıcaklıkta pişirilir?','Sertleşip dayanıklı olması için',['Rengini tamamen kaybetmesi için','Suya dönüşmesi için','Hemen kırılması için'],'Pişirme, şekillendirilmiş toprağı sağlamlaştırır.'),
        mebQ('“Kırık At”taki at gerçekte nedir?','Tekerlekli bir oyuncak',['Canlı bir yarış atı','Tahtadan bir masa','Bir çiftlik traktörü'],'Şiirde hem at hem araba olarak anlatılan bayram hediyesi bir oyuncaktır.'),
        mebQ('Çocuğun demirci dükkânındaki tamiri izlemesi ona ne kazandırır?','Zanaat ve emek hakkında gözlem',['Oyuncağını unutma','Dersi bırakma','Bayramı iptal etme'],'Çocuk boş durmaz; dükkândaki araçları ve ustanın çalışmasını dikkatle gözler.')
      ]
    },
    {
      id:'meb-iletisim', title:'5. Tema: İletişim ve Sosyal İlişkiler', book:2,
      texts:[
        ['Ev',72,'Anlatıcı için mutfaktaki kurabiye kutusu mutluluğun sembolüdür. Metin, bir evi değerli yapanın yalnız eşyalar değil; sevgi, kahkaha, paylaşma, güven ve birlikte geçirilen zaman olduğunu düşündürür.','🍪'],
        ['Tatlı Günler',80,'Doğu Anadolu’daki dağ köyünde yaşayan çocuk, kısa yaz mevsimini, oyunları ve ailesini sevgiyle anlatır. İnşaat işçisi babası yardımsever; annesi şefkatli, çalışkan ve hasta komşularına yemek götüren biridir.','🌄'],
        ['Gülü İncitme Gönül',87,'Şiir; doğaya, insanlara ve sözcüklere özen göstermeyi öğütler. “Yapan ol, yıkan olma.” sözü iyiliği büyütmeyi; “Ya hayır de, yahut sus.” sözü ise kırıcı konuşmamayı vurgular.','🌹'],
        ['Komşumuz Nergis Teyze – Çiçek Dayanışması',95,'Dinleme metni Türk kültüründe komşuluk, yardımlaşma ve dayanışmayı işler. Olayları, kahramanları ve davranışları başka bir metinle karşılaştırmak; benzerlik ve farklılıkları kanıtlarla görmeyi sağlar.','🌼'],
        ['Herkes Önemli',103,'Kasabadaki çalışanlar değerlerinin bilinmediğini düşünerek işi bırakınca hayat durur. Öğretmen, doktor, polis, çiftçi, şoför, usta ve fırıncı birbirine ihtiyaç duyduğunu anlar; dayanışma olmadan toplum düzeninin sürdürülemeyeceği görülür.','🤲'],
        ['Üretim Zamanı: Nezaketli ileti',104,'Türkiye ve Azerbaycan’dan iki öğrenci arasındaki iletiye yanıt yazarken selam ve hitap kullanılır, kişi kendini tanıtır, sorular açıkça cevaplanır ve ileti uygun bir sonlandırma cümlesiyle bitirilir. Dijital ortamda kişisel bilgi güvenliği de korunur.','📧']
      ],
      questions:[
        mebQ('“Ev” metninde kurabiye kutusu neyin sembolüdür?','Evdeki mutluluğun ve sıcaklığın',['Yalnızlığın','Tartışmanın','Yolculuğun'],'Anlatıcı çocukluk filmlerindeki kurabiye kutusunu mutlu ev hayaliyle ilişkilendirir.'),
        mebQ('“Ev” metnine göre bir evi asıl değerli yapan nedir?','Sevgi, güven ve paylaşma',['Eşyaların çok pahalı olması','Bütün odaların boş kalması','Kimsenin konuşmaması'],'Metindeki ev hayali, birlikte yaşanan sıcak duygular üzerine kuruludur.'),
        mebQ('“Tatlı Günler”de çocuklar yaz mevsimini neden sabırsızlıkla bekler?','Kırlarda oynayıp sıcak günlerin tadını çıkarmak için',['Okulu tamamen bırakmak için','Kışın kar yağdırmak için','Köyden gizlice ayrılmak için'],'Köyün kışı uzun, yazı kısa olduğu için çocuklar yaza özlem duyar.'),
        mebQ('Anlatıcının annesinin hasta komşuya çorba göndermesi hangi özelliğini gösterir?','Yardımseverliğini',['Kıskançlığını','Kararsızlığını','Unutkanlığını'],'Anne, hasta komşusunu düşünerek hemen yemek hazırlar.'),
        mebQ('“Yapan ol, yıkan olma.” sözü hangi davranışı öğütler?','İyilik üretmeyi ve zarar vermemeyi',['Kırıcı konuşmayı','Çiçekleri koparmayı','Kibirli davranmayı'],'Şiir, insanı ve doğayı incitmeden yapıcı olmayı ister.'),
        mebQ('“Ya hayır de, yahut sus.” sözü iletişimde neyi vurgular?','Kırıcı ve kötü sözden kaçınmayı',['Her zaman bağırmayı','Hiç kimseyi dinlememeyi','Yalnız kendini övmeyi'],'Şiir, dilin başkalarını incitebileceğini hatırlatır.'),
        mebQ('İki metni olay ve kahraman bakımından karşılaştırmak neyi buldurur?','Benzerlik ve farklılıkları',['Yalnız sayfa sayısını','Yazarın yaşını','Kitabın fiyatını'],'Karşılaştırma, ortak ve ayrılan yönleri kanıtlarıyla görmeyi sağlar.'),
        mebQ('“Herkes Önemli” metninde kasaba hayatı neden çekilmez olur?','Çalışanlar birbirine hizmet etmeyi bıraktığı için',['Çok fazla çiçek açtığı için','Okullar tatil olduğu için','Herkes aynı mesleği seçtiği için'],'Mesleklerin birbirine bağlı olduğu, işler durunca açıkça anlaşılır.'),
        mebQ('“Birimiz hepimiz, hepimiz birimiz için.” sözü hangi düşünceyi anlatır?','Dayanışmayı',['Yalnız çalışmayı','Rekabeti','İlgisizliği'],'Toplumdaki herkesin emeği diğerlerinin yaşamını destekler.'),
        mebQ('Nezaketli bir dijital ileti nasıl bitirilmelidir?','Uygun bir teşekkür ve sonlandırma cümlesiyle',['Kişisel şifreyi yazarak','Cevapsız bırakarak','Kırıcı bir sözle'],'İletide selam, açık cevap, nezaket ve uygun kapanış birlikte bulunur.')
      ]
    },
    {
      id:'meb-saglikli-yasiyorum', title:'6. Tema: Sağlıklı Yaşıyorum', book:2,
      texts:[
        ['Haydi Doğa Yürüyüşüne',114,'Doğa yürüyüşü; uzun yürüyüşü kuş, böcek, ağaç ve çiçek gözlemiyle birleştiren bir spordur. Rota, hava, uygun giysi, su ve güvenlik önceden planlanmalı; doğaya zarar verilmemelidir.','🥾'],
        ['Ne Olacak Bu Yemek Sorunu',123,'Tolga makarna gibi sevdiği yiyecekleri ister; annesi ise ıspanak ve yoğurt çorbasıyla çeşitli ve dengeli beslenmenin önemini anlatır. Sağlıklı büyümek için tek tür yiyeceğe bağlı kalmadan farklı besinleri yeterli miktarda tüketmek gerekir.','🥗'],
        ['Benim Zamanım – Okçuluk',132,'Okçuluk bir spor ve ilgi alanıdır. Yeni hobiler; sabır, dikkat, hedef belirleme ve düzenli çalışma alışkanlığı kazandırabilir. İzleme sırasında bilinmeyen sözcükler not edilmeli, gerektiğinde içerik yeniden izlenmelidir.','🏹'],
        ['Obezite',138,'Vücut besinlerden enerji alır, hareket ve yaşamsal işlevlerle enerji harcar. Alınan enerji uzun süre harcanandan fazla olursa fazlası yağ olarak depolanabilir; ileri düzeydeki dengesizlik obezite denen ciddi sağlık sorununa dönüşebilir.','⚖️'],
        ['Atlı Cirit',147,'Atlı cirit, savaş eğitiminden kurallı takım oyununa dönüşmüş geleneksel bir ata sporudur. Oyun 120x40 metrelik alanda, 35’er dakikalık iki devrede oynanır; 110 santimetrelik ciridin ucu güvenlik için yuvarlatılır.','🐎']
      ],
      questions:[
        mebQ('Doğa yürüyüşü hangi iki etkinliği birleştirir?','Uzun yürüyüş ve doğa gözlemini',['Yüzme ve masa tenisini','Satranç ve koşuyu','Resim ve yemek yapmayı'],'Metin, yürürken çevredeki canlıları gözlemlemeyi anlatır.'),
        mebQ('Doğa yürüyüşünden önce ne yapılmalıdır?','Rota, hava, giysi, su ve güvenlik planlanmalıdır',['Plansızca yola çıkılmalıdır','Doğadaki bitkiler koparılmalıdır','Su götürülmemelidir'],'Güvenli ve doğaya saygılı yürüyüş hazırlık gerektirir.'),
        mebQ('Tolga sofrada en çok hangi yemeği görmek ister?','Makarna',['Ispanak','Yoğurt çorbası','Salata'],'Tolga makarnayı çok sevdiğini, her gün yiyebileceğini söyler.'),
        mebQ('Tolga’nın annesi neden farklı yemekler yemesini ister?','Yeterli ve dengeli beslenip sağlıklı büyümesi için',['Yalnız sofrayı süslemek için','Makarna pişirmeyi bilmediği için','Yemeği soğutmak için'],'Tek tür besin yerine çeşitlilik vücudun farklı ihtiyaçlarını karşılar.'),
        mebQ('Okçuluk gibi bir hobi hangi becerileri geliştirebilir?','Dikkat, sabır ve hedef belirlemeyi',['Düzensizliği ve aceleciliği','Hiç hareket etmemeyi','Kuralları unutmayı'],'Okçuluk odaklanma ve düzenli çalışma gerektirir.'),
        mebQ('İzleme sırasında bilinmeyen bir sözcükle karşılaşınca ne yapılmalıdır?','Sözcük not edilip içerik gerekirse yeniden izlenmelidir',['Sözcük rastgele değiştirilmelidir','İzleme hemen bırakılmalıdır','Bütün notlar silinmelidir'],'Not almak ve yeniden izlemek anlamayı güçlendirir.'),
        mebQ('Alınan enerji harcanan enerjiden uzun süre fazla olursa ne olabilir?','Fazla enerji yağ olarak depolanabilir',['Vücut hiç enerji kullanmaz','Bütün yağlar hemen yok olur','Besinler suya dönüşür'],'Enerji dengesindeki sürekli fazlalık kilo artışına yol açabilir.'),
        mebQ('Obezite neden yalnız görünüşle ilgili değildir?','Ciddi bir sağlık sorunu olabildiği için',['Yalnız kıyafet rengini değiştirdiği için','Sadece boyu uzattığı için','Hiçbir etkisi olmadığı için'],'Metin obeziteyi metabolik dengeyle ilgili önemli bir hastalık olarak açıklar.'),
        mebQ('Atlı cirit oyunu toplam kaç dakika sürer?','70 dakika',['35 dakika','40 dakika','120 dakika'],'Oyun 35’er dakikalık iki devreden oluşur.'),
        mebQ('Cirit sopasının ucu neden yuvarlatılmıştır?','Oyuncuların zarar görme riskini azaltmak için',['Daha ağır olması için','Toprağa gömülmesi için','Rengini değiştirmek için'],'110 santimetrelik ciridin ucu güvenlik amacıyla yuvarlatılır.')
      ]
    }
  ];
  const mebThemes = mebThemeData.map((theme, themeIndex) => {
    const pages = theme.texts.map(([title, mebPage, body, visual]) => ({
      title, body, visual, mebBook:theme.book, mebPage,
      sourceLabel:`Türkçe MEB ${theme.book}. kitap · s. ${mebPage}`
    }));
    const topicQuestions = theme.questions.map((q, index) => ({ ...q, id:`MEB-TR-${themeIndex}-${index}` }));
    return {
      id:theme.id, group:'MEB Kaynakları', title:theme.title, pages, topicQuestions, schoolQuestions:[],
      meb:{ book:theme.book, start:theme.texts[0][1], end:theme.texts.at(-1)[1], texts:theme.texts.map(([name, page]) => ({ name, page })) }
    };
  });

  window.DURU_TURKISH_V6520 = { version: '6.52.0', SOURCE, schoolTopics, deepTopics, mebThemes, allTopics: [...schoolTopics, ...deepTopics, ...mebThemes], sourceUrl };
})();
