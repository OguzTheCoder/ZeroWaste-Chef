import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNutrition } from '../api';
import BesinDegerleriPaneli from '../components/BesinDegerleriPaneli';
import './TarifDetayi.css';

const TarifDetayi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        /*
         * NOT: Backend sunucusu aktif olmadığından API çağrıları yerine mock veri kullanıyoruz.
         * Backend aktifleştiğinde aşağıdaki gibi çalışacak:
         * 
         * const nutritionData = await getNutrition(id);
         * setNutrition(nutritionData);
         * // Ayrıca tarifi getiren bir endpoint de yazılmalı
         */
        
        // MOCK VERİ (Gerçekçi bir bekleme süresi):
        setTimeout(() => {
          setRecipe({
            id: id,
            name: id === '1' ? 'Menemen' : (id === '2' ? 'Sebzeli Krep' : 'Örnek Tarif'),
            image: id === '1' ? 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1000&q=80' : 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1000&q=80',
            steps: [
              "Domateslerin kabuklarını soyun ve küp küp doğrayın.",
              "Yeşil biberleri ince ince kıyın.",
              "Tavada tereyağını eritin ve biberleri kokusu çıkana kadar soteleyin.",
              "Domatesleri ekleyip suyunu çekene kadar kısık ateşte pişirin.",
              "Yumurtaları bir kasede kırıp hafifçe çırpın.",
              "Yumurtaları tavaya ekleyin, tuzunu atıp hafifçe karıştırarak pişirin ve ocaktan alın."
            ]
          });
          
          setNutrition({
            calories: 320,
            protein: 15,
            carbs: 12,
            fat: 22,
            micros: [
              { name: "C Vitamini", amount: "45mg" },
              { name: "A Vitamini", amount: "900IU" },
              { name: "Demir", amount: "2.1mg" },
              { name: "Kalsiyum", amount: "65mg" }
            ]
          });
          
          setLoading(false);
        }, 1200);

      } catch (err) {
        console.error("Detaylar alınırken hata:", err);
        setError("Tarif detayları ve besin değerleri yüklenemedi. Lütfen bağlantınızı kontrol edin.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        Tarif ve besin değerleri hazırlanıyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="tarif-detayi-container">
        <div className="empty-state" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
          <h3>Hata Oluştu</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="glow-btn" style={{ marginTop: '1.5rem', width: 'auto' }}>Geri Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tarif-detayi-container">
      <button className="geri-btn" onClick={() => navigate(-1)}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Geri Dön
      </button>

      <div className="tarif-baslik-alani">
        <h1 className="tarif-isim">{recipe.name}</h1>
        <img src={recipe.image} alt={recipe.name} className="tarif-detay-resim" />
      </div>

      <div className="icerik-grid">
        <div className="adims-kart">
          <h3 className="bolum-basligi">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Hazırlanış Adımları
          </h3>
          <ul className="adim-listesi">
            {recipe.steps.map((adim, index) => (
              <li key={index} className="adim-madde">
                <div className="adim-no">{index + 1}</div>
                <div className="adim-metin">{adim}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="besin-yan-panel">
          <BesinDegerleriPaneli nutrition={nutrition} />
        </div>
      </div>
    </div>
  );
};

export default TarifDetayi;
