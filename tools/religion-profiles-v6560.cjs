const q=(prompt,answer,a,b,c)=>[prompt,answer,a,b,c];
const p=(outcome,application,reasoning)=>({outcome,application,reasoning});

const din=[
  p('Evrendeki ölçü, uyum ve işleyişten hareketle düzen hakkında akıl yürütür.',[
    q('Duru, yağmurun toprağı beslediğini ve bitkilerin canlılara besin olduğunu gözlemliyor. Bu gözlem en çok neyi gösterir?','Doğadaki olayların birbiriyle ilişkili olduğunu','Doğadaki her olayın bağımsız olduğunu','Canlıların suya ihtiyaç duymadığını','Gözlem yapmanın gereksiz olduğunu'),
    q('Bir öğrenci evrendeki düzeni araştırmak istiyor. İlk olarak ne yapması uygundur?','Çevresini dikkatle gözlemlemek','Sonucu baştan uydurmak','Sorularını önemsememek','Yalnızca tek bir olaya bakmak'),
    q('Gece ve gündüzün düzenli biçimde birbirini izlemesi hangi düşünceyi destekler?','Evrenin ölçülü bir işleyişi vardır','Dünya hiç hareket etmez','Bütün olaylar rastlantısaldır','Güneş yalnız geceleri görünür'),
    q('Arıların çiçeklerden yararlanması, çiçeklerin de tozlaşması hangi kavrama örnektir?','Canlılar arasındaki karşılıklı ilişkiye','Canlıların birbirinden tamamen bağımsızlığına','Mevsimlerin durmasına','İnsan yapımı düzene'),
    q('Suyu gereksiz yere akıtmamak evrendeki düzenle ilgili hangi sorumluluğu gösterir?','Doğal dengeyi korumayı','Kaynakları sınırsız sanmayı','Canlıların ihtiyacını önemsememeyi','Gözlem yapmaktan kaçınmayı')], [
    q('“Bir olayın düzenli gerçekleşmesi onu araştırmamıza engeldir.” sözü neden yanlıştır?','Düzenli olaylar da gözlem ve araştırmayla anlaşılır','Düzenli olaylar hiç incelenemez','Araştırma yalnız makineler içindir','Gözlem yalnız geceleri yapılır'),
    q('Su döngüsü bozulduğunda birçok canlının etkilenmesi hangi sonuca götürür?','Doğadaki sistemler birbirine bağlıdır','Yalnız insanlar doğadan etkilenir','Su canlılar için gerekli değildir','Her sistem tek başına işler'),
    q('Aşağıdakilerden hangisi evrendeki düzene kanıt olarak kullanılamaz?','Bir öğrencinin rastgele çizdiği karalama','Gezegenlerin belirli yörüngelerde hareketi','Mevsimlerin sırayla yaşanması','Canlıların besin zinciri oluşturması'),
    q('Evrendeki düzeni açıklarken hem gözlem hem akıl yürütme kullanmak neden önemlidir?','Gördüklerimiz arasında anlamlı ilişkiler kurmak için','Her soruya aynı cevabı vermek için','Kanıtları göz ardı etmek için','Araştırmayı bırakmak için'),
    q('“Ölçü ve denge” kavramlarını en iyi açıklayan örnek hangisidir?','İnsan bedenindeki sistemlerin uyumlu çalışması','Bir oyuncağın kırık bırakılması','Plansızca kaynak tüketilmesi','Trafik kurallarının önemsenmemesi')]),
  p('Evrendeki düzenden hareketle Allah’ın varlığı ve birliği hakkında çıkarım yapar; tevhit ve şirki ayırt eder.',[
    q('Bir öğrenci evrendeki uyumun tek bir yaratıcıya işaret ettiğini söylüyor. Bu düşünce hangi kavramla ilişkilidir?','Tevhit','Şirk','Hicret','Sadaka'),
    q('“Allah’ın eşi ve benzeri yoktur.” diyen biri hangi inancı ifade eder?','Allah’ın birliğini','Birden çok yaratıcıyı','Varlıkların kendiliğinden oluştuğunu','İnsanların ilah olduğunu'),
    q('Bir Müslümanın ibadetini yalnız Allah için yapması hangi anlayışa uygundur?','Tevhit inancına','Şirk anlayışına','Gösterişe','Tesadüf düşüncesine'),
    q('Bir tablo için ressam, bir bina için usta düşünmek; evren için hangi sonuca ulaşmaya yardımcı olur?','Evrendeki düzenin bir yaratıcısı olduğu sonucuna','Evrenin hiç değişmediği sonucuna','İnsanların her şeyi yarattığı sonucuna','Düzenin araştırılamayacağı sonucuna'),
    q('Allah’a ait özellikleri başka bir varlığa vermek hangi kavramla açıklanır?','Şirk','Tevhit','İhlas','Şükür')], [
    q('Tevhit ile şirk arasındaki temel fark nedir?','Tevhit Allah’ın birliğini, şirk O’na ortak koşmayı anlatır','İkisi de aynı anlama gelir','Tevhit mimariyi, şirk temizliği anlatır','Şirk yalnız yardımlaşmayı anlatır'),
    q('Evrendeki birliğin tek yaratıcıya işaret ettiği düşüncesini en iyi destekleyen örnek hangisidir?','Doğa yasalarının uyumlu işlemesi','Her insanın farklı bir kalem kullanması','Bir oyunun yarıda bırakılması','Bir defterin kapağının yırtılması'),
    q('“Allah birdir fakat benzeri vardır.” cümlesindeki hata nedir?','Birlik inancına aykırı olarak Allah’a benzer kabul etmektedir','Allah’ın yaratıcı olduğunu söylemektedir','İbadetin önemini anlatmaktadır','Gözlem yapmayı önermektedir'),
    q('Allah’ın varlığı ve birliği hakkında düşünürken hangi yaklaşım uygundur?','Evreni gözlemleyip düzen üzerinde akıl yürütmek','Kanıtları incelemeden karar vermek','Yalnız söylentilere inanmak','Soruları yasaklamak'),
    q('Aşağıdakilerden hangisi tevhit inancının sonucu değildir?','Allah’tan başka varlıklara ibadet etmek','Yalnız Allah’a kulluk etmek','Allah’ın eşsiz olduğunu kabul etmek','İbadette samimi olmak')]),
  p('Esmaülhüsnadan Rahman, Rahîm, Alîm, Semi, Basîr ve Kadir isimlerini anlamlarıyla ilişkilendirir.',[
    q('Yaralı bir hayvana yardım eden öğrenci, Allah’ın hangi isimlerinin anlattığı değeri örnek alır?','Rahman ve Rahîm','Alîm ve Basîr','Kadir ve Semi','Tevhit ve ihlas'),
    q('Kimsenin görmediği bir yerde de doğru davranmak hangi bilgiyle ilişkilendirilebilir?','Allah’ın Basîr olduğu bilgisiyle','Allah’ın hiçbir şeyi görmediği düşüncesiyle','Sorumluluğun gereksiz olmasıyla','Yalnız ödül için davranmakla'),
    q('Bir dua fısıltıyla yapılsa da Allah’ın işittiğine inanmak hangi isimle ilişkilidir?','Semi','Basîr','Alîm','Kadir'),
    q('Allah’ın geçmişi, bugünü ve geleceği bilmesi hangi isimle anlatılır?','Alîm','Rahîm','Semi','Basîr'),
    q('Allah’ın dilediğini yapmaya gücünün yetmesi hangi isimle ilişkilidir?','Kadir','Rahman','Alîm','Semi')], [
    q('Basîr ile Semi arasındaki fark hangisidir?','Basîr görmeyi, Semi işitmeyi ifade eder','İkisi de yalnız merhameti ifade eder','Basîr bilmeyi, Semi yaratmayı ifade eder','Aralarında hiçbir anlam farkı yoktur'),
    q('“Allah yalnız yüksek sesleri işitir.” ifadesi neden yanlıştır?','Semi ismi Allah’ın her şeyi işittiğini anlatır','Allah yalnız gündüzleri işitir','Sesler hiçbir zaman işitilmez','Semi yalnız görme anlamındadır'),
    q('Esmaülhüsnayı öğrenmenin temel amacı nedir?','Allah’ı isim ve sıfatlarıyla doğru tanımak','İsimleri anlamadan ezberlemek','İnsanlara ilahî özellik vermek','Yalnız yazı süslemek'),
    q('Aşağıdaki eşleştirmelerden hangisi yanlıştır?','Alîm — yalnız görünenleri bilen','Rahman — merhameti geniş olan','Basîr — her şeyi gören','Kadir — her şeye gücü yeten'),
    q('Allah’ın güzel isimlerini davranışlarla ilişkilendirmek ne sağlar?','Merhamet ve sorumluluk gibi değerleri yaşamaya yardımcı olur','İsimlerin anlamını önemsizleştirir','Başkalarını küçümsemeyi öğretir','Sorumluluktan kaçmayı sağlar')]),
  p('İhlas suresinin okunuşunu, anlamını ve tevhit mesajını yorumlar.',[
    q('İhlas suresindeki “Ehad” ifadesi hangi anlamı vurgular?','Allah’ın bir ve tek olduğunu','Allah’ın yardıma muhtaç olduğunu','Birden çok ilah bulunduğunu','İnsanların kusursuz olduğunu'),
    q('“Samed” ifadesinden hangi sonuç çıkarılır?','Her şey Allah’a muhtaçtır, Allah hiçbir şeye muhtaç değildir','Allah da insanlar gibi ihtiyaç sahibidir','Yalnız insanlar Allah’a muhtaçtır','Hiçbir varlığın ihtiyacı yoktur'),
    q('İhlas suresini anlayan bir öğrencinin hangi davranışı beklenir?','İbadetini yalnız Allah için yapması','Başkalarının beğenisi için ibadet etmesi','Allah’a benzer varlıklar araması','Tevhit inancını reddetmesi'),
    q('Surede Allah’ın doğmadığı ve doğurmadığı bildirilerek ne reddedilir?','Allah’ın canlılara benzetilmesi','Allah’ın birliği','Allah’ın yaratıcı olması','İbadetin önemi'),
    q('İhlas suresinin anlamını öğrenmek neden önemlidir?','Okunan ayetlerin verdiği tevhit mesajını kavramak için','Yalnız sayfa sayısını bilmek için','Sureyi başka bir metne çevirmek için','Ayetleri birbirinden koparmak için')], [
    q('İhlas suresinin bütün ayetlerini birleştiren ana düşünce hangisidir?','Allah’ın tek, eşsiz ve hiçbir şeye muhtaç olmadığı','İnsanların her şeyi bildiği','Yalnız maddi nimetlerin önemli olduğu','Her varlığın ilah olabileceği'),
    q('“Allah’ın dengi vardır.” sözü surenin hangi mesajıyla çelişir?','Hiçbir varlığın Allah’a denk olmadığı mesajıyla','Şükretme mesajıyla','Yardımlaşma mesajıyla','Temizlik mesajıyla'),
    q('Sureyi yalnız ezberleyip anlamını hiç düşünmemek hangi öğrenmeyi eksik bırakır?','Ayetleri yorumlayıp hayata aktarmayı','Ayet sayısını öğrenmeyi','Sure adını bilmeyi','Okuma sırasını görmeyi'),
    q('İhlas suresiyle tevhit arasındaki ilişki hangisidir?','Sure Allah’ın birliğini açık biçimde anlatır','Sure yalnız mimariyi anlatır','Tevhit namazın hareketidir','Aralarında ilişki yoktur'),
    q('Aşağıdakilerden hangisi İhlas suresinden çıkarılamaz?','Allah’ın bir aileye sahip olduğu','Allah’ın bir ve tek olduğu','Her şeyin Allah’a muhtaç olduğu','Allah’ın denginin bulunmadığı')]),
  p('Namaz ibadetinin anlamını ve farz, vacip, nafile namaz çeşitlerini örnekleriyle ayırt eder.',[
    q('Duru, sabah namazını vaktinde kılıyor. Bu namaz hangi gruptadır?','Farz namaz','Nafile namaz','Bayram namazı','Cenaze namazı'),
    q('Ramazan gecelerinde cemaatle kılınan namaz hangisidir?','Teravih namazı','Cuma namazı','Sabah namazı','Bayram namazı'),
    q('Bir kişi Allah’a yakınlaşmak amacıyla zorunlu olmadığı hâlde namaz kılıyor. Bu namazın türü nedir?','Nafile','Farz','Vacip','Cuma'),
    q('Cuma namazının topluca kılınması hangi yönü de güçlendirir?','Birlik ve beraberliği','Yalnız kalmayı','Zamanı önemsememeyi','Temizlikten uzaklaşmayı'),
    q('Namaz vakitlerine dikkat eden öğrenci hangi becerisini geliştirir?','Zamanı planlama ve sorumluluk','Plansız davranma','Gösteriş yapma','Başkalarını küçümseme')], [
    q('Farz ile nafile namaz arasındaki temel fark hangisidir?','Farz yapılması kesin emredilen, nafile isteğe bağlı ibadettir','İkisi tamamen aynıdır','Nafile yalnız cuma günü kılınır','Farz yalnız bayramlarda kılınır'),
    q('Aşağıdakilerden hangisi namazın amacıyla bağdaşmaz?','İnsanlara gösteriş yapmak','Allah’a kulluk etmek','Allah’ı anmak','Manevi bağı güçlendirmek'),
    q('Beş vakit namazın gün içine yayılması hangi sonucu destekler?','İbadetin düzenli biçimde sürdürülmesini','İbadetin yılda bir yapılmasını','Vakitlerin önemsiz olmasını','Sorumluluğun azalmasını'),
    q('Bayram namazı ile teravih namazının ortak özelliği hangisidir?','Belirli zamanlarla ilişkili olmaları','Her ikisinin beş vakit farz olması','Yalnız evde kılınmaları','Aynı günde kılınmaları'),
    q('Namaz çeşitlerini öğrenirken en doğru sınıflama hangisidir?','Farz, vacip ve nafile oluşlarına göre ayırmak','Uzun ve kısa adlarına göre ayırmak','Yalnız kılındıkları binaya göre ayırmak','Kişilerin yaşına göre ayırmak')]),
  p('Namazın hazırlık ve kılınış şartlarını, temel hareket ve kavramları doğru sırayla açıklar.',[
    q('Namaza başlamadan önce beden, elbise ve yerin temiz olması hangi hazırlığı gösterir?','Necasetten taharet','Kıyam','Rükû','Kıraat'),
    q('Su bulunmadığında veya kullanılamadığında yapılan temizlik hangisidir?','Teyemmüm','Gusül','Kıraat','Tesbih'),
    q('Namazda ayakta durmaya ne ad verilir?','Kıyam','Kade-i ahire','Secde','Rükû'),
    q('Kıyamdan sonra öne eğilme hareketi hangisidir?','Rükû','Secde','Niyet','Selam'),
    q('Namazın sonunda sağa ve sola selam vermeden önceki oturuş hangisidir?','Kade-i ahire','İftitah tekbiri','Kıyam','Kıraat')], [
    q('Aşağıdaki sıralamalardan hangisi namazın hareketlerine uygundur?','Kıyam — rükû — secde','Secde — niyet — abdest','Rükû — kıble — vakit','Selam — kıyam — niyet'),
    q('Abdest ile kıble arasındaki fark hangisidir?','Abdest temizlik hazırlığı, kıble yön şartıdır','İkisi de namazın hareketidir','Kıble suyla yapılan temizliktir','Abdest yönelmeyi anlatır'),
    q('Namaz vaktinden önce kılınırsa hangi şart eksik kalır?','Vakit','Kıraat','Secde','Selam'),
    q('“Niyet yalnızca söylenen bir cümledir, kalbin yönelişi önemli değildir.” sözü neden eksiktir?','Niyet kişinin hangi ibadeti yapacağını bilinçli olarak belirlemesidir','Niyet namazdan sonra yapılır','Niyet yalnız temizliktir','Niyet kıbleyi değiştirir'),
    q('Hazırlık şartları ile kılınış şartlarını ayırmanın yararı nedir?','Namazdan önce ve namaz sırasında gerekenleri doğru uygulamayı sağlar','Bütün şartları gereksiz kılar','Sıralamayı önemsizleştirir','Yalnız kavram ezberletir')]),
  p('Namazın temizlik, düzen, sorumluluk, sabır ve birlik bilincine katkısını günlük yaşamla ilişkilendirir.',[
    q('Namaz vakitlerini takip eden bir öğrencinin hangi alışkanlığı güçlenir?','Düzenli olma','Erteleme','Dağınıklık','Sözünde durmama'),
    q('Cemaatle namaz kılmak hangi sosyal değeri destekler?','Birlik ve beraberlik','Bencillik','Yalnızlık','Ayrımcılık'),
    q('Namaz öncesi temizliğe dikkat etmek günlük hayatta hangi davranışa dönüşebilir?','Bedenini ve çevresini temiz tutmaya','Suyu gereksiz kullanmaya','Eşyaları kirli bırakmaya','Sağlığı önemsememeye'),
    q('Namazda aynı hareketleri dikkatle sürdürmek hangi özelliği geliştirir?','Sabır ve öz denetim','Acelecilik','Dikkatsizlik','Savurganlık'),
    q('Namazın kötülükten uzaklaştırması en çok hangi davranışta görülür?','Haksızlık yapmaktan kaçınmada','Başkasının hakkını almada','Yalan söylemede','Sorumluluktan kaçmada')], [
    q('Namaz kıldığı hâlde arkadaşlarına sürekli haksızlık yapan biri hangi yönü eksik bırakmıştır?','İbadetin güzel davranışa yansımasını','Namazın vaktini bilmeyi','Kıble yönünü öğrenmeyi','Namaz adını söylemeyi'),
    q('Namazın bireysel ve toplumsal kazanımı birlikte hangi seçenekte verilmiştir?','Öz disiplin ve birlik duygusu','Dağınıklık ve ayrılık','Gösteriş ve üstünlük','İsraf ve acelecilik'),
    q('İbadette devamlılığın sorumluluk bilincini geliştirmesinin nedeni nedir?','Kişinin görevini düzenli biçimde yerine getirmesi','Görevi yalnız başkalarına bırakması','Zamanı hiç planlamaması','Davranışlarını değerlendirmemesi'),
    q('Namazın insana kazandırdıkları nasıl değerlendirilmelidir?','İbadet ile günlük davranışlar arasındaki ilişkiye bakılarak','Yalnız hareketlerin adı sayılarak','Başkalarının hataları aranarak','Sadece namazın süresi ölçülerek'),
    q('Aşağıdakilerden hangisi namazın kazandırdığı değerlerle çelişir?','Başkalarının hakkını önemsememek','Temizliğe özen göstermek','Zamanı planlamak','Sabırlı davranmak')]),
  p('Tahiyyat duasının okunuşunu, anlamını ve namazdaki yerini yorumlar.',[
    q('Tahiyyat duasındaki selam ifadesi hangi değeri hatırlatır?','Barış ve esenlik dilemeyi','Kırıcı konuşmayı','İsraf etmeyi','Yalnız kalmayı'),
    q('Duanın anlamını bilen öğrenci Hz. Peygamber’e selam verirken neyi kavrar?','Ona duyulan sevgi ve saygıyı','Onu ilah kabul etmeyi','Namazın gereksizliğini','Selamın yalnız insanlara ait olduğunu'),
    q('Tahiyyatta Allah’tan başka ilah olmadığına şahitlik etmek hangi inançla ilişkilidir?','Tevhit','Şirk','İsraf','Mimari'),
    q('Tahiyyat duasının hem okunuşunu hem anlamını öğrenmek ne sağlar?','Bilinçli dua etmeyi','Sözcükleri anlamsız tekrarlamayı','Namazı bırakmayı','Duanın yerini değiştirmeyi'),
    q('Dua namazın hangi durumunda okunur?','Oturuşta','Rükûda','Ayakta tekbirden önce','Abdest alırken')], [
    q('Tahiyyat duasında Allah’a, Peygamber’e ve iyi kullara yönelen ifadelerin ortak yönü nedir?','Saygı, selam ve kulluk bilincini güçlendirmesi','Maddi kazancı artırması','Mimariyi öğretmesi','Yemek adabını açıklaması'),
    q('“Tahiyyat yalnız ezberlenmeli, anlamı gereksizdir.” sözü neden eksiktir?','Anlamını bilmek duayı bilinçli okumayı sağlar','Dua hiçbir anlam taşımaz','Namazda dua okunmaz','Ezber her zaman yanlıştır'),
    q('Duanın şehadet bölümünden hangi sonuç çıkarılır?','Allah’ın birliği ve Hz. Muhammed’in elçiliği kabul edilir','Birden çok ilah kabul edilir','Peygamberlik reddedilir','Yalnız dünya hayatı önemsenir'),
    q('Tahiyyat duası ile namaz arasındaki ilişki hangisidir?','Dua namazın oturuş bölümünde okunur','Dua yalnız bayramlarda okunur','Dua abdestin yerine geçer','Aralarında ilişki yoktur'),
    q('Aşağıdakilerden hangisi Tahiyyat duasının mesajıyla bağdaşmaz?','İnsanlara üstünlük taslamak','Allah’a kulluk etmek','Hz. Peygamber’e selam vermek','İyi kullara esenlik dilemek')]),
  p('Kur’an-ı Kerim’in ayet, sure ve cüzlerden oluşan iç düzenini çözümler.',[
    q('Bir öğrenci Kur’an’da belirli bir bölümü bulmak için sure adı ve ayet numarasına bakıyor. Bu neyi gösterir?','Kur’an’ın düzenli bir iç yapısı olduğunu','Kur’an’da bölüm bulunmadığını','Ayetlerin sırasız olduğunu','Surelerin isim taşımadığını'),
    q('Yirmi sayfalık bölümlere yaklaşık olarak ayrılan kısım hangi kavramdır?','Cüz','Ayet','Sure','Meal'),
    q('Bir surenin içindeki numaralı cümle birimlerine ne denir?','Ayet','Cüz','Hatim','Tefsir'),
    q('Fatiha ile Nas arasındaki sureler neye göre sıralanmıştır?','Kur’an’daki yerleşik sıraya göre','Alfabetik sıraya göre','Yazıldıkları kalem rengine göre','Okuyanın yaşına göre'),
    q('Kur’an’dan bir yer bulurken “2. sure, 255. ayet” bilgisi hangi iki birimi kullanır?','Sure ve ayet','Cüz ve meal','Hatim ve tefsir','Sayfa ve kapak')], [
    q('Sure ile ayet arasındaki ilişki hangisidir?','Sureler ayetlerden oluşur','Ayetler cüzlerden oluşur','Sureler yalnız bir sözcüktür','Aralarında yapısal ilişki yoktur'),
    q('Cüzlerin oluşturulmasının temel yararı nedir?','Okuma ve takip etmeyi kolaylaştırmak','Ayetlerin anlamını değiştirmek','Sureleri silmek','Kur’an’a yeni ayet eklemek'),
    q('“Her sure aynı sayıda ayetten oluşur.” sözü neden yanlıştır?','Surelerin ayet sayıları farklıdır','Kur’an’da hiç sure yoktur','Bütün ayetler aynı sözcüktür','Cüzler surelerden küçüktür'),
    q('Kur’an’ın iç düzenini bilmek hangi beceriyi geliştirir?','Aranan sure ve ayeti doğru bulmayı','Metni değiştirmeyi','Ayetleri karıştırmayı','Kaynak göstermemeyi'),
    q('Aşağıdaki sıralamalardan hangisi küçükten büyüğe yapısal ilişkiyi doğru verir?','Ayet — sure — Kur’an-ı Kerim','Sure — ayet — harf','Cüz — ayet — sözcük','Kur’an — sure — ayet')]),
  p('Kur’an-ı Kerim’in vahiy, rehberlik, korunmuşluk ve evrensellik özelliklerini açıklar.',[
    q('Bir öğrenci karar verirken Kur’an’ın öğütlerinden yararlanıyor. Bu hangi özelliği gösterir?','Rehberlik etmesini','Yalnız tarih kitabı olmasını','Sadece bir bölgeye seslenmesini','İnsan sözü olmasını'),
    q('Kur’an’ın Hz. Muhammed’e Allah tarafından bildirilmesi hangi kavramla açıklanır?','Vahiy','Meal','Mimari','Cüz'),
    q('Kur’an mesajlarının bütün insanlara yönelik olması hangi özelliktir?','Evrensellik','Yerellik','Geçicilik','Gizlilik'),
    q('Kur’an’ın anlamını Türkçe okumaya ne denir?','Meal','Ayet','Sure','Hatim'),
    q('Kur’an’ı saygıyla okuyup anlamaya çalışmak hangi yaklaşımı gösterir?','Onu rehber edinmeyi','Anlamını önemsememeyi','Yalnız süs eşyası saymayı','Mesajlarını değiştirmeyi')], [
    q('Vahiy ile meal arasındaki fark hangisidir?','Vahiy Allah’ın bildirimi, meal anlamın başka dile aktarımıdır','İkisi de cüz demektir','Meal peygambere gelen vahiydir','Vahiy yalnız yorum kitabıdır'),
    q('Kur’an’ın korunmuş olması neyi ifade eder?','Asıl metninin bozulmadan günümüze ulaşmasını','Her okuyanın metni değiştirmesini','Yalnız ilk dönemde geçerli olmasını','Ayetlerin kaybolmasını'),
    q('“Kur’an yalnız geçmiş insanlara hitap eder.” sözü hangi özellikle çelişir?','Evrenselliğiyle','Arapça indirilmesiyle','Surelerden oluşmasıyla','Sayfalara yazılmasıyla'),
    q('Kur’an’ın temel özelliklerini öğrenmenin amacı nedir?','Onun kaynağını, yapısını ve rehberliğini doğru anlamak','Yalnız sayfa sayısını ezberlemek','Mesajlarını günlük hayattan ayırmak','Başka metinlerle karıştırmak'),
    q('Aşağıdakilerden hangisi Kur’an’ın temel özelliği değildir?','İnsanlar tarafından değiştirilmiş olması','Allah’ın vahyi olması','İnsanlara rehberlik etmesi','Evrensel mesajlar içermesi')]),
  p('Kur’an’ın inanç, ibadet, ahlak, sosyal hayat ve kıssa konularını ayetlerle ilişkilendirir.',[
    q('“Anne babaya iyi davranın.” anlamındaki bir ayet en çok hangi ana konuyla ilişkilidir?','Ahlak ve sosyal hayat','Yalnız mimari','Spor','Coğrafya'),
    q('Namaz kılmayı emreden bir ayet hangi ana konuya girer?','İbadet','Kıssa','Mimari','Ticaret'),
    q('Allah’ın birliğini anlatan ayetler hangi ana konudadır?','İnanç','Sosyal hayat','Sanat','Temizlik'),
    q('Geçmiş peygamberlerin mücadelelerini anlatan bölümler hangi başlıkta değerlendirilir?','Kıssalar','İbadet araçları','Mimari motifler','Dil bilgisi'),
    q('Adaletli alışverişi öğütleyen ayet hangi iki alanla ilişkilendirilebilir?','Ahlak ve sosyal hayat','Yalnız kıssa ve mimari','Yalnız sure adı','Yalnız cüz sayısı')], [
    q('Kur’an’ın ana konularını kesin çizgilerle tamamen ayırmak neden her zaman mümkün değildir?','Bir ayet birden fazla konuyla ilişkili mesaj taşıyabilir','Ayetlerin hiçbir anlamı yoktur','Bütün ayetler yalnız kıssadır','Konular metinde bulunmaz'),
    q('İnanç ile ibadet arasındaki ilişki hangisidir?','İnanç ibadete yön verir, ibadet inancı davranışa yansıtır','Birbirleriyle ilgisizdir','İbadet yalnız mimaridir','İnanç yalnız tarih bilgisidir'),
    q('Kıssaların Kur’an’daki amacı yalnız geçmişi bildirmek değildir. Başka hangi amaç öne çıkar?','İnsanların olaylardan ders almasını sağlamak','Tarihleri ezberletmek','Masal anlatmak','Kişileri yarıştırmak'),
    q('Sosyal hayat konuları en çok neyi düzenler?','İnsanların birbirleriyle hak ve sorumluluk ilişkilerini','Gezegenlerin hareketini','Surelerin sayfa düzenini','Cami bölümlerini'),
    q('Aşağıdakilerden hangisi Kur’an’ın ana konularından biri değildir?','Rastgele eğlence kuralları','İnanç','İbadet','Ahlak')]),
  p('Kevser suresinin okunuşunu, anlamını; nimet, şükür, namaz ve paylaşma mesajlarını yorumlar.',[
    q('Kevser suresinde verilen nimetlere karşı hangi davranış öğütlenir?','Namaz kılmak ve Allah’a yönelmek','Nimetleri küçümsemek','Yalnız kendini düşünmek','Şükretmemek'),
    q('Bir öğrenci sahip olduğu imkânları başkalarıyla paylaşıyor. Bu davranış surenin hangi mesajıyla uyumludur?','Nimete şükür ve paylaşma','İsraf','Kibir','Nankörlük'),
    q('Kevser kelimesi hangi anlamla ilişkilidir?','Bol nimet ve hayır','Kıtlık ve yokluk','Yalnızlık','Korku'),
    q('Sureyi okurken anlamını da düşünmek öğrenciye ne kazandırır?','Nimetlerin değerini fark etmeyi','Nimetleri yalnız kendine ayırmayı','Namazı önemsiz görmeyi','Şükrü terk etmeyi'),
    q('Allah için kurban kesme ifadesi hangi ilkeyi vurgular?','İbadetin yalnız Allah için yapılmasını','Gösterişi','Birden çok ilaha yönelmeyi','Nimetleri inkâr etmeyi')], [
    q('Kevser suresinde nimet ile ibadet arasında nasıl bir ilişki kurulur?','Nimete karşı şükür, namaz ve kullukla gösterilir','Nimet ibadeti gereksiz kılar','İbadet yalnız zor zamanda yapılır','Nimetler paylaşılmamalıdır'),
    q('“Çok nimeti olan kişi şükretmek zorunda değildir.” sözü neden yanlıştır?','Nimetler şükür ve sorumluluk gerektirir','Şükür yalnız yoksullara aittir','Nimetin Allah’la ilgisi yoktur','Sure şükrü yasaklar'),
    q('Surenin ana mesajını en iyi özetleyen ifade hangisidir?','Allah’ın nimetlerini fark et, şükret ve yalnız O’na kulluk et','Yalnız maddi zenginlik önemlidir','Başkalarını küçümse','İbadeti insanların beğenisi için yap'),
    q('Kevser suresiyle İhlas suresinin ortak yönü hangisidir?','İbadetin ve yönelişin Allah’a ait olduğunu vurgulamaları','İkisinin de mimariyi anlatması','Ayet sayılarının aynı olması','Aynı olay üzerine inmeleri'),
    q('Aşağıdakilerden hangisi surenin mesajıyla çelişir?','Nimetleri israf etmek','Şükretmek','Namaz kılmak','Paylaşmaya önem vermek')]),
  p('Peygamberlerin vahiy alma, tebliğ, örneklik ve rehberlik görevlerini naklî delillerle açıklar.',[
    q('Bir peygamber Allah’tan aldığı mesajı insanlara eksiksiz iletiyor. Bu görev hangisidir?','Tebliğ','Mimari','Ticaret','Seyahat'),
    q('Peygamberlerin doğru sözlü olması hangi sıfatla ifade edilir?','Sıdk','Emanet','Fetanet','İsmet'),
    q('Peygamberlerin güvenilir olması hangi sıfattır?','Emanet','Sıdk','Tebliğ','Fetanet'),
    q('Peygamberlerin akıllı ve anlayışlı olması hangi sıfatla anlatılır?','Fetanet','İsmet','Emanet','Sıdk'),
    q('İnsanların peygamberleri örnek alabilmesi neden mümkündür?','Peygamberler de insan olarak yaşamış ve güzel davranış göstermiştir','Peygamberler hiç toplum içinde yaşamamıştır','Peygamberlerin görevi yalnız mucize göstermektir','Peygamberler insanlara mesaj iletmemiştir')], [
    q('Vahiy ile tebliğ arasındaki ilişki hangisidir?','Peygamber vahyi alır ve insanlara tebliğ eder','Vahyi insanlar peygambere öğretir','Tebliğ vahyi gizlemektir','Aralarında ilişki yoktur'),
    q('Peygamberlerin ortak amacı nedir?','İnsanları Allah’ın mesajına ve doğru yaşama çağırmak','Kendilerine ibadet ettirmek','Maddi üstünlük kurmak','Toplumdan uzaklaşmak'),
    q('Ülülazm peygamberlerin ayırt edici yönü hangisidir?','Büyük zorluklar karşısında sabır ve kararlılık göstermeleri','Hiç zorluk yaşamamaları','Yalnız bir kişiye seslenmeleri','Vahiy almamaları'),
    q('“Peygamberler mesajı istedikleri gibi değiştirebilir.” sözü hangi özellikle çelişir?','Tebliğ görevini güvenilir biçimde yapmalarıyla','İnsan olmalarıyla','Toplumda yaşamalarıyla','Meslek sahibi olmalarıyla'),
    q('Aşağıdakilerden hangisi peygamberlerin görevi değildir?','İnsanları kendilerine kulluk etmeye çağırmak','Allah’ın mesajını iletmek','Güzel davranışlarıyla örnek olmak','İnsanlara rehberlik etmek')]),
  p('Peygamber kıssalarındaki sabır, tevhit, adalet ve mücadele örneklerinden güncel öğütler çıkarır.',[
    q('Hz. Nuh’un uzun süre insanları doğruya çağırması hangi değeri gösterir?','Sabır ve kararlılık','Umutsuzluk','Kibir','İsraf'),
    q('Hz. İbrahim’in putlara karşı çıkması hangi inancı savunduğunu gösterir?','Tevhit','Şirk','Gösteriş','Soy üstünlüğü'),
    q('Hz. Musa’nın Firavun’a karşı duruşu hangi değeri öne çıkarır?','Haksızlığa karşı cesaret ve adalet','Güçlüye koşulsuz boyun eğme','İnsanları küçümseme','Sorumluluktan kaçma'),
    q('Hz. Yusuf’un kendisine kötülük yapan kardeşlerini affetmesi hangi değerdir?','Bağışlayıcılık','İntikam','Kibir','Ayrımcılık'),
    q('Bir öğrenci zor bir görevde vazgeçmeyip doğru yöntemlerle çalışıyor. Hangi kıssa mesajını uygulamaktadır?','Sabırla mücadele etmeyi','Haksızlık karşısında susmayı','Başkalarını küçümsemeyi','Sorumluluğu terk etmeyi')], [
    q('Peygamber kıssalarını öğrenmenin temel amacı nedir?','Olaylardan inanç ve davranış dersleri çıkarmak','Yalnız isim ve tarih ezberlemek','Kıssaları masal saymak','Geçmişi küçümsemek'),
    q('Farklı peygamber kıssalarının ortak mesajı hangisidir?','Allah’a güvenip doğru ve adaletli yaşamaya çalışmak','Her durumda güçlüden yana olmak','Yalnız maddi başarıyı önemsemek','Toplumdan uzak durmak'),
    q('Kıssadaki bir davranışı bugünkü bir sorunla ilişkilendirmek hangi beceridir?','Öğüdü yeni bir duruma uygulamak','Metni anlamadan ezberlemek','Olay sırasını karıştırmak','Kaynağı yok saymak'),
    q('“Kıssalar yalnız geçmişte kaldığı için bugün ders vermez.” sözü neden yanlıştır?','Kıssalardaki değerler güncel davranışlara rehber olabilir','Geçmişte hiç insan yaşamamıştır','Kıssalar yalnız tarih verir','Değerler zamanla tamamen yok olur'),
    q('Aşağıdakilerden hangisi peygamber kıssalarından çıkarılamaz?','Haksızlık karşısında her zaman sessiz kalmak','Zorlukta sabırlı olmak','Tevhit inancını savunmak','Doğruluktan vazgeçmemek')]),
  p('Kureyş suresinin okunuşunu, anlamını; güvenlik, rızık, şükür ve kulluk mesajlarını yorumlar.',[
    q('Kureyşlilerin yaz ve kış yolculuklarını güvenle yapması hangi nimeti gösterir?','Güvenlik ve geçim imkânını','Yalnız mimariyi','Su israfını','Yalnızlığı'),
    q('Surede “Bu evin Rabbine kulluk etsinler.” ifadesindeki ev hangisidir?','Kâbe','Mescid-i Aksa','Bir okul','Bir saray'),
    q('Açlıktan doyurulmak hangi temel ihtiyacın karşılanmasıdır?','Beslenme','Barınma','Eğitim','Ulaşım'),
    q('Korkudan güvene kavuşmak insana hangi sorumluluğu hatırlatır?','Nimeti verene şükretmeyi','Güveni kötüye kullanmayı','Başkalarını korkutmayı','İbadeti terk etmeyi'),
    q('Duru güvenli okul ortamının ve yiyeceklerinin değerini fark ediyor. Bu farkındalık hangi davranışa dönüşmelidir?','Şükür ve paylaşmaya','İsrafa','Kibre','Nankörlüğe')], [
    q('Surede rızık ve güvenliğin birlikte anılması neyi gösterir?','İnsanın maddi ve manevi güven ihtiyaçlarının önemini','Yalnız ticaretin ibadet olduğunu','Korkunun yararlı olduğunu','Nimetlerin sorumluluk doğurmadığını'),
    q('Kureyş suresinin ana mesajı hangisidir?','Nimetleri veren Allah’a kulluk etmek','Yolculuğu tamamen bırakmak','Yalnız Kureyş kabilesini övmek','Ticareti ibadetin yerine koymak'),
    q('“Güvenlik insanın çabasıyla oluşur, şükür gerekmez.” sözü surenin hangi mesajını eksik bırakır?','Nimetlerin Allah’tan geldiğini fark etmeyi','Yolculukların iki mevsimde yapılmasını','Kureyş adını bilmeyi','Kâbe’nin Mekke’de olmasını'),
    q('Kevser ve Kureyş surelerinin ortak yönü nedir?','Nimetlere karşı Allah’a şükür ve kulluğu vurgulamaları','Aynı sayıda ayet içermeleri','Aynı topluluğu anlatmaları','Yalnız tarih bilgisi vermeleri'),
    q('Aşağıdakilerden hangisi Kureyş suresinin mesajıyla çelişir?','Nimetleri yalnız kendinden bilmek','Güven için şükretmek','Rızkın değerini bilmek','Allah’a kulluk etmek')]),
  p('Dinin Türk-İslam mimarisine etkisini yapı, süsleme, hat ve işlev ilişkisiyle çözümler.',[
    q('Bir caminin duvarında ayetlerin güzel yazıyla işlenmesi hangi sanatla ilgilidir?','Hat sanatı','Heykel','Fotoğraf','Tiyatro'),
    q('Cami, medrese ve çeşmenin aynı külliyede bulunması neyi gösterir?','Dinî yapıların toplumun farklı ihtiyaçlarına hizmet ettiğini','Yapıların yalnız süs için olduğunu','Mimarinin toplumla ilgisiz olduğunu','Her yapının aynı görevi yaptığını'),
    q('Geometrik motiflerin mimaride kullanılması hangi iki alanın birleşimidir?','Sanat ve dinî kültürün','Spor ve ticaretin','Ulaşım ve tarımın','Yalnız teknolojinin'),
    q('Bir tarihî camiyi korumak hangi sorumluluğa örnektir?','Kültürel mirası gelecek kuşaklara aktarmaya','Eski yapıları yok etmeye','Sanatı değersiz görmeye','Toplumsal hafızayı silmeye'),
    q('Mimari bir yapıyı incelerken yalnız görünüşüne değil kullanım amacına da bakmak neden önemlidir?','Biçim ile işlev arasındaki ilişkiyi anlamak için','Yapının tarihini unutmak için','Bütün yapıları aynı sanmak için','Süslemeleri yok saymak için')], [
    q('Din ile mimari arasındaki ilişki hangisidir?','İnanç ve ihtiyaçlar yapıların biçim ve işlevini etkiler','Mimari dinden hiç etkilenmez','Din yalnız yapıların rengini belirler','Her dinî yapı aynı görünür'),
    q('Hat sanatında insan ve hayvan figürleri yerine yazı ve motiflerin öne çıkması neyi gösterir?','Dinî estetik anlayışın sanata yansımasını','Yazının işlevsiz olduğunu','Mimaride anlam bulunmadığını','Süslemenin yasak olduğunu'),
    q('Külliye ile tek bir cami arasındaki fark nedir?','Külliye cami çevresinde farklı hizmet yapıları içeren bütündür','Külliye yalnız minaredir','Cami her zaman külliyeden büyüktür','Aralarında hiçbir fark yoktur'),
    q('Bir yapının dinî motif taşıması için hangisi yeterli değildir?','Yalnız eski olması','İbadet veya dinî kültürle ilişkili işlevi','Hat ve geometrik süslemeler taşıması','Kültürel değerleri yansıtması'),
    q('Mimaride dinî etkiyi çözümlemek için hangi kanıtlar birlikte incelenmelidir?','Yapının işlevi, bölümleri ve süslemeleri','Yalnız kapısının rengi','Yalnız yüksekliği','Sadece çevresindeki trafik')]),
  p('Caminin mihrap, minber, minare, şadırvan ve mahfil gibi bölümlerini işlevleriyle sınıflandırır.',[
    q('Camiye giren biri kıble yönünü bulmak için hangi bölüme bakar?','Mihrap','Minber','Şadırvan','Minare'),
    q('Cuma hutbesi okunurken imam hangi bölüme çıkar?','Minber','Mihrap','Şadırvan','Avlu'),
    q('Ezanın uzaklardan duyulmasına yardımcı olan yüksek yapı hangisidir?','Minare','Mihrap','Minber','Mahfil'),
    q('Namaz öncesinde abdest almak isteyen kişi hangi bölümü kullanabilir?','Şadırvan','Minber','Mihrap','Kubbe'),
    q('Müezzin mahfili hangi görevliyle ilişkilidir?','Müezzin','Mimar','Hattat','Yolcu')], [
    q('Mihrap ile minber arasındaki temel fark nedir?','Mihrap kıbleyi gösterir, minber hutbe için kullanılır','İkisi de ezan okumak içindir','Mihrap abdest, minber namaz yönüdür','Aralarında işlev farkı yoktur'),
    q('Cami bölümlerini “ibadet, duyuru ve temizlik” diye sınıflandırırsak minare hangi gruptadır?','Duyuru','Temizlik','Yemek','Eğitim'),
    q('“Şadırvan hutbe okumak için kullanılır.” bilgisinin doğru düzeltmesi hangisidir?','Şadırvan abdest almak için kullanılır','Şadırvan kıbleyi gösterir','Şadırvan ezan okunacak kuledir','Şadırvan imamın namaz kıldırdığı yerdir'),
    q('Kubbenin cami mimarisindeki işlevlerinden biri hangisidir?','Geniş ibadet alanını örtmek ve mekân bütünlüğü sağlamak','Abdest suyu depolamak','Hutbe okumak','Kıble yönünü göstermek'),
    q('Cami bölümlerini işlevleriyle öğrenmek ne sağlar?','Yapıyı bilinçli tanımayı ve doğru kullanmayı','Bütün bölümleri aynı sanmayı','Tarihî yapıları küçümsemeyi','Mimarinin işlevini reddetmeyi')]),
  p('Selimiye, Süleymaniye ve farklı cami örneklerini dönem, mimar, şehir ve özellikleri bakımından karşılaştırır.',[
    q('Edirne’ye giden bir öğrenci Mimar Sinan’ın ustalık eserini görmek istiyor. Hangi camiyi ziyaret etmelidir?','Selimiye Camii','Süleymaniye Camii','Ulu Cami','Sultanahmet Camii'),
    q('Süleymaniye Camii hangi şehirde bulunur?','İstanbul','Edirne','Bursa','Konya'),
    q('Farklı şehirlerdeki camilerin malzeme ve süslemelerinin değişmesi neyi gösterir?','Yerel kültür ve imkânların mimariye yansıdığını','Bütün camilerin aynı olduğunu','Mimarinin tarihle ilgisiz olduğunu','Süslemenin işlevsiz olduğunu'),
    q('Bir camiyi tanıtırken şehir, mimar ve dönem bilgisini vermek neden önemlidir?','Yapıyı tarihî bağlamı içinde anlamak için','Yalnız adını uzatmak için','İbadet işlevini yok saymak için','Bütün eserleri tek kişiye bağlamak için'),
    q('Tarihî camilerin bakımında özgün malzemeyi korumak hangi ilkeye uygundur?','Kültürel mirası aslına uygun yaşatmaya','Yapıyı tamamen değiştirmeye','Tarihî izleri silmeye','Eseri başka şehre taşımaya')], [
    q('Selimiye ile Süleymaniye’nin ortak yönü hangisidir?','Mimar Sinan’la ilişkili önemli Osmanlı eserleri olmaları','Aynı şehirde bulunmaları','Aynı tarihte yapılmaları','Yalnız ahşaptan yapılmaları'),
    q('Cami örneklerini karşılaştırırken hangi ölçüt uygun değildir?','Hangisinin fotoğrafta daha parlak çıktığı','Bulunduğu şehir','Yapıldığı dönem','Mimari özellikleri'),
    q('Mimar Sinan’ın farklı eserlerini incelemek hangi sonuca ulaştırır?','Mimari bilgi ve estetiğin zaman içinde gelişebildiğine','Bütün eserlerin birbirinin kopyası olduğuna','Mimarlığın öğrenilemeyeceğine','Tarihî yapıların değersiz olduğuna'),
    q('Bir caminin yalnız adını ezberlemek yerine görselini ve planını incelemek ne kazandırır?','Mimari özellikleri ayırt etme becerisi','Eserleri karıştırma','Tarih bilgisini azaltma','İşlevleri yok sayma'),
    q('Kültürümüzdeki cami örneklerinin korunması neden toplumsal bir sorumluluktur?','Ortak tarih ve sanat birikimini gelecek kuşaklara taşıdığı için','Yalnız turist sayısını artırdığı için','Yeni yapı yapılmasını engellemek için','Bütün şehirleri aynılaştırmak için')])
];

