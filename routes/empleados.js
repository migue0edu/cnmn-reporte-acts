const express = require('express');
const MySQL = require('../connector/mysql');

let app = express();

app.get('/empleados/:id_text', (req, res) => {
    /* Obtiene las sugerencias para el autocompletado de la generación del reporte */

    let mysqlConn = null;
    let input = req.params.id_text || '';
    console.log('input: ' + input);
    if( input ){
        // mysqlConn = new MySQL('localhost', 'node_test', 'cnmn_test0', 'bitacora_act');
        mysqlConn = new MySQL();
        let escapeId = mysqlConn.conection.escape ( `%${input}%` );
        let query = `SELECT nombres, apellido_pat, apellido_mat, curp, telefono, correo FROM usuarios WHERE clave_empleado LIKE ${escapeId} `;
            query += 'ORDER BY nombres ASC LIMIT 10';
        mysqlConn.ejecutarQuery( query, (err, empleados) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            else {
                res.json({
                    ok: true,
                    empleados
                });
            }
        });
    }

});

module.exports = app;