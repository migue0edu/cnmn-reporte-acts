const express = require('express');
const app = express();

//Poner endpoints aquí 
app.use( require('./empleados') );
app.use( require('./documentos') );
// app.use( require('./login') );

module.exports = app;