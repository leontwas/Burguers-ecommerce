// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Crea el AuthContext
const AuthContext = createContext();

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Este error solo debería ocurrir si useAuth es llamado fuera de AuthProvider
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Componente Proveedor de Autenticación
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [loading, setLoading] = useState(true); // Indica si la autenticación inicial está cargando
  const navigate = useNavigate();

  useEffect(() => {
    // Suscribe al estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Si hay un usuario, intenta obtener sus datos de Firestore
        try {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Si el documento existe, obtén el rol y el nombre de usuario
            const userData = userDocSnap.data();
            setIsAdmin(userData.role === 'admin');
            setCurrentUsername(userData.username || user.email);
            // Si es admin, guarda el token para verificaciones en rutas privadas
            if (userData.role === 'admin') {
              const idToken = await user.getIdToken();
              localStorage.setItem('adminToken', idToken);
            } else {
              localStorage.removeItem('adminToken'); // Limpiar token si no es admin
            }
          } else {
            // Si el documento no existe (ej. nuevo registro vía Firebase Auth sin Firestore inicial)
            // Crea el documento con rol 'user' por defecto y email como username inicial
            await setDoc(userDocRef, {
              email: user.email,
              role: 'user',
              createdAt: new Date().toISOString(),
              username: user.email // Fallback inicial para username
            }, { merge: true }); // Usar merge para no sobrescribir si ya existe alguna propiedad
            setIsAdmin(false);
            setCurrentUsername(user.email);
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error("Error al obtener o crear datos del usuario en Firestore:", error);
          setIsAdmin(false);
          setCurrentUsername(null);
          localStorage.removeItem('adminToken');
        }
      } else {
        // No hay usuario logueado
        setIsAdmin(false);
        setCurrentUsername(null);
        localStorage.removeItem('adminToken'); // Limpiar token si el usuario cierra sesión
      }
      setLoading(false); // La autenticación inicial ha terminado
    });

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []); // El efecto se ejecuta solo una vez al montar

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Vuelve a cargar los datos del usuario para actualizar el estado isAdmin/currentUsername
      const userDocRef = doc(db, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setIsAdmin(userData.role === 'admin');
        setCurrentUsername(userData.username || user.email);
        if (userData.role === 'admin') {
          const idToken = await user.getIdToken();
          localStorage.setItem('adminToken', idToken);
        }
      }
      // No navegamos aquí, el LoginModal o el componente de login manejará el cierre
      // y la redirección si es necesario, después de la llamada a esta función.
      return user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error; // Propagar el error para que el componente Login lo maneje
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda los datos del usuario en Firestore con rol por defecto 'user'
      const userDocRef = doc(db, `users/${user.uid}`);
      await setDoc(userDocRef, {
        email: user.email,
        username: username,
        role: 'user',
        createdAt: new Date().toISOString()
      }, { merge: true });

      setIsAdmin(false); // Un nuevo registro es siempre usuario normal
      setCurrentUsername(username);
      localStorage.removeItem('adminToken'); // Asegurarse que no haya token de admin

      return user;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error; // Propagar el error
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      // Limpiar estados y token al cerrar sesión
      setCurrentUser(null);
      setIsAdmin(false);
      setCurrentUsername(null);
      localStorage.removeItem('adminToken');
      navigate('/'); // Redirigir al home al cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error; // Propagar el error
    }
  };

  // Objeto de valor que se pasará a los componentes que consuman el contexto
  const value = {
    currentUser,
    isAdmin,
    currentUsername,
    loading, // Exportamos 'loading' para que los componentes puedan mostrar spinners
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* ⭐ LA CLAVE: Siempre renderiza los hijos. La lógica de 'loading'
           debe ser manejada por el componente AppContent o el router. */}
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};