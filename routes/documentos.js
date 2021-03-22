const { json } = require('body-parser');
const express = require('express');
const session = require('express-session');
const MySQL = require('../connector/mysql');

let app = express();

// const documento = {
// 	empleado: "",
// 	fecha:{
// 		fechaI: "",
// 		fechaF: ""
// 	},
// 	actividades:{
		
// 	}
// }

let generarFolio = (empleado) => {
    return new Promise((resolve, reject)=>{
    mysqlConn = new MySQL();
    let query = `select max(folio_usuario) as ultimo_folio from documentos where usuarios_id = ${empleado};`
    mysqlConn.ejecutarQuery(query, (err, result) => {
        if(err){
            reject( err );
        }
            resolve( parseInt(result[0].ultimo_folio) + 1 );
        });
    });
};

function saveDocument(query, conn, callback){
    conn.ejecutarInsert( query, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        else {
            /* Una vez guardado el documento, se recupera el Id generado en la bd */
            insertedRowId = result.insertId;
            console.log('Id documento: ' + insertedRowId);
            return callback(null, insertedRowId);
        }
    });
}

function getDocument( query, conn, callback){
    conn.ejecutarQuery( query, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        else {
            /* Se devuelven los datos del documento */
            return callback(null, result);
        }
    });
}
app.post('/documentos', async (req, res) => {
    let mysqlConn = null;
    let values = null, insertedActsIds = [];
    let queryTemplate = '', formatedQuery = '';
    let insertedRowId = -1, lastFolio = 0;

    /* Guarda en la bd un nuevo documento para un cierto empleado */
    console.log( JSON.stringify(req.body) );
    
    if( req.body ){
        const documento = req.body;
        var f = new Date();
        var d = f.toISOString();
        var fecha = d.split("T")[0];
        mysqlConn = new MySQL();
        queryTemplate =  'INSERT INTO documentos ( folio_usuario, fecha_inicio, fecha_fin, usuarios_id,fecha_creacion ) ';
        queryTemplate += 'VALUES ( ?, ?, ?, ?, ? )';


        generarFolio( documento.empleado )
            .then((folio)=> {
                values = [ folio, documento.fecha.fechaI, documento.fecha.fechaF, documento.empleado,fecha ];
                formatedQuery = mysqlConn.conection.format(queryTemplate, values);
                console.log('formatedQuery: ', formatedQuery);

                saveDocument( formatedQuery, mysqlConn, (err, documentId) => {
                    if(err){
                        res.status(400).json({
                            ok: false,
                            mensaje: "Error al guardar documento",
                            error: err
                        });
                    }

                    if( documentId ){
                        const actividades = Object.values( documento.actividades );
                        console.log('Actividades: ' + JSON.stringify(actividades));
                        let insertValues = [];
                        queryTemplate  = 'INSERT INTO actividades ( actividad, objetivo, descripcion, entregable, inicio_act, fin_act, impacto_beneficio, medio_comunicacion, medio_entrega, observaciones, documentos_id_doc ) VALUES ';
                        for (const actividadObj of actividades) {
                            let {titulo, objetivo, descripcion, entregable, fechaIni, fechaFin, beneficio, comunicacion, entrega, observacion } = actividadObj;    
                            insertValues.push( `( '${titulo}', '${objetivo}', '${descripcion}', '${entregable}', '${fechaIni}', '${fechaFin}', '${beneficio}', '${comunicacion}', '${entrega}', '${observacion}', '${documentId}' )` );
                        }
                        queryTemplate = queryTemplate + insertValues.join(',') + ';';
                        console.log('formatedQuery: ', queryTemplate);
                        mysqlConn.ejecutarInsert( queryTemplate, (err, result) => {
                            if (err) {
                                res.status(400).json({
                                    ok: false,
                                    mensaje: "Error al guardar actividades",
                                    error: err
                                });
                            }
                            else {
                                // console.log(Result: )
                                // insertedActsIds.push( result.insertId );
                                // console.log('insertedActsIds: ' + insertedActsIds.length);

                                // if( insertedActsIds.length > 0 ){
                                    res.json({
                                        ok: true,
                                        mensaje: "Docuemnto guardado correctamente",
                                        result
                                    });
                                // }
                            }

                        });

                    }

                });
            });
        

    }else{
        res.status(500).json({
            ok: false
        });
    }

});