const hayat=[
  p('Peygamberimizin doğduğu çevrenin coğrafi, dinî, sosyal ve ekonomik özelliklerini; Fil Vakası ve cahiliye kavramıyla ilişkilendirir.',[
    q('Mekke’nin ticaret yolları üzerinde ve Kâbe’nin bulunduğu şehir olması hangi sonucu doğurmuştur?','Dinî ve ticari canlılık kazanmasını','Tamamen ıssız kalmasını','Tarım merkezi olmasını','Deniz limanı olmasını'),
    q('Ebrehe’nin Kâbe’ye saldırma girişimi hangi olay adıyla bilinir?','Fil Vakası','Hicret','Bedir Savaşı','Veda Haccı'),
    q('Cahiliye Dönemi’nde soy üstünlüğüne göre davranmak hangi değerle çelişir?','Adalet','Misafirperverlik','Çalışkanlık','Temizlik'),
    q('Hicaz bölgesindeki üç önemli şehir hangileridir?','Mekke, Medine ve Taif','Mekke, Şam ve Kudüs','Medine, Bağdat ve Basra','Taif, Kahire ve Şam'),
    q('Kâbe’nin varlığı Mekke’de hangi iki alanı özellikle etkilemiştir?','Dinî hayat ve ticareti','Tarım ve denizciliği','Madencilik ve sanayiyi','Ormancılık ve balıkçılığı')], [
    q('“Cahiliye” yalnız okuma yazma bilmemek demektir.” sözü neden eksiktir?','Kavram haksızlık, putperestlik ve kötü toplumsal uygulamaları da anlatır','Cahiliye yalnız bir şehir adıdır','Kavram yalnız ticareti anlatır','Cahiliye İslam’dan sonraki dönemdir'),
    q('Fil Vakası’ndan çıkarılabilecek ahlaki ders hangisidir?','Güç ve kibir insanı haklı yapmaz','Güçlü olan her istediğini yapabilir','Kutsal değerlere zarar vermek doğrudur','Haksızlık karşısında sessiz kalınmalıdır'),
    q('Mekke’nin çevresini anlamak Peygamberimizin hayatını öğrenmeye nasıl katkı sağlar?','Olayların gerçekleştiği şartları ve toplumu anlamayı sağlar','Doğum tarihini gereksiz kılar','Bütün olayları aynı sanmayı sağlar','Coğrafyanın önemsiz olduğunu gösterir'),
    q('Cahiliye toplumundaki olumlu ve olumsuz özellikleri birlikte incelemek neden önemlidir?','Dönemi tek yönlü değil dengeli değerlendirmek için','Bütün insanları kötü saymak için','Olumsuzlukları gizlemek için','Geçmişi yüceltmek için'),
    q('Aşağıdakilerden hangisi Peygamberimizin doğduğu çevrenin özelliği değildir?','Mekke’nin büyük bir deniz limanı olması','Kâbe’nin Mekke’de bulunması','Panayır ve ticaretin canlı olması','Putperestliğin yaygın olması')]),
  p('Peygamberimizin doğumu, ailesi, isimleri ve sütannelik geleneği hakkındaki bilgileri ilişkilendirir.',[
    q('Hz. Muhammed’in doğmadan önce babasını kaybetmiş olması hangi durumu ifade eder?','Yetim doğmasını','Öksüz doğmasını','Süt kardeşi olmasını','Hicret etmesini'),
    q('Abdülmuttalib’in torununa Muhammed adını vermesi ailedeki hangi bağla ilgilidir?','Dede-torun ilişkisiyle','Amca-yeğen ilişkisiyle','Süt kardeşliğiyle','Komşulukla'),
    q('Bebeklerin çöl ortamında sütanneye verilmesinin temel nedenlerinden biri neydi?','Daha sağlıklı ortamda ve düzgün Arapçayla büyümeleri','Ticaret öğrenmeleri','Savaş eğitimi almaları','Mekke’den tamamen kopmaları'),
    q('Süveybe ile Halime Hatun’un ortak özelliği nedir?','Peygamberimizi bir süre emzirmiş olmaları','Peygamberimizin halaları olmaları','Mekke yöneticisi olmaları','Aynı kişi olmaları'),
    q('Peygamberimizin doğduğu yılın Fil Yılı diye anılması hangi olayla bağlantılıdır?','Ebrehe’nin Kâbe’ye saldırısıyla','Hicretle','İlk vahiy ile','Veda Haccı ile')], [
    q('Âmine, Abdullah ve Abdülmuttalib isimleri hangi sırayla aile bağını gösterir?','Anne, baba, dede','Sütanne, amca, dede','Anne, dede, baba','Hala, baba, amca'),
    q('Peygamberimizin doğumu anlatılırken tarih ve aile bilgisinin birlikte verilmesi ne sağlar?','Hayatının başlangıcını bağlam içinde anlamayı','Aile bağlarını karıştırmayı','Doğum yerini önemsizleştirmeyi','Olayları sırasız öğrenmeyi'),
    q('“Peygamberimizin babası onu büyütmüştür.” ifadesinin doğru düzeltmesi hangisidir?','Babası Abdullah o doğmadan önce vefat etmiştir','Babası Ebu Talib’dir','Babası Abdülmuttalib’dir','Babası Halime Hatun’dur'),
    q('Mevlit kavramı bu konuda neyi ifade eder?','Peygamberimizin doğumunu','Mekke’den Medine’ye göçü','İlk vahyi','Bir savaşı'),
    q('Aşağıdakilerden hangisi Peygamberimizin doğumuyla ilgili doğru bilgi değildir?','Medine’de doğmuştur','571 yılında doğmuştur','Annesi Âmine’dir','Dedesi ona Muhammed adını vermiştir')]),
  p('Peygamberimizin çocukluk yıllarındaki kayıplarını, aile büyükleriyle ilişkisini, çalışkanlık ve güvenilirliğini çözümler.',[
    q('Annesini kaybettikten sonra Peygamberimizin bakımını önce kim üstlenmiştir?','Dedesi Abdülmuttalib','Amcası Ebu Talib','Sütannesi Halime','Hz. Hamza'),
    q('Dedesi vefat edince Peygamberimizi himayesine alan kişi kimdir?','Amcası Ebu Talib','Babası Abdullah','Dedesi Abdülmuttalib','Ebrehe'),
    q('Çocuklukta çobanlık yapması hangi özelliğini geliştirmiş olabilir?','Sorumluluk ve sabrı','Kibri','Savurganlığı','Tembelliği'),
    q('Aile büyüklerinin Peygamberimize sahip çıkması hangi değere örnektir?','Aile dayanışmasına','Ayrımcılığa','İsrafa','Gösterişe'),
    q('Peygamberimizin zor çocukluk şartlarına rağmen güvenilir olması hangi sonucu destekler?','İnsanın şartlar zor olsa da güzel ahlaklı olabileceğini','Zorlukların mutlaka kötü davranış doğurduğunu','Çalışmanın gereksiz olduğunu','Aile desteğinin önemsiz olduğunu')], [
    q('Peygamberimizin çocukluk dönemindeki bakım sırası hangisidir?','Annesi Âmine — dedesi Abdülmuttalib — amcası Ebu Talib','Amcası Ebu Talib — annesi Âmine — babası Abdullah','Dedesi Abdülmuttalib — babası Abdullah — annesi Âmine','Sütannesi Halime — Ebrehe — Ebu Talib'),
    q('Çobanlık ile ileride topluma rehberlik arasında hangi ortak beceri kurulabilir?','Sorumluluk, sabır ve koruyuculuk','Gösteriş ve üstünlük','İsraf ve acelecilik','Yalnızlık ve ilgisizlik'),
    q('“Çocuklukta yaşanan kayıplar Peygamberimizin şefkatini azaltmıştır.” sözü neden yanlıştır?','O, zorluklara rağmen merhametli ve güvenilir olmuştur','Hiç kayıp yaşamamıştır','Çocuklara hiç değer vermemiştir','Ailesiyle hiç yaşamamıştır'),
    q('Peygamberimizin çocukluğunu öğrenirken olay sırasını bilmek neden önemlidir?','Kimin ne zaman bakımını üstlendiğini doğru anlamak için','Bütün kişileri aynı sanmak için','Mekke’nin yerini unutmak için','Ahlaki değerleri önemsizleştirmek için'),
    q('Aşağıdakilerden hangisi Peygamberimizin çocukluğundan çıkarılabilecek bir ders değildir?','Zorluk karşısında sorumluluktan kaçmak','Çalışkan olmak','Aile bağlarını korumak','Güvenilir davranmak')]),
  p('Peygamberimizin çocuklarla iletişimindeki sevgi, şefkat, adalet, dinleme ve sorumluluk verme ilkelerini sentezler.',[
    q('Bir çocuk konuşurken sözünü kesmeden dinlemek Peygamberimizin hangi yaklaşımına uygundur?','Çocuğa değer vermeye','Çocuğu küçümsemeye','Adaletsiz davranmaya','Sorumluluktan kaçmaya'),
    q('İki çocuğa hediye verirken eşit ve adil davranmak hangi ilkeyi gösterir?','Adalet','İsraf','Kibir','Ayrımcılık'),
    q('Çocuğa yaşına uygun bir görev vermek neyi destekler?','Sorumluluk duygusunu','Korkuyu','Bağımlılığı','Tembelliği'),
    q('Hata yapan bir çocuğu herkesin içinde aşağılamak yerine sakin biçimde uyarmak hangi değere uygundur?','Şefkat ve saygıya','Kibre','İntikama','İlgisizliğe'),
    q('Kimsesiz bir çocuğu koruyup ihtiyaçlarını karşılamak hangi davranıştır?','Merhamet ve dayanışma','Ayrımcılık','Gösteriş','Savurganlık')], [
    q('Sevgi ile adalet çocuk iletişiminde neden birlikte gereklidir?','Çocuğun hem değerli hem güvende hissetmesini sağlar','Kuralları tamamen kaldırır','Yalnız başarılı çocuğu korur','Sorumluluğu yok eder'),
    q('“Çocuk küçük olduğu için görüşü dinlenmez.” sözü Peygamberimizin hangi tutumuyla çelişir?','Çocuklara değer verip onları dinlemesiyle','Yemek adabıyla','Giyim kuşamıyla','Ticaretle'),
    q('Çocuklara merhamet göstermek ile onları sorumsuz bırakmak arasındaki fark nedir?','Merhamet sevgiyle rehberlik eder; sorumsuz bırakmak gelişimi desteklemez','İkisi tamamen aynıdır','Merhamet hiç sınır koymamaktır','Sorumluluk yalnız yetişkinlere aittir'),
    q('Peygamberimizin çocuklarla iletişimini tek bir ilkeyle özetlemek yerine birkaç değeri birlikte düşünmek neden önemlidir?','İletişimin sevgi, adalet, dinleme ve rehberlik boyutları vardır','Yalnız bir davranış göstermiştir','Çocuklarla hiç konuşmamıştır','Değerler birbirine zıttır'),
    q('Aşağıdakilerden hangisi Peygamberimizin çocuklarla iletişimine uygun değildir?','Çocukları küçük düşürmek','Onları selamlamak','Şakalaşmak','Görüşlerini dinlemek')]),
  p('Asrısaadet çocuklarının Peygamberimize sevgisini ve onun çocukların dünyasına katılımını örneklerle çözümler.',[
    q('Peygamberimizin çocuklarla şakalaşması hangi mesajı verir?','Çocukların dünyasını ve duygularını önemsediğini','Çocuklarla iletişimi gereksiz gördüğünü','Yalnız yetişkinlere değer verdiğini','Her davranışı ciddiyetsiz yaptığını'),
    q('Peygamberimizi görünce sevinçle karşılayan çocukların davranışı neyi gösterir?','Ona duydukları sevgi ve güveni','Ondan korktuklarını','Onu tanımadıklarını','İletişim kurmadıklarını'),
    q('Bir yetişkinin çocukla onun anlayacağı dilde konuşması hangi ilkeye uygundur?','Yaş ve gelişim düzeyini dikkate almaya','Çocuğu küçümsemeye','İletişimi kesmeye','Yalnız emir vermeye'),
    q('Peygamberimizin oyun oynayan çocuklara selam vermesi hangi değeri gösterir?','Onlara değer verdiğini','Oyunlarını küçümsediğini','Çocukları görmezden geldiğini','Yalnız büyükleri selamladığını'),
    q('Bir çocuğun üzüntüsünü fark edip teselli etmek hangi davranıştır?','Empati ve merhamet','Kibir ve alay','İlgisizlik','Ayrımcılık')], [
    q('Çocukların Peygamberimizin yanında rahat hissetmesinin temel nedeni nedir?','Sevgi, anlayış ve güven veren tutumu','Onlara hiç sorumluluk vermemesi','Yalnız hediye dağıtması','Çocuklarla konuşmaması'),
    q('Oyun ile eğitim neden birbirinin karşıtı değildir?','Oyun sırasında da değerler ve beceriler öğrenilebilir','Oyun her zaman zaman kaybıdır','Eğitim yalnız sessizlikte olur','Çocuklar oyunla hiçbir şey öğrenmez'),
    q('Asrısaadet çocuklarının sevgisini incelemek hangi kaynaktan çıkarım gerektirir?','Onların söz ve davranışlarını anlatan örneklerden','Yalnız günümüz oyunlarından','Mimari eserlerden','Coğrafya haritasından'),
    q('“Çocuğa değer vermek onun her istediğini yapmak demektir.” sözü neden yanlıştır?','Değer vermek sevgiyle dinlemek ve doğruya rehberlik etmektir','Çocukların hiç isteği olmaz','Rehberlik sevgiyi ortadan kaldırır','Kurallar çocuklara zarar verir'),
    q('Aşağıdakilerden hangisi çocukların dünyasına katılmaya örnek değildir?','Onların duygularını önemsememek','Oyunlarına ilgi göstermek','Onlarla şakalaşmak','Sevinç ve üzüntülerini paylaşmak')]),
  p('Peygamberimizin yanında yetişen çocukların bilgi, ahlak ve sorumluluk gelişimini örnek kişiler üzerinden değerlendirir.',[
    q('Hz. Enes’in uzun süre Peygamberimizin yanında bulunması ona en çok ne kazandırmıştır?','Bilgi ve güzel ahlakı yakından öğrenme imkânı','Yalnız ticaret yapma imkânı','Toplumdan uzak kalma','Sorumluluktan kaçma'),
    q('Genç sahabilere görev verilmesi hangi düşünceyi gösterir?','Gençlerin yeteneklerine güvenildiğini','Gençlerin değersiz görüldüğünü','Görevlerin yalnız yaşlılara ait olduğunu','Eğitimin gereksiz olduğunu'),
    q('Bir çocuğun hata yaptığında kırılmadan düzeltilmesi ne sağlar?','Öğrenme isteği ve güveni','Korku ve uzaklaşma','Kibir','Sorumluluktan kaçış'),
    q('Peygamberimizin davranışlarını gözlemleyen çocukların bunları örnek alması hangi öğrenme yoludur?','Model alarak öğrenme','Ezbersiz unutma','Tesadüf','Yalnız kitaptan öğrenme'),
    q('Bilgi öğretirken güzel davranışla örnek olmak neden etkilidir?','Söz ile davranışın uyumunu gösterir','Sözleri gereksiz kılar','Çocukları pasif bırakır','Yanlışı güçlendirir')], [
    q('Rehberlik ile baskı arasındaki fark nedir?','Rehberlik açıklayıp destekler; baskı korkutarak zorlar','İkisi tamamen aynıdır','Rehberlik sorumluluk vermez','Baskı güven oluşturur'),
    q('Peygamberimizin yanında yetişen çocukların farklı görevler üstlenmesi hangi sonucu gösterir?','Yetenek ve yaşlarına göre geliştirildiklerini','Hepsinin aynı işi yaptığını','Hiç eğitim almadıklarını','Toplumdan uzak tutulduklarını'),
    q('“Çocuklar yalnız dinleyerek öğrenir.” sözü neden eksiktir?','Gözlem, uygulama ve sorumluluk alarak da öğrenirler','Çocuklar hiç öğrenemez','Dinlemek her zaman zararlıdır','Uygulama yalnız yetişkinlere aittir'),
    q('Çocuklara güvenmek ile onları denetimsiz bırakmak arasındaki doğru denge hangisidir?','Yaşına uygun görev verip gerektiğinde destek olmak','Bütün sorumluluğu çocuğa bırakmak','Hiç görev vermemek','Hata yaptığında küçümsemek'),
    q('Aşağıdakilerden hangisi Peygamberimizin eğitim yaklaşımından çıkarılamaz?','Çocukları hataları yüzünden değersiz görmek','Güzel davranışla örnek olmak','Sorumluluk vermek','Sabırla öğretmek')]),
  p('Peygamberimizin beden, elbise, çevre ve ibadet temizliğine verdiği önemi günlük alışkanlıklarla ilişkilendirir.',[
    q('Dişleri düzenli temizlemek Peygamberimizin hangi adabına uygundur?','Kişisel temizliğe','Yemeği israf etmeye','Gösterişe','Ayrımcılığa'),
    q('Abdest alırken musluğu gereksiz açık bırakmamak hangi iki değeri birlikte gösterir?','Temizlik ve israftan kaçınma','Kibir ve acelecilik','Yalnızlık ve korku','Gösteriş ve savurganlık'),
    q('Ortak kullanılan sınıfı temiz bırakmak hangi temizlik anlayışına örnektir?','Çevre temizliği ve sorumluluğa','Yalnız beden temizliğine','Giyim kuşama','Yemek adabına'),
    q('Temiz kıyafet giymek yalnız görünüş için değil hangi nedenle de önemlidir?','Sağlık ve başkalarına saygı için','Daha çok eşya tüketmek için','Üstünlük göstermek için','Başkalarını küçümsemek için'),
    q('İbadet öncesi temizliğin amacı nedir?','Beden ve bilinçle ibadete hazırlanmak','Suyu israf etmek','Yalnız görünüşü değiştirmek','İbadeti geciktirmek')], [
    q('Temizlik ile israf etmeme arasında nasıl bir denge kurulmalıdır?','Yeterli suyla temizlenip gereksiz tüketimden kaçınılmalıdır','Temizlik için su sınırsız kullanılmalıdır','Su tasarrufu için hiç temizlenilmemelidir','Yalnız başkaları temizlenmelidir'),
    q('“Temizlik yalnız kişinin kendi bedeniyle ilgilidir.” sözü neden eksiktir?','Elbise, çevre ve ortak alan temizliğini de kapsar','Beden temizliği önemsizdir','Çevre temizliği yasaktır','Temizlik yalnız bayramlarda yapılır'),
    q('Peygamberimizin temizlik örneklerini öğrenmenin amacı nedir?','Temizliği düzenli bir yaşam alışkanlığına dönüştürmek','Yalnız kavram ezberlemek','Başkalarının kirini aramak','Suyu çok tüketmek'),
    q('Temizliğin sağlıkla ilişkisi hangisidir?','Hastalık riskini azaltmaya ve iyi oluşa katkı sağlar','Sağlığı hiç etkilemez','Yalnız görünüşü değiştirir','Her temizlik hastalık oluşturur'),
    q('Aşağıdakilerden hangisi temizlik adabıyla çelişir?','Çöpü ortak alanda bırakmak','Ellerini yıkamak','Elbiseyi temiz tutmak','Çevreyi korumak')]),
  p('Peygamberimizin yeme içme adabını temizlik, ölçülülük, şükür, paylaşma ve israftan kaçınma ilkeleriyle açıklar.',[
    q('Yemeğe başlamadan önce elleri yıkamak hangi ilkeyle ilgilidir?','Temizlik','İsraf','Kibir','Ayrımcılık'),
    q('Tabağa yiyebileceği kadar yemek almak hangi davranıştır?','Ölçülülük ve israftan kaçınma','Gösteriş','Savurganlık','Nankörlük'),
    q('Yemeğin sonunda Allah’a teşekkür etmek hangi kavramdır?','Şükür','Kibir','İsraf','Haset'),
    q('Sofradaki yiyeceği başkalarıyla paylaşmak hangi değeri geliştirir?','Cömertlik ve dayanışma','Bencillik','Ayrımcılık','Tembellik'),
    q('Yemeği beğenmediğinde kötülemek yerine nazikçe yememek hangi adaba uygundur?','Nimet ve emeğe saygıya','Alaya','İsrafa','Kibre')], [
    q('Ölçülü yemek ile sağlıklı yaşam arasındaki ilişki hangisidir?','Aşırıya kaçmamak beden sağlığını korumaya yardım eder','Ne kadar çok yenirse o kadar sağlıklı olunur','Ölçü yalnız misafirlikte gerekir','Sağlıkla yemek arasında ilişki yoktur'),
    q('“Paramla aldım, istersem yemeği çöpe atarım.” sözü neden yanlıştır?','Nimet, emek ve kaynaklara karşı sorumluluk vardır','Yiyeceklerin değeri yoktur','İsraf yalnız suyla olur','Paylaşmak gereksizdir'),
    q('Yeme içme adabında temizlik ile nezaket nasıl birleşir?','Hem hijyene dikkat edilir hem sofradakilere saygılı davranılır','Temizlik için başkaları küçümsenir','Nezaket için temizlik bırakılır','İkisi bir arada olmaz'),
    q('Peygamberimizin sofra adabını öğrenmenin amacı nedir?','Günlük yeme davranışlarını bilinçli ve ahlaklı hâle getirmek','Yalnız yemek adlarını ezberlemek','Daha çok tüketmek','Başkalarının tabağını eleştirmek'),
    q('Aşağıdakilerden hangisi yeme içme adabına uygun değildir?','Yiyemeyeceği kadar yemek almak','Ellerini yıkamak','Besmeleyle başlamak','Yemeği paylaşmak')]),
  p('Peygamberimizin giyim kuşam adabını temizlik, sadelik, ölçülülük, tesettür ve insan onuruna saygıyla ilişkilendirir.',[
    q('Temiz fakat pahalı olmayan bir kıyafeti özenle giymek hangi anlayışa uygundur?','Temizlik ve sadeliğe','Gösterişe','Kibre','İsrafa'),
    q('Bir arkadaşının kıyafetiyle alay etmemek hangi değeri gösterir?','İnsan onuruna saygı','Üstünlük','Ayrımcılık','Küçümseme'),
    q('İhtiyacı olmadığı hâlde sürekli yeni kıyafet almak hangi ilkeyle çelişir?','İsraftan kaçınmayla','Temizlikle','Özenle','Saygıyla'),
    q('Kıyafetin temiz, uygun ve ölçülü olması hangi adabı gösterir?','Giyim kuşam adabını','Yeme içme adabını','Yolculuk adabını','Ticaret adabını'),
    q('Giyim tercihinde hava şartlarını dikkate almak hangi davranıştır?','Bilinçli ve sağlığı koruyan seçim','Gösteriş','Savurganlık','Başkalarını taklit')], [
    q('Sadelik ile özensizlik arasındaki fark nedir?','Sadelik ölçülü ve temiz olmaktır; özensizlik bakımsızlıktır','İkisi tamamen aynıdır','Sadelik pahalı giyinmektir','Özensizlik israfı önler'),
    q('“İnsanın değeri giydiği markayla ölçülür.” sözü neden yanlıştır?','İnsanın değeri ahlakı ve kişiliğiyle ilgilidir','Marka her zaman ahlakı gösterir','Pahalı kıyafet insanı üstün yapar','Sadelik değersizliktir'),
    q('Tesettür kavramının giyimle ilişkisi hangisidir?','Bedenin mahremiyetini uygun biçimde korumayı anlatır','Yalnız kıyafet rengini anlatır','Daha çok kıyafet satın almayı anlatır','Başkalarını küçümsemeyi anlatır'),
    q('Peygamberimizin giyim adabını uygulamak yalnız belirli bir kıyafet biçimini kopyalamak mıdır?','Hayır; temizlik, ölçülülük ve tevazu ilkelerini yaşatmaktır','Evet; başka hiçbir ilke yoktur','Yalnız renkleri kopyalamaktır','Yalnız pahalı kumaş seçmektir'),
    q('Aşağıdakilerden hangisi giyim kuşam adabıyla çelişir?','Kıyafeti üstünlük aracı yapmak','Temiz giyinmek','İhtiyaca göre seçim yapmak','Başkalarının kıyafetine saygı duymak')]),
  p('Peygamberimizin eşleriyle ilişkilerindeki sevgi, saygı, danışma, yardımlaşma ve adalet ilkelerini aile yaşamına uygular.',[
    q('Aileyle ilgili karar alırken eşlerin birbirine danışması hangi değeri gösterir?','Karşılıklı saygı ve istişareyi','Tek taraflı baskıyı','İlgisizliği','Ayrımcılığı'),
    q('Ev işlerinde aile bireylerine yardım etmek Peygamberimizin hangi yönünü örnek alır?','Yardımlaşmayı','Kibri','Tembelliği','Üstünlük taslamayı'),
    q('Eşinin düşüncesini dikkatle dinlemek hangi iletişim biçimidir?','Empatik ve saygılı iletişim','Kırıcı iletişim','İletişimsizlik','Alaycı iletişim'),
    q('Aile içinde hata olduğunda sakin ve çözüm odaklı konuşmak neyi destekler?','Huzur ve güveni','Korkuyu','Uzaklaşmayı','Haksızlığı'),
    q('Aile bireylerinin emeklerini takdir etmek hangi davranıştır?','Sevgi ve değer vermek','Küçümsemek','Görmezden gelmek','Kibirlenmek')], [
    q('Yardımlaşma ile görevleri tamamen başkasına bırakmak arasındaki fark nedir?','Yardımlaşmada sorumluluk paylaşılır; diğerinde sorumluluktan kaçılır','İkisi tamamen aynıdır','Yardımlaşma yalnız çocukların görevidir','Sorumluluk ailede gereksizdir'),
    q('“Ailede son sözü yalnız güçlü olan söyler.” düşüncesi hangi ilkeyle çelişir?','Danışma ve karşılıklı saygıyla','Temizlikle','Yemek adabıyla','Giyimle'),
    q('Peygamberimizin eş olarak örnekliği neden yalnız tarih bilgisi değildir?','Günümüz aile ilişkilerine değer ve davranış ölçüsü sunar','Yalnız isim ezberletir','Aile hayatıyla ilişkisi yoktur','Sadece belirli kişilere yöneliktir'),
    q('Sevgi ile adalet ailede nasıl birlikte işler?','Her bireye değer verilir ve hakları gözetilir','Sevgi kuralları yok eder','Adalet duyguları yasaklar','Yalnız bir kişiye değer verilir'),
    q('Aşağıdakilerden hangisi Peygamberimizin eş olarak örnekliğine uymaz?','Aile bireyinin görüşünü küçümsemek','Ev işlerine yardım etmek','Nazik konuşmak','Danışarak karar vermek')]),
  p('Peygamberimizin baba olarak şefkat, adalet, eğitim, dinleme ve kız çocuklarına değer verme örnekliğini değerlendirir.',[
    q('Çocuklar arasında ayrım yapmadan davranmak hangi değerdir?','Adalet','Kibir','İsraf','Ayrımcılık'),
    q('Çocuğun sorusunu sabırla cevaplamak hangi ebeveynlik yaklaşımıdır?','Rehberlik ve ilgi','İlgisizlik','Korkutma','Küçümseme'),
    q('Kız ve erkek çocuklarına eşit değer vermek hangi yanlış anlayışı reddeder?','Cinsiyete dayalı ayrımcılığı','Aile dayanışmasını','Eğitimi','Merhameti'),
    q('Çocuğa sevgi göstermek ile sınır koymak nasıl dengelenir?','Sevgiyle açıklanan adil kurallar konur','Hiç kural konmaz','Yalnız ceza verilir','Çocuk dinlenmez'),
    q('Çocuğun yeteneğini fark edip desteklemek hangi sorumluluktur?','Eğitim ve gelişimine rehberlik etmek','Onu başkalarıyla kıyaslamak','İsteklerini yok saymak','Sorumluluktan kaçmak')], [
    q('Şefkat ile adaletin birlikte olması neden önemlidir?','Çocuk hem sevildiğini hem haklarının korunduğunu hisseder','Şefkat adaleti gereksiz kılar','Adalet sevgiyi yok eder','Yalnız başarılı çocuk korunur'),
    q('“Çocuk hata yaptıysa sevgiyi hak etmez.” sözü neden yanlıştır?','Hata rehberlikle düzeltilir; çocuğun değeri ortadan kalkmaz','Her hata cezayla çözülür','Çocuklar hiç hata yapmaz','Sevgi yalnız ödüldür'),
    q('Peygamberimizin kız çocuklarına değer vermesi dönemin hangi sorununa karşı örnektir?','Kız çocuklarını değersiz gören anlayışa','Temizlik eksikliğine','Ticaret sorununa','Mimari yetersizliğe'),
    q('Bir babanın çocuğunu dinlemesi neyi sağlar?','İhtiyaç ve duygularını doğru anlamayı','Çocuğun daha çok korkmasını','İletişimin kesilmesini','Sorumluluğun yok olmasını'),
    q('Aşağıdakilerden hangisi Peygamberimizin baba olarak örnekliğine uymaz?','Çocukları sürekli birbirleriyle kıyaslamak','Onlara şefkat göstermek','Adaletli davranmak','Eğitimlerine önem vermek')]),
  p('Peygamberimizin dede olarak torunlarıyla sevgi, oyun, sabır ve rehberlik ilişkisini kuşaklar arası bağlarla ilişkilendirir.',[
    q('Torunuyla oyun oynayan bir dede hangi bağı güçlendirir?','Kuşaklar arası sevgi ve güveni','Ayrımcılığı','Yalnızlığı','Korkuyu'),
    q('Küçük bir çocuğun yavaş öğrenmesine sabır göstermek hangi değerdir?','Anlayış ve merhamet','Acelecilik','Küçümseme','İlgisizlik'),
    q('Peygamberimizin torunlarını kucağına alıp sevmesi hangi düşünceyi gösterir?','Sevginin açıkça gösterilebileceğini','Çocukların sevgiden uzak tutulması gerektiğini','Dedenin yalnız kural koyduğunu','Oyunların gereksiz olduğunu'),
    q('Büyüklerin deneyimlerini çocuklara hikâyelerle aktarması ne sağlar?','Bilgi ve değerlerin kuşaktan kuşağa geçmesini','Aile bağlarının zayıflamasını','Çocukların soru sormamasını','Geçmişin unutulmasını'),
    q('Torunların görüşünü dinlemek hangi davranıştır?','Onlara değer vermek','Onları küçümsemek','Sorumluluktan kaçmak','Ayrımcılık yapmak')], [
    q('Sevgi göstermek ile çocuğu şımartmak arasındaki fark nedir?','Sevgi ilgi ve rehberlik içerir; şımartmak sınır ve sorumluluğu yok sayar','İkisi tamamen aynıdır','Sevgi hiç kural koymamaktır','Şımartmak sorumluluk kazandırır'),
    q('Kuşaklar arası iletişim neden iki yönlüdür?','Büyükler deneyim aktarırken çocukların duygu ve düşüncelerini de dinler','Yalnız büyükler konuşur','Çocukların söyleyeceği hiçbir şey yoktur','İletişim yalnız bayramlarda olur'),
    q('Peygamberimizin dede olarak örnekliği hangi aile anlayışını destekler?','Sevgi, sabır ve birlikte zaman geçirmeyi','Çocuklardan uzak durmayı','Yalnız maddi hediye vermeyi','Korkuyla iletişim kurmayı'),
    q('“Dede ve ninelerin çocuk eğitiminde hiçbir katkısı yoktur.” sözü neden yanlıştır?','Sevgi, deneyim ve değer aktarımıyla önemli katkı sağlarlar','Çocuklar büyükleri tanımaz','Eğitim yalnız okulda olur','Aile bağları gereksizdir'),
    q('Aşağıdakilerden hangisi dede-torun ilişkisini güçlendirmez?','Çocuğun duygularını sürekli küçümsemek','Birlikte zaman geçirmek','Sabırla dinlemek','Sevgi göstermek')])
];

module.exports={din,hayat};
