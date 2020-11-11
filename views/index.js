const express = require('express');
const app = express();

/* Poner aquí las vistas */

app.get('/',  (req, res) =>  {
	//home o index pagina prinicpal
})
app.get('/views/emp', function (req, res) {
  res.render('empleados');
});
app.get('/views/reg', function (req, res) {
  res.render('registro_empleados');
});

module.exports = app;