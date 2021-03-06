const express = require('express');
const MySQL = require('../connector/mysql');
const app = express();
const hbs = require('hbs');
hbs.registerHelper('getNombre',() => {
	console.log('View Reporte holaaaaaa', JSON.stringify(req.session));
  if( !req.session.userId ){
    return res.redirect('/views/login');
  }
  getUserData( req.session.userId, (err, user) => {
    if(err){
      res.status(500).json({mensaje: err});
    }
    if(user){
      return user.nombre;
    }
  });

	//return new Date().getFullYear();
})

function getUserData( userId, callback ) {
  let mysqlConn = null;
  let nameString = '';
  let userObj = null;
  console.log('UserId: ' + userId);
  if( userId ){
    mysqlConn = new MySQL();
    let escapeId = mysqlConn.conection.escape ( `${userId}` );
    let query = `select usuarios.*, departamentos.nombre as depto from usuarios, departamentos WHERE id = ${escapeId} AND  departamentos_id_dept = id_dept ;`;
     
    mysqlConn.ejecutarQuery( query, (err, db_user) => {
      if (err) {
        console.log('Usuario no encontrado');  
        return callback(err, null);
      }
      else {
        nameString = `${db_user[0].nombres} ${db_user[0].apellido_pat} ${db_user[0].apellido_mat}`;
        console.log('db_user', JSON.stringify(db_user) );
        userObj = {
            id: db_user[0].id,
            nombreCompleto: nameString,
            nombre: db_user[0].nombres,
            aPat: db_user[0].apellido_pat,
            aMat: db_user[0].apellido_mat,
            clave: db_user[0].clave_empleado,
            curp: db_user[0].curp,
            tel: db_user[0].telefono,
            ext: db_user[0].extension,
            correo: db_user[0].correo,
            depto: db_user[0].depto
        };
        return callback(null, userObj);
      }
    });
  }
}

module.exports = app;