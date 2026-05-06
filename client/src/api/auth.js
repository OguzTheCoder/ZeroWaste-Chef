import api from './index';

// Kayıt Ol isteği
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Giriş Yap isteği
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // Örnek Dönüş: { access_token: "...", user: {...} }
};
