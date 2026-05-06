import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GirisSayfasi from './pages/GirisSayfasi';
import YuklemeSayfasi from './pages/YuklemeSayfasi';
import TarifListesi from './pages/TarifListesi';
import TarifDetayi from './pages/TarifDetayi';
import './App.css';

// Korumalı Rota Bileşeni
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GirisSayfasi />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <YuklemeSayfasi />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recipes" 
        element={
          <ProtectedRoute>
            <TarifListesi />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tarif/:id" 
        element={
          <ProtectedRoute>
            <TarifDetayi />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
