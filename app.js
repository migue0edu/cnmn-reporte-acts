const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser')
require('./hbs/helper');

/* Configuración de datos y variables del servidor */
require('./config/config');

/* Formatos de entrada de datos */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Configuración de elementos estaticos */
app.use(express.static(__dirname + '/views'))
app.use('/node', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/parciales');

/* --- Configuración rutas --- */

// Vistas
app.use( require('./views/index') );
//Rutas para consumo interno
app.use( require('./routes/index') );

/* Lanzar servidor */
app.listen(process.env.PORT, () => {
	console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`)
})
//http://localhost:3000/views/emp  http://localhost:3000/views/emp