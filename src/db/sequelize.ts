import {Sequelize} from 'sequelize-cockroachdb';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({path: __dirname + '/../../.env'});


const { database, dialect, host, port, logging, username, password } = require('../../config/db.json')[process.env.NODE_ENV];

let sequelize;

if(process.env.NODE_ENV === 'test') {

    sequelize = new Sequelize(database, username, password, {
        dialect: dialect,
        host: process.env.DB_HOST || host,
        logging: logging,
        operatorsAliases: false,
        typeValidation: true,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        storage: ':memory:'
    });

} else{
    sequelize = new Sequelize(database, username, password, {
        host: host,
        port: port,
        logging: logging,
        operatorsAliases: false,
        dialect: dialect,
        dialectOptions: {
          ssl: {
              ca: fs.readFileSync(__dirname + `/../../config/certs/${process.env.NODE_ENV}/ca.crt`, 'utf8'),
              key: fs.readFileSync(__dirname + `/../../config/certs/${process.env.NODE_ENV}/${process.env.PROJECT_NAME}.key`, 'utf8'),
              cert: fs.readFileSync(__dirname + `/../../config/certs/${process.env.NODE_ENV}/${process.env.PROJECT_NAME}.crt`, 'utf8')
          }
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
    });
}


export const db = {
    sequelize,
    Sequelize,
    environment: process.env.NODE_ENV
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
  