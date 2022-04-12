const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// Crear el server/app de express
const app = express();

// DB conexión
dbConnection();

// Directorio público
app.use( express.static('public'));

// CORS middleware
app.use( cors() );

// Lectura y parseo del body middleware
app.use( express.json() );

// Middleware rutas
app.use( '/api/auth', require('./routes/auth') );

// Handler para demás rutas
app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html') )
})

app.listen( process.env.PORT, () => {
    console.log(`Server running at ${4000}`);
});