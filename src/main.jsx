import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App'; 
/*import './css/fuentes.css';*/
import './css/header.css'
import './css/footer.css';
import './css/styleProductos.css';
import './css/galeria.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
