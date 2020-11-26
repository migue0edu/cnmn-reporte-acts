const express = require('express');
const MySQL = require('../connector/mysql');

let app = express();

app.post('/login', (req, res) => {
    /* Valida los datos para el incio de sesion */

    let mysqlConn = null;
    if( req.body ){
        let {usuario, curp} = req.body;
        mysqlConn = new MySQL();
        let escapeUser = mysqlConn.conection.escape ( `%${usuario}%` );
        let escapeCurp = mysqlConn.conection.escape ( `%${curp}%` );
        let query = `SELECT COUNT(id) AS results FROM usuarios WHERE clave_empleado = ${escapeUser} && curp = ${escapeCurp}`;
        mysqlConn.ejecutarQuery( query, (err, dbres) => {
            if (err) {
                res.status(500).json([{
                    message: "Error at fetching data."
                }])                
            }
            else {
                console.log(JSON.stringify(dbres));
                if(dbres[0].results){
                    res.redirect('/views/emp');
                }
                res.json({
                    result: false
                });
            }
        });
    }

});

module.exports = app;