const express = require('express');
const cors = require('cors');
const productos = require('./productos.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir que React acceda
app.use(cors());

// Servir archivos estáticos desde /public
app.use(express.static('public'));

// Endpoint para obtener productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
