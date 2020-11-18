/* Variables de entorno */
process.env.PORT = process.env.PORT || 3000;
process.env.ENVIRONMENT = process.env.ENVIRONMENT || 'local';

const params = {
    developing: {
        db_url: 'db4free.net',
        db_user: 'cnmn_test',
        db_pass: 'cnmn_test0',
        db_schm: 'registro-acts'
    },
    production: {
        db_url: 'db4free.net',
        db_user: 'cnmn_test',
        db_pass: 'cnmn_test0',
        db_schm: 'registro-acts'
    },
    local: {
        db_url: 'localhost',
        db_user: 'node_test',
        db_pass: 'cnmn_test0',
        db_schm: 'bitacora_act'
    }
}

process.env.DB_URL = params[ process.env.ENVIRONMENT ].db_url;
process.env.DB_USER = params[ process.env.ENVIRONMENT ].db_user;
process.env.DB_PASSW = params[ process.env.ENVIRONMENT ].db_pass;
process.env.DB_SCHEMA = params[ process.env.ENVIRONMENT ].db_schm;

