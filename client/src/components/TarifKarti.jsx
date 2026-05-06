import React from 'react';

const TarifKarti = ({ recipe, onClick }) => {
  return (
    <div className="tarif-karti" onClick={() => onClick && onClick(recipe.id)}>
      <img src={recipe.image} alt={recipe.name} className="tarif-resim" />
      <div className="tarif-icerik">
        <h3 className="tarif-ad">{recipe.name}</h3>
        <div className="tarif-puan">
          Eşleşme Puanı: <span>{recipe.matchScore}%</span>
        </div>
        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <div className="eksik-malzemeler">
            <h4>Eksik Malzemeler:</h4>
            <ul>
              {recipe.missingIngredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarifKarti;
