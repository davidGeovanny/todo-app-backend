const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const path = require('path');

/** Crear servidor */
const app = express();

/** Conexión a BD */
dbConnection();

/** CORS */
app.use( cors() );

/** Directorio público */
app.use( express.static('public') );

/** Lectura y parseo del body */
app.use( express.json() );

/** Directorio de rutas */
app.use('/api/auth/', require('./routes/auth'));

/** Escuchar peticiones */
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
} );