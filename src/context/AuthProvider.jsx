// src/context/AuthProvider.jsx
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
      if (user?.email === 'admin' && user.uid === 'admin') {
        setCurrentUser(user);
        setIsAdmin(true);
        setCurrentUsername('Administrador');
        return setLoading(false);
      }

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
            await setDoc(userDocRef, {
              email: user.email,
              role: 'user',
              createdAt: new Date().toISOString(),
              username: user.email
            }, { merge: true });
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
      if (email === 'admin' && password === '1234') {
        const fakeAdminUser = { email: 'admin', uid: 'admin' };
        setCurrentUser(fakeAdminUser);
        setIsAdmin(true);
        setCurrentUsername('Administrador');

        await Swal.fire({
          title: 'Bienvenido Admin!',
          text: 'Has iniciado sesión como administrador.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        navigate('/');
        return fakeAdminUser;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await Swal.fire({
        title: 'Inicio de sesión exitoso',
        text: `Bienvenido, ${user.email}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/');
      return user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (email, password, role = 'user') => {
    if (email === 'admin@gmail.com') {
      throw new Error('Este correo está reservado para uso interno.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, `users/${user.uid}`);
      await setDoc(userDocRef, {
        email: user.email,
        role,
        createdAt: new Date().toISOString()
      }, { merge: true });

      await Swal.fire({
        title: 'Registro Exitoso!',
        text: `Bienvenido, ${user.email}.`,
        icon: 'success',
        timer: 2000,
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
