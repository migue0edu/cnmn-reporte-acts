const { json } = require('body-parser');
const express = require('express');
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


app.post('/documentos', (req, res) => {
    let mysqlConn = null;
    let values = null, insertedActsIds = [];
    let queryTemplate = '', formatedQuery = '';
    let insertedRowId = -1;

    /* Guarda en la bd un nuevo documento para un cierto empleado */
    console.log( JSON.stringify(req.body) );
    
    if( req.body ){
        const documento = req.body;
        
        mysqlConn = new MySQL();
        queryTemplate =  'INSERT INTO documentos ( fecha_inicio, fecha_fin, usuarios_id ) ';
        queryTemplate += 'VALUES ( ?, ?, ? )';
        
        values = [ documento.fecha.fechaI, documento.fecha.fechaF, documento.empleado ];
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
                    let {titulo, objetivo, descripcion, entregable, actFechaI, actFechaF, beneficio, comunicacion, entrega, observacion } = actividadObj;    
                    insertValues.push( `( '${titulo}', '${objetivo}', '${descripcion}', '${entregable}', '${actFechaI}', '${actFechaF}', '${beneficio}', '${comunicacion}', '${entrega}', '${observacion}', '${documentId}' )` );
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

        mysqlConn.ejecutarInsert( formatedQuery, (err, result) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: "Error al guardar documento",
                    error: err
                });
            }
            else {
                /* Una vez guardado el documento, se recupera el Id generado en la bd */
                insertedRowId = result.insertId;
                console.log('Id documento: ' + insertedRowId);
            }
        });

        /* Se guardan los detalles una vez que se ha guardado el documento */
        // if( insertedRowId > 0 ){
        //     const actividades = Object.values( documento.actividades );
        //     console.log('Actividades: ' + JSON.stringify(actividades));
        //     for (const actividad of actividades) {
        //         let {actividad, objetivo, descripcion, entregable, actFechaI, actFechaF, beneficio, comunicacion, entrega, observación } = actividad;
                
        //         queryTemplate  = 'INSERT INTO actividades ( actividad, objetivo, descripcion, entregable, inicio_act, fin_act, impacto_beneficio, medio_comunicacion, medio_entrega, observaciones, documentos_id_doc ) '
        //         queryTemplate += 'VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )';
        //         values = [ actividad, objetivo, descripcion, entregable, actFechaI, actFechaF, beneficio, comunicacion, entrega, observación ];
        //         formatedQuery = mysqlConn.conection.format(queryTemplate, values);
        //         console.log('formatedQuery: ', formatedQuery);
        //         mysqlConn.ejecutarInsert( formatedQuery, (err, result) => {
        //             if (err) {
        //                 res.status(400).json({
        //                     ok: false,
        //                     mensaje: "Error al guardar actividades",
        //                     error: err
        //                 });
        //             }
        //             else {
        //                 insertedActsIds.push( result.insertId );
        //             }
        //         });
        //     }
        // }

        // if( insertedActsIds.length > 0 ){
        //     res.json({
        //         ok: true,
        //         mensaje: "Docuemnto guardado correctamente",
        //         idDocumento: insertedRowId,
        //         idActividades: JSON.stringify( insertedActsIds )
        //     });
        // }

    }else{
        res.status(500).json({
            ok: false
        });
    }

});

app.get('/documentos/:id', (req, res) => {
    let mysqlConn = null;
    let documento = {};
    let hayError = false;
    let mensaje = '';

    const idDocument = req.params.id || '';
    if( idDocument ){
        mysqlConn = new MySQL();
        let escapeId = mysqlConn.conection.escape ( `${input}` );
        let query = `SELECT fecha_inicio, fecha_fin, usuarios_id FROM docuemntos WHERE id_doc = ${escapeId} `;
        mysqlConn.ejecutarQuery( query, (err, result) => {
            if (err) {
                hayError = true;
                mensaje = 'Error al obtener documento';
            }
            else {
                documento.empleado = result.usuario_id;
                documento.fecha.fechaI = result.fecha_inicio;
                documento.fecha.fechaF = result.fecha_fin;
            }
        });

        if( !hayError ){

            /* Obtener actividades del documento */
            query  = 'SELECT id_act, actividad, objetivo, descripcion, entregable, inicio_act, fin_act, impacto_beneficio, medio_comunicacion, medio_entrega, observaciones, FROM actividades ';
            query += `WHERE documentos_id_doc = ${escapeId}`;
            mysqlConn.ejecutarQuery( query, (err, result) => {
                if (err) {
                    hayError = true;
                    mensaje = "Error al obtener actividades"
                }
                else {
                    res.json({
                        ok: true,
                        result
                    });
                    let index = 0;
                    documento.actividades = {};
                    for (const actividad of result) {
                        documento.actividades[index] = {
                            titulo: result.actividad,
                            objetivo: result.objetivo ,
                            descripcion: result.descripcion ,
                            entregable: result.entrgable ,
                            fechaIni: result.inicio_act ,
                            fechaFin: result.fin_act ,
                            beneficio: result.impacto_beneficio ,
                            comunicacion: result.medio_comunicacion ,
                            entrega: result.medio_entrega ,
                            observacion: observaciones
                        };
                        index++;
                    }
                }
            });

        }

        hayError ? res.status(400).json({ ok: false, mensaje, error: err }) : res.json({documento});
    }

});


module.exports = app;