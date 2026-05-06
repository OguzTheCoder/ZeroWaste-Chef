import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const GirisSayfasi = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Giriş Yap
        const data = await loginUser({ email: formData.email, password: formData.password });
        // Başarılı giriş: Token'ı AuthContext üzerinden belleğe (memory) al
        login(data.access_token, data.user); 
        navigate('/'); // Giriş sonrası ana sayfaya yönlendir
      } else {
        // Kayıt Ol
        await registerUser(formData);
        // Kayıt başarılıysa girişe formuna geçiş yap
        setIsLogin(true);
        setError("Kayıt başarılı! Lütfen giriş yapın.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>İsim:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required={!isLogin} 
            />
          </div>
        )}
        <div className="form-group">
          <label>E-posta:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Şifre:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
        </button>
      </form>
      
      <button 
        className="toggle-btn" 
        onClick={() => setIsLogin(!isLogin)} 
        type="button" 
        style={{ marginTop: '15px', background: 'transparent', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isLogin ? 'Hesabınız yok mu? Kayıt Olun' : 'Zaten hesabınız var mı? Giriş Yapın'}
      </button>
    </div>
  );
};

export default GirisSayfasi;
