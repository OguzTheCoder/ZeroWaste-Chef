import React from 'react';

const TarifKarti = ({ recipe, onClick }) => {
  return (
    <div className="tarif-karti" onClick={() => onClick && onClick(recipe.id)}>
      <img src={recipe.image || 'https://via.placeholder.com/300x200?text=Tarif+Görseli'} alt={recipe.name} className="tarif-resim" />
      <div className="tarif-icerik">
        <h3 className="tarif-ad">{recipe.name}</h3>
        
        <div className="tarif-puan">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Eşleşme Puanı: {recipe.matchScore}%
        </div>
        
        {recipe.missingIngredients && recipe.missingIngredients.length > 0 ? (
          <div className="eksik-malzemeler">
            <h4>Eksik Malzemeler:</h4>
            <ul className="eksik-liste">
              {recipe.missingIngredients.map((item, index) => (
                <li key={index} className="eksik-etiket">{item}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="eksik-malzemeler" style={{ color: '#34d399', fontSize: '0.9rem', marginTop: 'auto' }}>
            🎉 Tüm malzemelere sahipsiniz!
          </div>
        )}
      </div>
    </div>
  );
};

export default TarifKarti;
