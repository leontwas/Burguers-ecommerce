// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase (la obtienes desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCRituPuQrieOg90_5yZeZPsxmGgpy2kq4",
  authDomain: "gloriosaburgersecom.firebaseapp.com",
  projectId: "gloriosaburgersecom",
  storageBucket: "gloriosaburgersecom.firebasestorage.app",
  messagingSenderId: "925397194506",
  appId: "1:925397194506:web:870a92612c0a6cfc7accf3",
  measurementId: "G-HJJ6873G2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
