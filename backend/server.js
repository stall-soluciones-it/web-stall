const express = require('express');
const { create } = require('xmlbuilder2');
const fs = require('fs');
const cors = require('cors');
// Importar rate limiter
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

console.log('Starting server setup...');

const app = express();

// Configurar rate limiter (aumentado a 15 intentos)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // limitar a 15 intentos por ventana por IP
  standardHeaders: true, // Devolver info de rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar los headers `X-RateLimit-*`
  message: { message: 'Demasiados intentos desde esta IP, por favor intente más tarde' }
});

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

// Validadores para el formulario
const contactValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El formato de email es inválido')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty().withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 1000 }).withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
    .escape()
];

// Endpoint de prueba
app.get('/health', (req, res) => {
  console.log('Received request to /health');
  res.status(200).json({ message: 'Backend está funcionando correctamente' });
});

// Aplicar rate limiting y validación al endpoint de contacto
app.post('/save-contact', contactLimiter, contactValidators, (req, res) => {
  console.log('Received request to /save-contact');
  
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Error de validación', 
      errors: errors.array().map(err => err.msg)
    });
  }
  
  const { name, email, message } = req.body;

  // Ruta del archivo XML
  const xmlFilePath = './data/contacts.xml';

  // Crear el objeto del nuevo contacto
  const newContact = {
    contact: {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      ip: req.ip || 'unknown', // Registrar IP para análisis de seguridad
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