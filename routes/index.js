const express = require('express');
const app = express();

//Poner endpoints aquí 
app.use( require('./empleados') );
app.use( require('./documentos') );
app.use( require('./login') );
app.use( require('./solicitud_servs') );

module.exports = app;