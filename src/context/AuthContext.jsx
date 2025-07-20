// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsAdmin(userData.role === 'admin');
            setCurrentUsername(userData.username || user.email);
          } else {
            // Si el usuario de Firebase Auth existe pero no tiene documento en Firestore,
            // creamos uno por defecto. Esto es útil para usuarios que se autenticaron
            // antes de que se implementara la lógica de Firestore para roles/usernames.
            // Para usuarios nuevos registrados con el formulario, esto no debería ejecutarse.
            await setDoc(userDocRef, {
              email: user.email,
              role: 'user', // Por defecto 'user' si el documento no existía.
              createdAt: new Date().toISOString(),
              username: user.email // Por defecto el email como username si no se especificó.
            }, { merge: true }); // Usar merge para no sobrescribir si ya existe algo.
            setIsAdmin(false);
            setCurrentUsername(user.email);
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario desde Firestore:", error);
          setIsAdmin(false);
          setCurrentUsername(null);
        }
      } else {
        setIsAdmin(false);
        setCurrentUsername(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Una vez logueado, esperamos a que onAuthStateChanged actualice los estados.
      // Pero para el Swal.fire inmediato, podemos buscar el username de una vez.
      const userDocRef = doc(db, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : { username: user.email }; // Fallback a email si no hay datos de usuario

      await Swal.fire({
        title: '¡Inicio de Sesión Exitoso!',
        text: `Bienvenido de nuevo, ${userData.username || user.email}.`, // Usamos el username del documento o el email
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center'
      });

      navigate('/');

      return user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  // ✅ CORRECCIÓN: Ahora `register` acepta `username` como tercer argumento
  const register = async (email, password, username, role = 'user') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, `users/${user.uid}`);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
        username: username, // ✅ Se guarda el username proporcionado
      }, { merge: true });

      await Swal.fire({
        title: '¡Registro Exitoso!',
        text: `Bienvenido, ${username || user.email}.`, // ✅ Usamos el username para el mensaje
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center'
      });
      navigate('/');

      return user;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cerrar sesión',
        text: error.message,
      });
    }
  };

  const value = {
    currentUser,
    isAdmin,
    currentUsername,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};