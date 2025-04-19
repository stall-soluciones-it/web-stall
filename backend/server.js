const express = require('express');
const { create } = require('xmlbuilder2');
const fs = require('fs');
const cors = require('cors');

console.log('Starting server setup...');

const app = express();

// Configurar CORS para permitir solo los dominios de stall
app.use(
  cors({
    origin: ['https://stall.ar', 'https://www.stall.ar', 'https://stall.com.ar', 'https://www.stall.com.ar'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

console.log('Middleware configured');

// Endpoint de prueba
app.get('/health', (req, res) => {
  console.log('Received request to /health');
  res.status(200).json({ message: 'Backend está funcionando correctamente' });
});

// Ruta para guardar el contacto en un archivo XML
app.post('/save-contact', (req, res) => {
  console.log('Received request to /save-contact');
  const { name, email, message } = req.body;

  // Validar datos
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Validar formato de correo electrónico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Correo electrónico inválido' });
  }

  // Ruta del archivo XML
  const xmlFilePath = './data/contacts.xml';

  // Crear el objeto del nuevo contacto
  const newContact = {
    contact: {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    // Verificar si la carpeta /data existe
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data', { recursive: true });
    }

    // Verificar si el archivo XML ya existe
    let doc;
    if (fs.existsSync(xmlFilePath)) {
      const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
      if (!xmlContent) {
        throw new Error('El archivo XML está vacío o corrupto');
      }
      doc = create(xmlContent);
      doc.root().ele(newContact);
    } else {
      doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('contacts').ele(newContact);
    }

    // Escribir el archivo actualizado
    const xmlString = doc.end({ prettyPrint: true });
    fs.writeFileSync(xmlFilePath, xmlString, 'utf8');

    res.status(200).json({ message: 'Mensaje enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    res.status(500).json({ message: `Error al enviar el mensaje: ${error.message}` });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});