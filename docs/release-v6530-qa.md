# V6.53.0 Körebe Ödülleri – Doğrulama Raporu

## Uygulanan kapsam

- Ana sayfada **Rozetlerim** alanından hemen sonra **Ödüllerim** kartı eklendi.
- Başla–Bitir açıkken cevaplanan ve tamamlanan testlere ait sorular Körebe ödülüne katılır.
- Aynı testin ilk tamamlanmasında 100 soru, ikinci tamamlanmasında 150 soru, üçüncü tamamlanmasında 200 soru ve sonraki her tamamlanmada 50 soru daha yüksek eşik uygulanır.
- Farklı eşiklerdeki çalışmalar aynı gün kendi oranlarıyla birleşir.
- Önceden yanlış cevaplanan sorulardan oluşturulan GTT/GDS çalışmaları iki kat katkı verir.
- Tamamlanmamış günlük katkı gün değişince sıfırlanır; kazanılmış Körebe hakları korunur.
- Sistem yalnızca V6.53.0 sonrasındaki tamamlamaları sayar.
- Veli Paneline yalnızca hak düşürmeye yarayan araç eklendi; hak artırma işlevi eklenmedi.
- Çocuklara uygun, şeffaf arka planlı yeni Körebe illüstrasyonu eklendi.

## Veri koruması

- Körebe verileri `blindMansBuffRewardsV6530` alanında tutulur.
- Mevcut puan, konu tamamlanma, test geçmişi, rozet ve koleksiyon alanlarına dokunulmaz.
- Körebe hakları normal öğrenci yedeğinin ve yapılandırılmış cihaz eşitlemesinin bir parçası olan ana öğrenci durumu içinde saklanır.
- Yeni bir cihaz ilk kez bağlandığında boş yerel sayaç, daha güncel uzaktaki Körebe haklarının üzerine yazmaz; tamamlama sayıları yüksek olan değer korunarak birleştirilir.

## Otomatik doğrulama

`node tools/qa-v6530.cjs`

Denetlenen başlıca senaryolar:

1. Başla etkin değilken ödül yazılmaması.
2. 100 / 150 / 200 / 250 ve devamında +50 eşik sırası.
3. Farklı tekrar eşiklerinin aynı gün oransal birleşmesi.
4. Yanlış-soru GTT/GDS sorularının iki kat sayılması.
5. Gün değişiminde yalnız günlük katkının sıfırlanması.
6. Kazanılmış hakların korunması ve Veli Panelinden toplu düşürülmesi.
7. Ödüllerim kartının Rozetlerimden hemen sonra görünmesi.
8. Körebe görselinin yüklenmesi, 390 piksel mobil taşma ve tarayıcı hataları.

