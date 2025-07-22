// src/components/PrivateRoutes.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import PropTypes from 'prop-types';

export default function PrivateRoutes({ adminOnly = false }) {
  const { currentUser, isAdmin, loading } = useAuth();

  // Muestra un spinner o mensaje de carga mientras se determina el estado de autenticación
  if (loading) {
    return (
      <div className="loading-spinner" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Cargando autenticación...
      </div>
    );
  }

  // Si no hay usuario logueado, redirige al home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere ser admin y el usuario no es admin, redirige
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza las rutas anidadas
  return <Outlet />;
}

PrivateRoutes.propTypes = {
  adminOnly: PropTypes.bool,
};