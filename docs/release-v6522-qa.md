# Öğretmenim V6.52.2 kalite raporu

## Kapsam

- Yanlış cevaplardan oluşturulan GTT'lerde ders kaynağı bütünlüğü.
- Yanlış-GTT ile 1/3/7/14 günlük planlı tekrar oturumlarının ayrılması.
- Birden fazla dersten yanlış soru içeren genel GTT'nin güvenli kaydı ve devamı.
- Mini Oyunlar seçeneğinin ana sayfa, Veli Paneli ve çalışma kodundan kaldırılması.
- Öğrenci puanı, konu ilerlemesi, rozetler, koleksiyon ve mevcut GTT ustalık kayıtlarının korunması.

## Düzeltilen hatalar

1. Eski veya senkronize kayıtta görünen ders ile `sourceCourseId` farklı olduğunda soru yanlış dersin GTT havuzuna giriyordu. Kayıt artık gerçek ders ve konu kimliğine taşınıyor; eski kayıt kurtarma kopyasında korunuyor.
2. Yanlış-GTT ve planlı tekrar aynı `repeat` türüyle eşleştirildiği için biri diğerinin yarım kalmış oturumunu açabiliyordu. Oturumlar `wrong-gtt` ve `scheduled-repeat` olarak ayrıldı.
3. Genel yanlış-GTT birden fazla ders içerdiğinde tek ders doğrulamasına takılabiliyordu. Çok dersli yanlış-GTT artık `GTT Genel` kimliğiyle kaydediliyor.
4. Mini Oyunlar yalnız iki sabit uyarı düğmesinden oluşuyordu; kullanıcı talebiyle tüm görünür girişleri ve işlevi kaldırıldı.

## Doğrulamalar

- `node tools/qa-v6522.cjs`: 8 dersin GTT havuzu ve oturumu doğru dersle eşleşti; Din/Fen eski kayıt onarıldı; planlı tekrar ayrımı ve çok dersli genel yanlış-GTT geçti; Mini Oyunlar bulunmadı; 390 pikselde taşma ve tarayıcı hatası yok.
- `node tools/qa-v6519.cjs`: iki farklı GTT oturumunda art arda iki doğru kuralı ve Günlük Çalışma regresyonu geçti.
- `node tools/qa-v6521.cjs`: bağımsız Türkçe yolları ve engellemeyen test duraklatma akışı geçti.
- `node tools/qa-completion-retry-v6516.cjs`: tamamlanan testleri isteğe bağlı tekrar etme ve kaldığı yerden sürdürme geçti.
- `node tools/qa-turkish-v6520.cjs`: Türkçe okul testleri, kaynak görselleri ve günlük yanlış kayıtları geçti.
- `node tools/qa-all-courses-v6520.cjs`: 8 ders, 157 konu, 1.069 kaynak görseli; eksik kaynak ve tarayıcı hatası yok.
- `node tools/qa-progress-v6515.cjs`, `node tools/qa-topic-locks-v6518.cjs`, `node tools/qa-ekc-v6513.cjs`, `node tools/qa-din-511-v6514.cjs`, `node tools/qa-fenomen-v6520.cjs`: ilgili regresyonlar geçti.

## Veri koruma

- Hatalı eski yanlış-soru kaydı silinmiyor; düzeltilmeden önce `wrongQuestionRecoveryV6522` altında sınırlı kurtarma kopyası tutuluyor.
- Ders değişen sorunun GTT ustalık kaydı yeni kimliğe taşınıyor.
- Puan, tamamlanan konular, geçmiş, rozetler, tasarımlar, koleksiyon ve okul testi kayıtları değiştirilmedi.
