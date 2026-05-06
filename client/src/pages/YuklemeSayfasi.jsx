import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../api';
import './YuklemeSayfasi.css'; // Modern CSS dosyasını içe aktarıyoruz

const YuklemeSayfasi = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Lütfen geçerli bir resim dosyası seçin.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    
    try {
      /* 
       * NOT: Backend sunucusu şu an aktif olmadığı için 
       * tasarımı test edebilmeniz amacıyla geçici (mock) veri kullanıyorum.
       * Backend hazır olduğunda alttaki yorum satırlarını kaldırabilirsiniz:
       * 
       * const base64Image = imagePreview.split(',')[1];
       * const data = await analyzeImage(base64Image);
       * setIngredients(data.ingredients || []);
       */
      
      // MOCK YANIT: Animasyonları görmek için 2 saniye bekler
      setTimeout(() => {
        setIngredients(["Domates", "Kırmızı Biber", "Yumurta", "Beyaz Peynir", "Süt", "Taze Soğan"]);
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Fotoğraf analiz edilirken hata oluştu:', error);
      alert('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="yukleme-sayfasi-container">
      <div className="glass-card">
        
        <div>
          <h2 className="yukleme-baslik">ZeroWaste Chef</h2>
          <p className="yukleme-alt-baslik">Buzdolabınızın fotoğrafını yükleyin, sizin için en iyi tarifleri bulalım.</p>
        </div>

        <div
          className={`modern-dropzone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="preview-image-container">
              <img src={imagePreview} alt="Önizleme" className="preview-image" />
            </div>
          ) : (
            <>
              {/* Modern Yükleme İkonu */}
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div className="dropzone-text">Fotoğrafı sürükleyip bırakın</div>
              <div className="dropzone-subtext">veya seçmek için tıklayın</div>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
        
        {imagePreview && (
          <button 
            onClick={handleAnalyze} 
            disabled={loading} 
            className="glow-btn"
          >
            {loading ? (
              <><span className="spinner"></span>Analiz Ediliyor...</>
            ) : (
              '✨ Malzemeleri Tespit Et'
            )}
          </button>
        )}

        {ingredients.length > 0 && (
          <div className="ingredients-panel">
            <h3 className="ingredients-title">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tespit Edilen Malzemeler
            </h3>
            <ul className="ingredients-list">
              {ingredients.map((ing, idx) => (
                <li key={idx} className="ingredient-tag">{ing}</li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/recipes', { state: { ingredients } })}
              className="glow-btn secondary-btn"
            >
              👩‍🍳 Bu Malzemelerle Tarif Bul
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default YuklemeSayfasi;
