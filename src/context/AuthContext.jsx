import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

// Configuración de Firebase - REEMPLAZA con tu configuración real
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-project.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};

// Crea el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Verificar que la configuración de Firebase esté presente
        if (!firebaseConfig.projectId) {
          console.error("Firebase config is missing. Please configure firebaseConfig.");
          setLoading(false);
          return;
        }

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        // Listener para cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          setCurrentUser(user);
          if (user) {
            try {
              // Obtener el rol del usuario desde Firestore
              const userDocRef = doc(firestoreDb, `users/${user.uid}`);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setIsAdmin(userData.role === 'admin');
              } else {
                // Si el usuario no tiene un documento de rol, crear uno con rol 'user'
                await setDoc(userDocRef, { 
                  email: user.email, 
                  role: 'user',
                  createdAt: new Date().toISOString()
                });
                setIsAdmin(false);
              }
            } catch (error) {
              console.error("Error al obtener datos del usuario:", error);
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de Inicialización',
          text: `No se pudo iniciar Firebase: ${error.message}`,
        });
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  // Funciones de autenticación
  const login = async (email, password) => {
    if (!auth) {
      throw new Error('Firebase no está inicializado');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (email, password, role = 'user') => {
    if (!auth || !db) {
      throw new Error('Firebase no está inicializado');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Guardar el rol del usuario en Firestore
      const userDocRef = doc(db, `users/${user.uid}`);
      await setDoc(userDocRef, { 
        email: user.email, 
        role: role,
        createdAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      return;
    }
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
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
    loading,
    login,
    register,
    logout,
    db,
    auth
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