import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GirisSayfasi from './pages/GirisSayfasi';
import YuklemeSayfasi from './pages/YuklemeSayfasi';
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
        element={<YuklemeSayfasi />} 
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
