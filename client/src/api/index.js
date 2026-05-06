import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// Güvenlik Kuralı: Token localStorage'da tutulmaz, sadece bellekte tutulur
let inMemoryToken = null;

// AuthContext tarafından çağrılarak token güncellenir
export const setToken = (token) => {
  inMemoryToken = token;
};

// İstek yapılmadan önce araya giren (Interceptor) fonksiyon
api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers['Authorization'] = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı: 401 hatası (token süresi dolması vb.) durumunda kullanıcıyı login'e atar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      inMemoryToken = null;
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mevcut api sarmalayıcıları
export const analyzeImage = async (base64Image) => {
  const response = await api.post('/analyze', { image: base64Image });
  return response.data;
};

export const getRecipes = async (ingredients, filters = {}) => {
  const params = new URLSearchParams();
  if (ingredients && ingredients.length > 0) {
    ingredients.forEach(i => params.append('ingredients', i));
  }
  if (filters.lowCalorie) params.append('lowCalorie', 'true');
  if (filters.fast) params.append('fast', 'true');

  const response = await api.get(`/recipes?${params.toString()}`);
  return response.data;
};

export const getNutrition = async (recipeId) => {
  const response = await api.get(`/nutrition/${recipeId}`);
  return response.data;
};

export const voiceQuery = async (queryText, recipeId = null) => {
  const payload = { query: queryText };
  if (recipeId) payload.recipe_id = recipeId;
  const response = await api.post('/voice', payload);
  return response.data;
};

export default api;
