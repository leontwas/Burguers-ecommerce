// src/components/PrivateRoutes.jsx
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importa PropTypes
import { useAuth } from '../context/AuthProvider'; // Asegúrate de que la ruta sea correcta

export default function PrivateRoutes({ adminOnly = false }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    // Puedes reemplazar esto con un spinner de carga real
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
    // Puedes crear una página "/unauthorized" o simplemente redirigir a "/"
    return <Navigate to="/" replace />;
  }

  // Si el usuario está logueado (y es admin si adminOnly es true), permite el acceso a la ruta anidada
  return <Outlet />;
}

// Añade la validación de props para 'adminOnly'
PrivateRoutes.propTypes = {
  adminOnly: PropTypes.bool,
};