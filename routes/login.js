const express = require('express');
const MySQL = require('../connector/mysql');

let app = express();

app.post('/login', (req, res) => {
    /* Valida los datos para el incio de sesion */
    let mysqlConn = null;
    if( req.body ){
        let {usuario, curp} = req.body;
        mysqlConn = new MySQL();
        let escapeUser = mysqlConn.conection.escape ( `${usuario}` );
        let escapeCurp = mysqlConn.conection.escape ( `${curp}` );
        let query = `SELECT id, roles_id_rol, departamentos_id_dept FROM usuarios WHERE clave_empleado = ${escapeUser} AND curp = ${escapeCurp}`;
        mysqlConn.ejecutarQuery( query, (err, dbres) => {
            if (err) {
                res.json({
                    result: false,
                    message: "No se a encontrado el registro solicitado."
                })                
            }
            else {
                console.log(JSON.stringify(dbres));
                if(dbres[0].id){
                    req.session.userId = dbres[0].id;
                    req.session.userRole = dbres[0].roles_id_rol;
                    req.session.depto = dbres[0].departamentos_id_dept;
                    res.json({result:true})
                }else{
                    res.json({
                        result: false
                    });
                }
            }
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/views/login');
});


module.exports = app;