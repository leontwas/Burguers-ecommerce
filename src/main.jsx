// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoProvider';
import { LoginModalProvider } from './context/LoginModalContext';
import { AuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginModalProvider> {/* ✅ envuelve todo */}
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    </LoginModalProvider>
  </React.StrictMode>
);
