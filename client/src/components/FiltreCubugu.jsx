import React from 'react';

const FiltreCubugu = ({ filters, onFilterChange }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange({ ...filters, [name]: checked });
  };

  return (
    <div className="filtre-cubugu">
      <label className="filtre-secenek">
        <input
          type="checkbox"
          name="lowCalorie"
          checked={filters?.lowCalorie || false}
          onChange={handleCheckboxChange}
        />
        🥗 Düşük Kalorili (&lt; 500 kcal)
      </label>
      <label className="filtre-secenek">
        <input
          type="checkbox"
          name="fast"
          checked={filters?.fast || false}
          onChange={handleCheckboxChange}
        />
        ⏱️ Hızlı Tarif (&lt; 30 dk)
      </label>
    </div>
  );
};

export default FiltreCubugu;
