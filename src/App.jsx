// src/components/LoginPage.jsx
import Login from '../src/components/Login';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Si el usuario ya está logueado, redirigir al inicio
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    // Redirigir al inicio después del login exitoso
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#081b29',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <Login onClose={handleLoginSuccess} />
    </div>
  );
}