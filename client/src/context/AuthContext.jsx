import React, { createContext, useState, useContext } from 'react';
import { setToken as setApiToken } from '../api/index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  const login = (newToken, userData) => {
    setTokenState(newToken); // Token'ı React state'inde (bellekte) tutar
    setUser(userData);
    setApiToken(newToken);   // Axios interceptor'ın erişebilmesi için ayarlar
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
    setApiToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kullanımı için export
export const useAuth = () => useContext(AuthContext);
