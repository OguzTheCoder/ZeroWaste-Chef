# ZeroWaste-Chef — Mimari

**Takım:** TechRift  
**Proje:** ZeroWaste-Chef  
**Teknoloji Yığını:** React.js · Python FastAPI · Claude API · TheMealDB · USDA FoodData Central

---

## Genel Bakış

ZeroWaste-Chef, kullanıcının buzdolabı fotoğrafını yapay zeka ile analiz eden, tespit edilen malzemeleri tarif veritabanıyla eşleştiren ve en uygun yemekleri besin değerleriyle birlikte öneren bir web uygulamasıdır. Türkçe sesli asistan, kullanıcıya eller serbest şekilde pişirme adımlarında rehberlik eder.

---

## Sistem Mimarisi

```
┌─────────────────────────────────────────────────────┐
│                İSTEMCİ (Tarayıcı)                   │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Giriş /    │  │  Ana Uygul.  │  │  Sesli    │  │
│  │  Kayıt      │  │  Yükleme /   │  │  Asistan  │  │
│  │  Sayfaları  │  │  Tarifler    │  │  (TR)     │  │
│  └─────────────┘  └──────────────┘  └───────────┘  │
│            React.js + Web Speech API                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────┐
│               SUNUCU (FastAPI)                      │
│                                                     │
│  /auth        → JWT giriş ve kayıt                  │
│  /analyze     → Buzdolabı fotoğrafı → malzeme listesi│
│  /recipes     → Malzemeleri eşleştir → tarif listesi│
│  /nutrition   → Tarif başına makro/mikro besin verisi│
│  /voice       → Pişirme adımı sorgu yöneticisi      │
└──────┬──────────────┬──────────────────┬────────────┘
       │              │                  │
┌──────▼──────┐ ┌─────▼──────┐ ┌────────▼────────┐
│ Claude API  │ │ TheMealDB  │ │ USDA FoodData   │
│ Vision      │ │ API        │ │ Central API     │
│ (malzeme    │ │ (tarif ve  │ │ (makro ve mikro │
│  tespiti)   │ │  kategoriler│ │  besin değerleri│
└─────────────┘ └────────────┘ └─────────────────┘
```

---

## Modül Açıklamaları

### 1. Ön Yüz (Frontend) — `client/`

| Modül | Görev |
|---|---|
| `GirisSayfasi` | Kullanıcı giriş ve kayıt formları |
| `YuklemeSayfasi` | Buzdolabı fotoğrafı yükleme ve önizleme |
| `TarifListesi` | Sıralanmış tarif kartlarını gösterir |
| `TarifDetayi` | Adımlar ve besin değerleriyle tam tarif görünümü |
| `SesliAsistan` | Türkçe sesli sorguları dinler, adımları sesli okur |
| `FiltreCubugu` | Düşük kalorili ve hızlı tarif filtre seçenekleri |

**Kullanılan kütüphaneler:** React 18, React Router, Axios, Web Speech API (tarayıcıya gömülü)

---

### 2. Sunucu (Backend) — `server/`

| Uç Nokta | Metot | Açıklama |
|---|---|---|
| `/auth/register` | POST | Kullanıcı hesabı oluşturma (şifrelenmiş parola, JWT) |
| `/auth/login` | POST | Kimlik doğrulama, JWT token döndürme |
| `/analyze` | POST | Resim al → Claude Vision'a gönder → malzeme listesi döndür |
| `/recipes` | GET | Malzemeleri TheMealDB ile eşleştir, filtreleri uygula |
| `/nutrition/{tarif_id}` | GET | Tarif malzemeleri için USDA besin verisini çek |
| `/voice` | POST | Metin sorgusu al, sonraki pişirme adımını döndür |

**Kullanılan kütüphaneler:** FastAPI, python-jose (JWT), passlib (parola şifreleme), httpx (API çağrıları), python-dotenv

---

### 3. Dış Servisler

