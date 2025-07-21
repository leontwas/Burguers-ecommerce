// src/components/PrivateRoutes.jsx
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types'; 
import { useAuth } from '../context/AuthProvider'; 

export default function PrivateRoutes({ adminOnly = false }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '1.5em' }}>
        Cargando...
      </div>
    );
  }

  if (!currentUser) {
    // Si no hay usuario, redirigir a la página de login
    return <Navigate to="/Login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Si la ruta es solo para admin y el usuario no es admin, redirigir a una página de no autorizado o al inicio
    return <Navigate to="/" replace />;
  }

  // Si el usuario está logueado (y es admin si adminOnly es true), permite el acceso a la ruta anidada
  return <Outlet />;
}

PrivateRoutes.propTypes = {
  adminOnly: PropTypes.bool,
};