app.get('/documentos/:id', (req, res) => {
    let mysqlConn = null;
    let documento = { empleado: '', fecha: {}, actividades: {} };
    let hayError = false;
    let mensaje = '', userId = '';

    console.log('Session: ', JSON.stringify(req.session) );
    if(!req.session.userId){
        return res.status(401).json({ mensaje: 'Unauhtorized' });
    }else{
        userId = req.session.userId;
    }

    const idDocument = req.params.id || '';
    if( idDocument ){
        mysqlConn = new MySQL();
        let escapeId = mysqlConn.conection.escape ( `${idDocument}` );
        let query  = `SELECT fecha_creacion,fecha_inicio, fecha_fin, usuarios_id, actividades.* FROM documentos INNER JOIN actividades `;
            query += `ON id_doc = documentos_id_doc where id_doc = ${idDocument};`
        console.log('Query Documento: ' + query);

        getDocument( query, mysqlConn, (err, db_doc) => {
            if(err){
                hayError = true;
                mensaje = "Error al obtener documento";
            }else{
                console.log('db_doc: ' + JSON.stringify(db_doc));

                if( db_doc ){
                    
                    console.log('There is a document!');  
                    documento.fecha.fechaCreacion = JSON.stringify(db_doc[0].fecha_creacion).split("T")[0];           
                    documento.fecha.fechaI = JSON.stringify(db_doc[0].fecha_inicio).split("T")[0];
                    documento.fecha.fechaF = JSON.stringify(db_doc[0].fecha_fin).split("T")[0];
                    documento.empleado = db_doc[0].usuarios_id;

                    let index = 1;
                    for(let registro of db_doc){
                        documento.actividades[index++] = {
                            titulo: registro.actividad,
                            objetivo: registro.objetivo,
                            descripcion: registro.descripcion,
                            entregable: registro.entregable,
                            fechaIni: JSON.stringify(registro.inicio_act).split("T")[0],
                            fechaFin: JSON.stringify(registro.fin_act).split("T")[0],
                            beneficio: registro.impacto_beneficio,
                            comunicacion: registro.medio_comunicacion,
                            entrega: registro.medio_entrega,
                            observacion: registro.observaciones
                        };
                    }
                }
            }
            console.log('Res Documento;', JSON.stringify(documento));
            hayError ? res.status(400).json({ ok: false, mensaje, error: err }) : res.json({userId, documento});

        });

    }

});

app.get('/documento/historial/', (req, res) => {

    if( !req.session.userId ){
        return  res.status(401).json({ ok: false, mensaje: "Sin autorización" });
    }
    let user = req.session.userId,
        rol  = req.session.userRole,
        depto = req.session.depto;

    let mysqlConn = null;
    let documentos = [];
    let documentosObj = {};
    let hayError = false;
    let mensaje = '';

    mysqlConn = new MySQL();
    let query  = `SELECT id_doc, fecha_inicio, fecha_fin, fecha_creacion,estado, folio_usuario, usuarios.nombres, usuarios.apellido_pat, usuarios.apellido_mat, departamentos.nombre as departamento, observaciones  `;
        query += `FROM documentos INNER JOIN usuarios ON usuarios_id = id INNER JOIN departamentos ON usuarios.departamentos_id_dept = id_dept `;
        query += {
            1: `ORDER BY id_doc ASC;`,
            2: `WHERE usuarios.id = ${user} ORDER BY id_doc ASC;`,
            3: `WHERE usuarios.departamentos_id_dept = ${depto} ORDER BY id_doc ASC;`,
            4: `ORDER BY id_doc ASC;`
        }[rol];
    console.log('Query Documento: ' + query);

    getDocument( query, mysqlConn, (err, db_doc) => {
        if(err){
            console.log('err:' + JSON.stringify(err) );
            mensaje = "Error al obtener documento";
        }else{
            console.log('db_doc: ' + JSON.stringify(db_doc));

            if( db_doc ){
                console.log('There are documents!');
                for(let registro of db_doc){

                    documentos.push({
                        id: registro.id_doc,
                        fechaInicio: registro.fecha_inicio,
                        fechaFin: registro.fecha_fin,
                        creacion:registro.fecha_creacion,
                        estado:registro.estado,
                        nombreCompleto: `${registro.nombres} ${registro.apellido_pat} ${registro.apellido_mat}`,
                        departamento: registro.departamento,
                        rol, 
                        folio: registro.folio_usuario
                    });

                }
            }
        }

        console.log('Res Documento;', JSON.stringify(documentos));
        let response = documentos;
        hayError ? res.status(400).json({ ok: false, mensaje, error: err }) : res.json(response);
    });
});

