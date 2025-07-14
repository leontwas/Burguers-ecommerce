import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App'; 
/*import './css/fuentes.css';*/
import './css/header.css'
import './css/footer.css';
import './css/styleProductos.css';
import './css/galeria.css';

// OPCIÓN 1: Mantener main.jsx como está (RECOMENDADO)
// Tu configuración actual está bien, el AuthProvider en App.jsx es correcto
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// OPCIÓN 2: Si quisieras mover AuthProvider aquí (alternativa)
/*
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
*/