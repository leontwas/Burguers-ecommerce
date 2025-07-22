// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  const [loggedInSuccessfully, setLoggedInSuccessfully] = useState(false);
  const loginHandledRef = useRef(false);

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

            if (userData.role === 'admin') {
              const idToken = await user.getIdToken();
              localStorage.setItem('adminToken', idToken);
              console.log("ID Token de admin guardado:", idToken);
            } else {
              localStorage.removeItem('adminToken');
            }

            if (loggedInSuccessfully && !loginHandledRef.current) {
              await Swal.fire({
                title: '¡Inicio de Sesión Exitoso!',
                text: `Bienvenido de nuevo, ${userData.username || user.email}.`,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: 'center'
              });
              navigate('/');
              setLoggedInSuccessfully(false);
              loginHandledRef.current = true;
            }

          } else {
            await setDoc(userDocRef, {
              email: user.email,
              role: 'user',
              createdAt: new Date().toISOString(),
              username: user.email
            }, { merge: true });
            setIsAdmin(false);
            setCurrentUsername(user.email);
            localStorage.removeItem('adminToken');

            if (loggedInSuccessfully && !loginHandledRef.current) {
              await Swal.fire({
                title: '¡Registro Exitoso!',
                text: `Bienvenido, ${user.email}.`,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: 'center'
              });
              navigate('/');
              setLoggedInSuccessfully(false);
              loginHandledRef.current = true;
            }
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario desde Firestore:", error);
          setIsAdmin(false);
          setCurrentUsername(null);
          localStorage.removeItem('adminToken');
        }
      } else {
        setIsAdmin(false);
        setCurrentUsername(null);
        localStorage.removeItem('adminToken');
        loginHandledRef.current = false;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loggedInSuccessfully, navigate]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setLoggedInSuccessfully(true);
      loginHandledRef.current = false;
      return userCredential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (email, password, role = 'user') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, `users/${user.uid}`);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString()
      }, { merge: true });

      if (role === 'admin') {
        const idToken = await user.getIdToken();
        localStorage.setItem('adminToken', idToken);
        console.log("ID Token de admin guardado en registro:", idToken);
      }

      await Swal.fire({
        title: '¡Registro Exitoso!',
        text: `Bienvenido, ${user.email}.`,
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
      localStorage.removeItem('adminToken');
      Swal.fire({
        title: 'Sesión Cerrada',
        text: 'Has cerrado sesión correctamente.',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/login');
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
      {/* ⭐ CORRECCIÓN CLAVE AQUÍ: Siempre renderiza los hijos */}
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};