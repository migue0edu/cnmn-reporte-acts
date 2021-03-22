const express = require('express');
const MySQL = require('../connector/mysql');

let app = express();

app.get('/empleados/:id_text', (req, res) => {
    /* Obtiene las sugerencias para el autocompletado de la generación del reporte */

    let mysqlConn = null;
    let input = req.params.id_text || '';
    console.log('input: ' + input);
    if( input ){
        mysqlConn = new MySQL();
        let escapeId = mysqlConn.conection.escape ( `%${input}%` );
        let query = `SELECT * FROM usuarios WHERE clave_empleado LIKE ${escapeId} `;
            query += 'ORDER BY nombres ASC LIMIT 10';
        mysqlConn.ejecutarQuery( query, (err, empleados) => {
            if (err) {
                res.json([{
                    nombres: "Sin",
                    apellido_pat:" ",
                    apellido_mat:"Coincidencias"
                }])                
            }
            else {
                res.json(
                    empleados
                );
            }
        });
    }

});

app.post('/empleados', (req, res) => {
    const DEFAUTL_ROLE = 2;
    let mysqlConn = null;

    /* Guarda en la bd un nuevo usuario */
    console.log( JSON.stringify(req.body) );
    
    if( req.body ){
        console.log(req.body.nombre)
        let {nombre, aPat, aMat, idEmp, curp, tel, ext, mail, depto} = req.body;
        let passw = 'cnmn2021';
        mysqlConn = new MySQL();
        let queryTemplate =  'INSERT INTO usuarios ( nombres, apellido_pat, apellido_mat, clave_empleado, curp, telefono, extension, correo, roles_id_rol, departamentos_id_dept, passw) ';
            queryTemplate += 'VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let values = [ nombre, aPat, aMat, idEmp, curp, tel, ext, mail, DEFAUTL_ROLE, depto, passw];
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

app.get('/empleado/:id', (req, res) => {
    /* Obtener los datos del usuario */

    let mysqlConn = null;
    let input = req.params.id || '';
    console.log('Id: ' + input);
    if( input ){
        mysqlConn = new MySQL();
        let escapeId = mysqlConn.conection.escape ( `${input}` );
        let query = `select usuarios.*, departamentos.nombre as depto from usuarios, departamentos WHERE id = ${escapeId} AND  departamentos_id_dept = id_dept ;`;
        mysqlConn.ejecutarQuery( query, (err, db_user) => {
            if (err) {
                res.json({
                    ok: false,
                    error: err
                });             
            }
            else {
                res.json({
                    id: db_user[0].id,
                    nombre: db_user[0].nombres,
                    aPat: db_user[0].apellido_pat,
                    aMat: db_user[0].apellido_mat,
                    clave: db_user[0].clave_empleado,
                    curp: db_user[0].curp,
                    tel: db_user[0].telefono,
                    ext: db_user[0].extension,
                    correo: db_user[0].correo,
                    depto: db_user[0].depto
                });
            }
        });
    }
});

app.post('/password', (req, res) => {
    let mysqlConn = null;

    /* Guarda en la bd un nuevo usuario */
    console.log( JSON.stringify(req.body) );

    if( req.body ){
        console.log(req.body.nombre)
        mysqlConn = new MySQL();
        let {actual, nueva, confirmacion} = req.body;
        let escapePassw = mysqlConn.conection.escape ( `${actual}` );
        let escapeNueva = mysqlConn.conection.escape ( `${nueva}` );

        let query =  `SELECT passw FROM usuarios WHERE passw = ${escapePassw} AND id = ${req.session.userId}`;
        
        mysqlConn.ejecutarQuery( query, (err, dbres) => {
            if (err) {
                res.json({
                    result: false,
                    message: "No se a encontrado el registro solicitado."
                })                
            }
            else {
                console.log('PASSWORD: ' + JSON.stringify(dbres));
                if(dbres.length > 0){

                    let updateQuery = `UPDATE usuarios SET passw = ${escapeNueva} WHERE id = ${req.session.userId} LIMIT 1`;
                    mysqlConn.ejecutarQuery( updateQuery, (er, dbr) => {
                        if (er) {
                            res.json({
                                result: false,
                                message: "No se ah posido actualizar el registro."
                            })                
                        }else{
                            console.log('PASSWORD Actualizado.');
                        }
                        
                    })

                    res.json({result:true});
                }else{
                    res.json({
                        result: false
                    });
                }
            }
        });


    }else{
        res.status(500).json({
            ok: false
        });
    }
});

module.exports = app;