#### Claude API (Vision)
- **Amaç:** Buzdolabı fotoğrafından malzemeleri tespit etmek
- **Girdi:** Base64 kodlanmış resim
- **Çıktı:** Tespit edilen malzeme listesi (ör. `["yumurta", "domates", "peynir"]`)
- **Model:** `claude-sonnet-4-20250514`

#### TheMealDB API
- **Amaç:** Tarif veritabanı — API anahtarı gerekmez, tamamen ücretsiz
- **Kullanılan uç noktalar:**
  - `filter.php?i={malzeme}` — malzemeye göre tarif filtrele
  - `lookup.php?i={tarif_id}` — tam tarif detayı ve adımları
- **Eşleştirme mantığı:** Tarifler, kullanıcının tespit edilen malzemeleriyle ne kadar örtüştüğüne göre puanlanır; her tarif için eksik malzemeler ayrıca gösterilir.

#### USDA FoodData Central API
- **Amaç:** Makro ve mikro besin değerleri
- **Anahtar:** Ücretsiz, `fdc.nal.usda.gov` adresinden alınır
- **Uç nokta:** `GET /foods/search?query={malzeme}&api_key={anahtar}`
- **Dönen veri:** 100g başına kalori, protein, karbonhidrat, yağ, lif, vitamin, mineral

---

### 4. Kimlik Doğrulama

- Kayıt sırasında parola bcrypt ile şifrelenir (passlib)
- Giriş işlemi imzalı bir JWT döndürür (HS256, 24 saat geçerlilik)
- Korumalı rotalar `Authorization: Bearer <token>` başlığı gerektirir
- Frontend token'ı güvenlik nedeniyle localStorage yerine bellekte tutar

---

### 5. Sesli Asistan

- Tarayıcıya gömülü **Web Speech API** kullanılır (ek servis gerekmez)
- Dil: `tr-TR` (Türkçe)
- Tanınan sorgular: `"Sonraki adım ne?"`, `"Ne kadar pişireceğim?"`, `"Malzemeler neler?"`
- `SpeechSynthesis` API ile Türkçe sesli yanıt verilir

---

## Veri Akışı — Temel Özellik

```
Kullanıcı buzdolabı fotoğrafını yükler
        │
        ▼
Sunucu /analyze
  → Resmi Claude API'ye (Vision) gönderir
  → Malzeme listesini alır
        │
        ▼
Sunucu /recipes
  → Her malzeme için TheMealDB'yi sorgular
  → Eşleşen tarifleri puanlar ve sıralar
  → Her tarif için eksik malzemeleri belirler
  → Filtreleri uygular (düşük kalorili / hızlı)
        │
        ▼
Sunucu /nutrition
  → Her tarif için USDA'dan malzeme besin değerini çeker
  → Makro ve mikro değerleri toplar
  → Porsiyon başına toplamları hesaplar
        │
        ▼
Ön yüz sıralanmış tarif kartlarını gösterir:
  eşleşme puanı · eksik malzemeler · besin değerleri paneli
```

---

## Ortam Değişkenleri

```env
# Sunucu .env
CLAUDE_API_KEY=
USDA_API_KEY=
JWT_SECRET=
```

TheMealDB için anahtar gerekmez.

---

## Yayın (Deployment)

| Servis | Platform | Katman |
|---|---|---|
| Ön yüz | Vercel | Ücretsiz |
| Sunucu | Railway | Ücretsiz (ayda 500 saat) |

---

## Klasör Yapısı

```
zerowaste-chef/
├── client/                  # React ön yüzü
│   ├── src/
│   │   ├── pages/           # GirisSayfasi, YuklemeSayfasi, TarifDetayi
│   │   ├── components/      # TarifKarti, SesliAsistan, FiltreCubugu
│   │   └── api/             # Sunucu çağrıları için Axios sarmalayıcılar
│   └── public/
├── server/                  # FastAPI sunucusu
│   ├── main.py
│   ├── routers/             # auth.py, analyze.py, recipes.py, nutrition.py
│   ├── services/            # claude.py, mealdb.py, usda.py
│   └── models/              # Pydantic şemaları
├── ARCHITECTURE.md
└── ROADMAP.md
```
