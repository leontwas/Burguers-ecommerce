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
            // ⭐ CORRECCIÓN: Usar user.email como fallback para username inicial
            await setDoc(userDocRef, {
              email: user.email,
              role: 'user',
              createdAt: new Date().toISOString(),
              username: user.email // Si no hay un username definido al crear en Firebase Auth, usamos el email
            }, { merge: true });
            setIsAdmin(false);
            setCurrentUsername(user.email); // Setear el username predeterminado
          }
        } catch (error) {
          console.error("Error al obtener o crear datos del usuario en Firestore:", error);
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

      // ⭐ MEJORA: Obtener el username de Firestore para el mensaje de bienvenida
      const userDocRef = doc(db, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {}; // Obtener datos del usuario, o un objeto vacío si no existe

      await Swal.fire({
        title: '¡Inicio de Sesión Exitoso!',
        text: `Bienvenido de nuevo, ${userData.username || user.email}.`, // Usar el username de Firestore o el email
        icon: 'success',
        timer: 2000,
        timerProgressBar: true, // ⭐ Consistencia: Añadido aquí
        showConfirmButton: false,
        position: 'center' // ⭐ Consistencia: Añadido aquí
      });

      navigate('/');
      return user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, `users/${user.uid}`);
      await setDoc(userDocRef, {
        email: user.email,
        username: username,
        role: 'user', // Asumiendo 'user' como rol por defecto en el registro
        createdAt: new Date().toISOString()
      }, { merge: true });

      await Swal.fire({
        title: '¡Registro Exitoso!',
        text: `Bienvenido, ${username || user.email}.`, // Usar el username proporcionado o el email
        icon: 'success',
        timer: 2000,
        timerProgressBar: true, // ⭐ Consistencia: Añadido aquí
        showConfirmButton: false,
        position: 'center' // ⭐ Consistencia: Añadido aquí
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