app.get('/documentos', (req, res) => {
    let mysqlConn = null;
    let documentos = [];
    let documentosObj = {};
    let hayError = false;
    let mensaje = '';

    mysqlConn = new MySQL();
    let query  = `SELECT id_doc, fecha_inicio, fecha_fin, fecha_creacion,estado, usuarios.nombres, usuarios.apellido_pat, usuarios.apellido_mat, departamentos.nombre as departamento `;
        query += `FROM documentos INNER JOIN usuarios ON usuarios_id = id INNER JOIN departamentos ON usuarios.departamentos_id_dept = id_dept ORDER BY id_doc ASC;`;
    console.log('Query Documento: ' + query);

    getDocument( query, mysqlConn, (err, db_doc) => {
        if(err){
            hayError = true;
            mensaje = "Error al obtener documento";
        }else{
            console.log('db_doc: ' + JSON.stringify(db_doc));

            if( db_doc ){
                console.log('There are documents!');
                for(let registro of db_doc){

                    documentos.push({
                        id: registro.id_doc,
                        fechaInicio: registro.fecha_inicio,
                        fechaFin: registro.fecha_fin,
                        creacion:registro.fecha_creacion,
                        estado:registro.estado,
                        nombreCompleto: `${registro.nombres} ${registro.apellido_pat} ${registro.apellido_mat}`,
                        departamento: registro.departamento
                    });

                }
            }
        }

        console.log('Res Documento;', JSON.stringify(documentos));
        let response = documentos;
        hayError ? res.status(400).json({ ok: false, mensaje, error: err }) : res.json(response);
    });
});

app.put('/documentos/:id', function (req, res) {
  //obtenemos id por url
    let id = req.params.id,
        tipo = req.body.tipo,
        queryTemplate = '',
        formatedQuery = '',
        mysqlConn = null;
    console.log(tipo,id)
    if(tipo){
        mysqlConn = new MySQL();
        queryTemplate  = `UPDATE documentos SET estado = ?  WHERE  id_doc = ? LIMIT 1;`;
        values = [tipo, id];
        formatedQuery = mysqlConn.conection.format(queryTemplate, values);
        console.log('formatedQuery: ', formatedQuery);
        mysqlConn.ejecutarQuery(formatedQuery,(err,registro) => {
            if(err){
            hayError = true;
            mensaje = "Error al obtener documento";
            }else{
                res.json({
                    ok: true,
                    mensaje: "Registro actualizado"
                });
            }
        })
    }  
});

app.put('/observaciones/:id', (req, res ) => {
    let id = req.params.id,
        observaciones = req.body.observaciones,
        queryTemplate = '',
        formatedQuery = '',
        mysqlConn = null;
    
    if( observaciones ){
        mysqlConn = new MySQL();
        queryTemplate  = `UPDATE documentos SET observaciones = ?  WHERE  id_doc = ? LIMIT 1;`;
        values = [observaciones, id];
        formatedQuery = mysqlConn.conection.format(queryTemplate, values);
        console.log('formatedQuery: ', formatedQuery);
        mysqlConn.ejecutarQuery(formatedQuery,(err,registro) => {
            if(err){
                mensaje = "Error al actualizar documento";
                res.json({
                    result: false
                });
            }else{
                res.json({
                    result: true
                });
            }
        })
    }
});

app.post('/observaciones/:id', (req, res ) => {
    let id = req.body.id,
        queryTemplate = '',
        formatedQuery = '',
        mysqlConn = null;
    
    if( id ){
        mysqlConn = new MySQL();
        queryTemplate  = `SELECT observaciones FROM documentos WHERE id_doc = ${id}`;
        mysqlConn.ejecutarQuery(queryTemplate,(err,registro) => {
            if(err){
                mensaje = "Error al actualizar documento";
                res.json({
                    result: false
                });
            }else{
                console.log('Get obsetvaciones: ' +  JSON.stringify(registro));
                res.json({
                    result: true,
                    observacion: registro[0].observaciones
                });
            }
        })
    }
});


module.exports = app;