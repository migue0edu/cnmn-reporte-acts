const mysql = require('mysql');

class MySQL {

   static conection;

    /* Al contruir el objeto se manda a conectar a la base de datos */
    constructor( ){
        this.conectado = false;
        this.conection = mysql.createConnection ({
          host: process.env.DB_URL,
          user: process.env.DB_USER,
          password: process.env.DB_PASSW,
          database: process.env.DB_SCHEMA
        });
  
        this.conectarDB();
    }

    /* Patron singleton. Para solo mantener una conexión activa a la bd. */
    static get instance() {
        return this._instance || (this._instance = new this());
    }

    /* Función de uso privado para conectarse a la base de datos */
    conectarDB() {
        this.conection.connect((err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            this.conectado = true;
        });
    }

    /* Función para realizar un query a la base de datos */
    ejecutarQuery(query, callback) {
        this.conection.query(query, (err, results, fields) => {
            if (err) {
                console.log('Error en query.');
                return callback(err);
            }
            if (results.length == 0) {
                callback('El registro solicitado no existe.');
            }
            else {
                callback(null, results);
            }
        });
    }

    ejecutarInsert(query, callback){
        this.conection.query(query, (err, results, fields) => {
            if (err) {
                console.log('Error en query.');
                return callback(err);
            }
            if (results.length == 0) {
                callback('No se indertó ningun registro.');
            }
            else {
                callback(null, results);
            }
        });
    }

};

module.exports = MySQL;