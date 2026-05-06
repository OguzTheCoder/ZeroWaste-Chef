import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRecipes } from '../api';
import TarifKarti from '../components/TarifKarti';
import FiltreCubugu from '../components/FiltreCubugu';
import './TarifListesi.css';

const TarifListesi = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // YuklemeSayfasi'ndan gelen tespit edilmiş malzemeler
  const initialIngredients = location.state?.ingredients || [];
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    lowCalorie: false,
    fast: false
  });

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      /*
       * NOT: Backend sunucusu şu an aktif olmadığı için geçici (mock) veri kullanıyoruz.
       * Backend hazır olduğunda alttaki yorum satırlarını kullanabilirsiniz:
       * 
       * const data = await getRecipes(initialIngredients, filters);
       * setRecipes(data.recipes || []);
       */
      
      // MOCK YANIT:
      setTimeout(() => {
        let mockRecipes = [
          {
            id: '1',
            name: 'Menemen',
            image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
            matchScore: 95,
            missingIngredients: ['Tereyağı'],
            isFast: true,
            isLowCalorie: true
          },
          {
            id: '2',
            name: 'Sebzeli Krep',
            image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=500&q=80',
            matchScore: 80,
            missingIngredients: ['Un', 'Zeytinyağı'],
            isFast: true,
            isLowCalorie: false
          },
          {
            id: '3',
            name: 'Fırın Makarna',
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
            matchScore: 60,
            missingIngredients: ['Makarna', 'Kaşar Peyniri', 'Kıyma'],
            isFast: false,
            isLowCalorie: false
          }
        ];

        // Filtreleri yerel olarak uygula (Gerçekte bu filtrelemeyi backend yapacak)
        if (filters.lowCalorie) {
          mockRecipes = mockRecipes.filter(r => r.isLowCalorie);
        }
        if (filters.fast) {
          mockRecipes = mockRecipes.filter(r => r.isFast);
        }

        setRecipes(mockRecipes);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Tarifler getirilirken hata oluştu:', error);
      setLoading(false);
    }
  };

  // Filtreler değiştiğinde veya sayfa yüklendiğinde tarifleri getir
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleRecipeClick = (id) => {
    navigate(`/tarif/${id}`);
  };

  return (
    <div className="tarif-listesi-container">
      <h1 className="sayfa-baslik">Sizin İçin Önerilen Tarifler</h1>
      
      <FiltreCubugu filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          Tarifler eşleştiriliyor...
        </div>
      ) : (
        <>
          {recipes.length > 0 ? (
            <div className="tarif-grid">
              {recipes.map(recipe => (
                <TarifKarti 
                  key={recipe.id} 
                  recipe={recipe} 
                  onClick={handleRecipeClick} 
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Üzgünüz, kriterlerinize uygun tarif bulunamadı.</h3>
              <p>Lütfen filtreleri değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TarifListesi;
