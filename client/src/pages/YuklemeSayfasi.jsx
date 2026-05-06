import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../api';

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
      const base64Image = imagePreview.split(',')[1];
      const data = await analyzeImage(base64Image);
      setIngredients(data.ingredients || []);
      
      // Analiz tamamlandıktan sonra malzemeleri tarifler sayfasına aktarabiliriz
      // navigate('/recipes', { state: { ingredients: data.ingredients } });
    } catch (error) {
      console.error('Fotoğraf analiz edilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yukleme-sayfasi">
      <h2>Buzdolabı Fotoğrafını Yükle</h2>
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Buzdolabı önizleme" className="image-preview" />
        ) : (
          <p>Fotoğrafı sürükleyip bırakın veya seçmek için tıklayın</p>
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
          className="analiz-btn"
        >
          {loading ? 'Analiz Ediliyor...' : 'Malzemeleri Tespit Et'}
        </button>
      )}

      {ingredients.length > 0 && (
        <div className="malzemeler-listesi">
          <h3>Tespit Edilen Malzemeler:</h3>
          <ul>
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          <button 
            onClick={() => navigate('/recipes', { state: { ingredients } })}
            className="tarif-bul-btn"
          >
            Tarifleri Bul
          </button>
        </div>
      )}
    </div>
  );
};

export default YuklemeSayfasi;
