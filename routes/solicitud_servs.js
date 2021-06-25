const express = require('express');
const MySQL = require('../connector/mysql');

let app = express();

app.post('/solicitud', (req, res) =>{
    let mysqlConn = null, formatedQuery = '';
    let queryTemplate = 'INSERT INTO solicutud_serv ( folio_udi_cnmn, laboratorio, equip_marca, equip_serie, equip_modelo, equip_serie_ins, equip_ip, equip_tipo, equip_reparacion, equip_instalacion, equip_observ_op, sserv_fecha, usuarios_id )'
        queryTemplate += 'VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';

    if( !req.session.userId ){
        return  res.status(401).json({ ok: false, mensaje: "Sin autorización" });
    }
    let user = req.session.userId;
    
    if( req.body ){
        mysqlConn = new MySQL();
        const solicitud = req.body;
        let values = [ 
            solicitud.folio,
            solicitud.laboratorio,
            solicitud.marca,
            solicitud.noSerie,
            solicitud.modelo,
            solicitud.serial,
            solicitud.ip,
            solicitud.tipo,
            solicitud.reparacion,
            solicitud.instalacion,
            solicitud.observaciones,
            solicitud.fecha,
            user
        ];
        
        if( !values[0] ){
            values[0] = '00000'
        }
        if( !values[1] ){
            values[1] = 'Laboratorio 1';
        }
        if( !values[11] ){
            values[11] = '2021-06-25 12:00:00';
        }

        formatedQuery = mysqlConn.conection.format(queryTemplate, values);
        console.log('formatedQuery: ', formatedQuery);

        mysqlConn.ejecutarInsert( formatedQuery, (err, sol_serv) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            else {
                res.json({
                    ok: true,
                    sol_serv
                });
            }
        });

    }

});

app.get('/solicitudes/historial/', (req, res) => {
    let mysqlConn = null;
    let solicitudes = [];
    let solicitudesObj = {};
    let hayError = false;
    let mensaje = '';

    if( !req.session.userId ){
        return  res.status(401).json({ ok: false, mensaje: "Sin autorización" });
    }

    mysqlConn = new MySQL();

    let query  = `SELECT sserv_id, DATE_FORMAT(sserv_fecha," %d-%m-%Y") as sserv_fecha, folio_udi_cnmn, laboratorio, equip_marca, equip_serie, equip_modelo, equip_serie_ins, equip_ip, equip_tipo, equip_reparacion, equip_instalacion, equip_observ_op, usuarios_id as sserv_user, usuarios.nombres, usuarios.apellido_pat, usuarios.apellido_mat, departamentos.nombre as departamento `;
        query += `FROM solicutud_serv INNER JOIN usuarios ON id = solicutud_serv.usuarios_id INNER JOIN departamentos ON usuarios.departamentos_id_dept = id_dept; `;

    console.log('Recuperando solicitudes de srvicios.');
    mysqlConn.ejecutarQuery( query, (err, results) => {
        if(err){
            hayError = true;
            mensaje = "Error al obtener documento";
        }else{
            if( results ){
                console.log('There are documents!');
                for(let registro of results){

                    solicitudes.push({

                        id: registro.sserv_id,
                        laboratorio: registro.laboratorio,
                        folio: registro.folio_udi_cnmn,
                        marca: registro.equip_marca,
                        serie: registro.equip_serie,
                        modelo: registro.equip_modelo,
                        institucional: registro.equip_serie_ins,
                        ip: registro.equip_ip,
                        tipo: registro.equip_tipo,
                        reparacion: registro.equip_reparacion,
                        instalacion: registro.equip_instalacion,
                        observaciones: registro.equip_observ_op,
                        fecha: registro.sserv_fecha,
                        area: registro.departamento,
                        nombre: `${registro.nombres} ${registro.apellido_pat} ${registro.apellido_mat}`
                    });

                }

                console.log('Solicitudes: ', JSON.stringify(solicitudes));
            }
        }

        hayError ? res.status(400).json({ ok: false, mensaje, error: err }) : res.json(solicitudes);
    });
});

app.get('/solicitudes/historial/:id', (req, res) => {
    let mysqlConn = null;
    let solicitud = { };
    let hayError = false;
    let mensaje = '', userId = '';

    // console.log('Session: ', JSON.stringify(req.session) );
    // if(!req.session.userId){
    //     return res.status(401).json({ mensaje: 'Unauhtorized' });
    // }else{
    //     userId = req.session.userId;
    // }

    const idDocument = req.params.id || '';

    if( idDocument ){
        mysqlConn = new MySQL();
        let escapeId = mysqlConn.conection.escape ( `${idDocument}` );
        let query  = `SELECT * FROM solicutud_serv `;
            query += `where id_doc = ${idDocument};`
        console.log('Query Documento: ' + query);

        getDocument( query, mysqlConn, (err, db_sserv) => {
            if(err){
                hayError = true;
                mensaje = "Error al obtener documento";
            }else{
                console.log('db_sserv: ' + JSON.stringify(db_sserv));

                if( db_sserv ){
                    
                    console.log('There is a document!');  
                    // solicitud.fecha.fechaCreacion = JSON.stringify(db_sserv[0].fecha_creacion).split("T")[0];           
                    // solicitud.fecha.fechaI = JSON.stringify(db_sserv[0].fecha_inicio).split("T")[0];
                    // solicitud.fecha.fechaF = JSON.stringify(db_sserv[0].fecha_fin).split("T")[0];
                    solicitud.empleado = db_sserv[0].usuario_id;

                    solicitud.id = db_sserv[0].sserv_id;
                    solicitud.folio = db_sserv[0].folio_udi_cnmn;
                    solicitud.laboratorio = db_sserv[0].laboratorio;
                    solicitud.marca = db_sserv[0].equip_marca;
                    solicitud.serie = db_sserv[0].equip_serie;
                    solicitud.modelo = db_sserv[0].equip_modelo;
                    solicitud.serie_ins = db_sserv[0].serie_ins;
                    solicitud.ip = db_sserv[0].equip_ip;
                    solicitud.tipo = db_sserv[0].equip_tipo;
                    solicitud.reparacion = db_sserv[0].equip_reparacion;
                    solicitud.instalacion = db_sserv[0].equip_instalacion;
                    solicitud.observaciones = db_sserv[0].equip_observ_op;
                    solicitud.fecha = db_sserv[0].sserv_fecha;

                }
            }
            console.log('Res Documento;', JSON.stringify(documento));
            hayError ? res.status(400).json({ ok: false, mensaje, error: err }) : res.json(documento);

        });

    }

});

module.exports = app;