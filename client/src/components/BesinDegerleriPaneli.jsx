import React from 'react';

const BesinDegerleriPaneli = ({ nutrition }) => {
  if (!nutrition) return null;

  return (
    <div className="besin-paneli">
      <h3 className="bolum-basligi">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Besin Değerleri
      </h3>
      
      <div className="makro-grid">
        <div className="makro-kutu">
          <span className="makro-isim">Kalori</span>
          <span className="makro-deger">{nutrition.calories} <span style={{fontSize: '1rem', color: '#d8b4fe'}}>kcal</span></span>
        </div>
        <div className="makro-kutu">
          <span className="makro-isim">Protein</span>
          <span className="makro-deger">{nutrition.protein}<span style={{fontSize: '1rem', color: '#d8b4fe'}}>g</span></span>
        </div>
        <div className="makro-kutu">
          <span className="makro-isim">Karbonhidrat</span>
          <span className="makro-deger">{nutrition.carbs}<span style={{fontSize: '1rem', color: '#d8b4fe'}}>g</span></span>
        </div>
        <div className="makro-kutu">
          <span className="makro-isim">Yağ</span>
          <span className="makro-deger">{nutrition.fat}<span style={{fontSize: '1rem', color: '#d8b4fe'}}>g</span></span>
        </div>
      </div>

      <div className="mikro-bolum">
        <h4>Vitaminler & Mineraller</h4>
        <div className="mikro-liste">
          {nutrition.micros && nutrition.micros.map((mikro, index) => (
            <div key={index} className="mikro-satir">
              <span>{mikro.name}</span>
              <span>{mikro.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BesinDegerleriPaneli;
