import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import 'sweetalert2/dist/sweetalert2.min.css';
import App from './App'; 
import './css/header.css'
import './css/footer.css';
import './css/styleProductos.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

