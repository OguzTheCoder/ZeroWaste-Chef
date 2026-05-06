# ZeroWaste-Chef — Yol Haritası

**Takım:** TechRift  
**Proje:** ZeroWaste-Chef  
**Hackathon:** SolveX AI Hackathon 2026

---

## Aşamalar

### Aşama 1 — Kurulum ve Kimlik Doğrulama
**Hedef:** Depo hazır, takım rolleri belirlenmiş, giriş/kayıt sistemi uçtan uca çalışıyor.

| Görev | Sorumlu | Issue |
|---|---|---|
| GitHub deposu oluşturma, dal kuralları belirleme (main'e doğrudan push yok) | Baş Geliştirici | #1 |
| React ön yüzünü başlatma (Vite + React Router) | Geliştirici 1 | #2 |
| FastAPI sunucusunu başlatma, `.env` bağlantısı | Geliştirici 2 | #3 |
| `/auth/register` ve `/auth/login` uç noktalarını uygulama (JWT) | Geliştirici 2 | #4 |
| Ön yüzde giriş ve kayıt sayfalarını oluşturma | Geliştirici 1 | #5 |
| Ön yüzü Vercel'e, sunucuyu Railway'e deploy etme | Baş Geliştirici | #6 |

**Yapay Zeka Ajanı — Plan Ajanı:**  
Kod yazılmaya başlanmadan önce, AI geliştirme aracına projenin tüm açıklaması verilir ve bu ROADMAP ile ARCHITECTURE.md dosyaları oluşturulur. Her iki dosya `main` dalına commit edilerek projenin başlangıç temeli oluşturulur.

---

### Aşama 2 — Buzdolabı Fotoğrafı Analizi
**Hedef:** Kullanıcı buzdolabı fotoğrafı yükleyebiliyor ve tespit edilen malzeme listesini görüyor.

| Görev | Sorumlu | Issue |
|---|---|---|
| Fotoğraf yükleme arayüzü (sürükle-bırak + önizleme) | Geliştirici 1 | #7 |
| `/analyze` uç noktası — resim al, Claude Vision API'ye gönder | Geliştirici 2 | #8 |
| Claude yanıtını temiz malzeme listesine çevirme | Geliştirici 2 | #9 |
| Tespit edilen malzeme listesini ön yüzde gösterme | Geliştirici 1 | #10 |

**Yapay Zeka Ajanı — Beceri Ajanı:**  
Claude Vision API entegrasyonu (`services/claude.py`) özelleşmiş bir görevdir. AI aracı "uzman geliştirici" modunda kullanılarak resim kodlama, API çağrısı ve yanıt ayrıştırma mantığı oluşturulur. AI destekli bölümler dosyanın başında belirtilir:  
`# Beceri Ajanı: Claude Vision API entegrasyonu — AI yardımıyla oluşturuldu`

---

### Aşama 3 — Tarif Eşleştirme
**Hedef:** Tespit edilen malzemeler TheMealDB ile eşleştiriliyor; eksik malzemeler vurgulanmış sıralı tarif listesi gösteriliyor.

| Görev | Sorumlu | Issue |
|---|---|---|
| TheMealDB malzeme sorgusu (`services/mealdb.py`) | Geliştirici 2 | #11 |
| Tarif puanlama ve sıralama mantığı (eşleşen malzeme sayısına göre) | Geliştirici 2 | #12 |
| Her tarif için eksik malzemeleri belirleme ve döndürme | Geliştirici 2 | #13 |
| Tarif kartı bileşeni (ad, resim, eşleşme puanı, eksik malzeme listesi) | Geliştirici 1 | #14 |
| Düşük kalorili ve hızlı tarif filtre seçeneklerini ekleme | Geliştirici 1 | #15 |

---

### Aşama 4 — Besin Değerleri
**Hedef:** Her tarif kartında porsiyon başına makro ve mikro besin değerleri gösteriliyor.

| Görev | Sorumlu | Issue |
|---|---|---|
| USDA FoodData Central sorgusu (`services/usda.py`) | Geliştirici 2 | #16 |
| Tarif malzemeleri genelinde besin değerlerini toplama | Geliştirici 2 | #17 |
| Besin değerleri paneli bileşeni (kalori, protein, karbonhidrat, yağ, vitaminler) | Geliştirici 1 | #18 |
| `/nutrition/{tarif_id}` uç noktasını ön yüz tarif detay sayfasına bağlama | Geliştirici 1 | #19 |

**Yapay Zeka Ajanı — Beceri Ajanı:**  
Besin değerlerini tarif miktarlarıyla eşleştirme ve hesaplama mantığı veri yoğun bir alt görevdir. AI aracı uzman olarak kullanılarak `services/usda.py` dosyasındaki eşleştirme ve hesaplama fonksiyonları oluşturulur. İzlenebilirlik yorumu eklenir:  
`# Beceri Ajanı: USDA besin değeri toplama — AI yardımıyla oluşturuldu`

---

### Aşama 5 — Sesli Asistan
**Hedef:** Kullanıcı Türkçe pişirme sorularını eller serbest şekilde sorabiliyor; asistan sesli yanıt veriyor.

| Görev | Sorumlu | Issue |
|---|---|---|
| Web Speech API dinleyicisini uygulama (dil: `tr-TR`) | Geliştirici 1 | #20 |
| Tanınan ifadeleri pişirme adımı yanıtlarıyla eşleştirme | Geliştirici 1 | #21 |
| Türkçe sesli çıktı için `SpeechSynthesis` API'yi uygulama | Geliştirici 1 | #22 |
| Sesli asistanı aktif tarif adım listesine bağlama | Geliştirici 1 | #23 |

---

### Aşama 6 — Son Gözden Geçirme ve Teslim
**Hedef:** Tüm özellikler çalışıyor, kod incelendi, AI iyileştirme turu tamamlandı, proje teslim edildi.

| Görev | Sorumlu | Issue |
|---|---|---|
| Tam kod incelemesi — tüm PR'lar birleştirilmiş, açık dal yok | Baş Geliştirici | #24 |
| AI iyileştirme turu — tam kod tabanı AI araçla optimize edildi | Baş Geliştirici | #25 |
| Uçtan uca test: fotoğraf yükle → tarif al → tarifi aç → sesli asistan kullan | Tüm Takım | #26 |
| Kurulum talimatları ve demo notlarıyla README yazma | Baş Geliştirici | #27 |
| Son yayın kontrolü (Vercel + Railway ikisi de canlı) | Baş Geliştirici | #28 |

**Yapay Zeka Ajanı — Son Gözden Geçirme:**  
Teslimden önce AI aracına şu prompt verilir: `"Bu kod tabanını performans sorunları, güvenlik açıkları ve kod kalitesi açısından incele. Yeniden yapılandırma önerileri sun."` İlgili tüm öneriler uygulanır ve son PR açıklamasında belirtilir.

---

## Dal Adlandırma Kuralı

```
ozellik/fotograf-yukleme
ozellik/claude-vision-entegrasyonu
ozellik/tarif-eslestirme
ozellik/usda-besin-degerleri
ozellik/sesli-asistan
duzeltme/jwt-token-suresi
```

Tüm dallar Pull Request ile `main`'e birleştirilir. En az 1 inceleyici onayı zorunludur.

---

## Yapay Zeka İzlenebilirlik Özeti

| Dosya | Ajan | Açıklama |
|---|---|---|
| `ARCHITECTURE.md` | Plan Ajanı | Proje mimarisi — AI tarafından oluşturuldu |
| `ROADMAP.md` | Plan Ajanı | Görev dökümü — AI tarafından oluşturuldu |
| `services/claude.py` | Beceri Ajanı | Vision API entegrasyonu |
| `services/usda.py` | Beceri Ajanı | Besin değeri toplama mantığı |
| Tüm kod | Son Gözden Geçirme | Teslim öncesi iyileştirme turu |
