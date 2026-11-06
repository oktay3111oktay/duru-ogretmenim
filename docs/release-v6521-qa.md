# Öğretmenim V6.52.1 kalite raporu

Tarih: 6 Kasım 2026

## Uygulanan değişiklikler

- Türkçedeki İELEV Kaynakları, İELEV Derin Öğrenme ve MEB Kaynakları birbirinden bağımsız üç ilerleme zinciri olarak düzenlendi.
- Her grubun ilk konusu açık; sonraki konu yalnızca aynı gruptaki önceki Konu Testi ile varsa bütün zorunlu Okul Testleri tamamlandığında açılıyor.
- Konu numarası her grubun başında yeniden 1’den başlıyor ve her başlıkta grup ilerlemesi ayrıca gösteriliyor.
- Veli paneline üç Türkçe kaynak dersinin ayrı tamamlanma oranları eklendi.
- Yarım kalan konu, ekstra, okul, GTT ve tekrar testleri ana sayfayı engellemiyor ve “Şimdi devam et” uyarısı göstermiyor.
- Her yarım test kendi kaydında korunuyor. Başka bir teste geçilebiliyor; aynı test yeniden açıldığında aynı soru ve aşamadan devam ediyor.
- Önceki sürümden kalmış etkin test kayıtları veri kaybı olmadan yeni isteğe bağlı kaldığı-yer listesine taşınıyor.

## Tarama sırasında bulunan ve düzeltilen hatalar

1. Türkçenin 22 konusu tek bir kilit zincirindeydi; Derin Öğrenme ve MEB’in ilk konuları önceki grubun tamamlanmasını bekliyordu.
2. Etkin test kaydı yalnız ana sayfayı değil, başka bir test başlatmayı da engelleyip eski testi zorla açıyordu.
3. Tamamlanmış bir testin tekrar oturumu tarayıcı yeniden açıldığında etkin kayıt kaldırılmış olsa bile test ekranında kalabiliyordu.
4. Veli paneli Türkçe kaynak gruplarını ayrı ilerleme yolları olarak göstermiyordu.

## Doğrulanan kapsam

- Üç Türkçe grubunun başlangıç indeksleri 0, 7 ve 16; üç ilk konu açık, gruplardaki ikinci konular kilitli.
- İELEV Kaynakları ve İELEV Derin Öğrenme’de yalnız Konu Testi bitince sonraki konu açılmıyor; bütün Okul Testleri de bitince açılıyor.
- Okul Testi bulunmayan MEB ilk konusunda Konu Testi tamamlanınca sıradaki MEB konusu açılıyor.
- İlk deneme, tamamlanmış test tekrarı, Ekstra Test ve yanlış düzeltmesi bekleyen testler ana sayfayı zorlamıyor.
- Aynı test aynı oturum kimliği ve soru sırasıyla devam ediyor; farklı ders testi bağımsız açılabiliyor.
- Sayfa yenileme ve eski etkin kayıt geçişi ana sayfayı zorlamıyor.
- Eski puan, rozet, koleksiyon, geçmiş ve tamamlanma kayıtları korunuyor.
- 8 ders, 157 konu ve her konu için 10 geçerli dört seçenekli soru tarandı.
- 1.069 MEB kaynak dosyası ve 305 yeni okul kaynak görselinde eksik bağlantı bulunmadı.
- Türkçe 932 soru, Fenomen 78 soru, diğer okul havuzları ve 104 Okul Testi yeniden doğrulandı.
- GTT iki doğru serisi, Günlük Çalışma, Veli ilerlemesi, tamamlanma durumları ve 390 piksel mobil görünüm testleri geçti.
- JavaScript sözdizimi, tarayıcı çalışma zamanı ve yatay taşma hatası bulunmadı.

## Sınırlar

- Otomatik testler gerçek telefon, tablet ve bilgisayarın aynı anda fiziksel kullanımının yerini tutmaz.
- Bu sürüm içerik kaynaklarını değiştirmedi; V6.52.0 raporunda belirtilen Fenomen resmî cevap anahtarı eksikliği devam eder.
