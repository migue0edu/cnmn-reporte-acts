const express = require('express');
const MySQL = require('../connector/mysql');

let app = express();

app.post('/empleados', (req, res) => {
    const DEFAUTL_ROLE = 2;
    let mysqlConn = null;

    /* Guarda en la bd un nuevo usuario */
    console.log( JSON.stringify(req.body) );
    
    
    if( req.body ){
        let {nombres, a_pat, a_mat, clave, curp, telefono, correo} = req.body;
        // mysqlConn = new MySQL('localhost', 'node_test', 'cnmn_test0', 'bitacora_act');
        mysqlConn = new MySQL();
        let queryTemplate =  'INSERT INTO usuarios ( nombres, apellido_pat, apellido_mat, clave_empleado, curp, telefono, correo, roles_id_rol, departamentos_id_dept) ';
            queryTemplate += 'VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let values = [ 3, nombres, a_pat, a_mat, clave, curp, telefono, correo, DEFAUTL_ROLE, 2];
        let formatedQuery = mysqlConn.conection.format(queryTemplate, values);
        console.log('formatedQuery: ', formatedQuery);
        mysqlConn.ejecutarInsert( formatedQuery, (err, empleado) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            else {
                res.json({
                    ok: true,
                    empleado
                });
            }
        });
    }else{
        res.status(500).json({
            ok: false
        });
    }

});

module.exports = app;