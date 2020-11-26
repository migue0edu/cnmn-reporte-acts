const express = require('express');
const app = express();

/* Poner aquí las vistas */

app.get('/',  (req, res) =>  {
	//home o index pagina prinicpal
})
app.get('/views/reporte', function (req, res) {
  res.render('reporte');
});
app.get('/views/registro', function (req, res) {
  res.render('registro_empleados');
});
app.get('/views/historial', function (req, res) {
  res.render('historial');
});
// app.get('/views/login', function (req, res) {
//   res.render('login');
// });
module.exports = app;