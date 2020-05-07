const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const Promise = require('bluebird');
const Sequelize = require('sequelize-cockroachdb');
const Umzug = require('umzug');

const dotenv = require('dotenv');

const views = require('./build/db/views');

dotenv.config({path: __dirname + '/.env'});

const { database, dialect, host, port, logging, username, password } = require('./config/db.json')[process.env.NODE_ENV];

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
              ca: fs.readFileSync(__dirname + `/config/certs/${process.env.NODE_ENV}/ca.crt`, 'utf8'),
              key: fs.readFileSync(__dirname + `/config/certs/${process.env.NODE_ENV}/${process.env.PROJECT_NAME}.key`, 'utf8'),
              cert: fs.readFileSync(__dirname + `/config/certs/${process.env.NODE_ENV}/${process.env.PROJECT_NAME}.crt`, 'utf8')
          }
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
    });
}




const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize,
    },

    // see: https://github.com/sequelize/umzug/issues/17
    migrations: {
        params: [
            sequelize.getQueryInterface(), // queryInterface
            sequelize.constructor, // DataTypes
            function() {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }
        ],
        path: './build/db/migrations',
        pattern: /\.js$/
    },

    logging: function() {
        console.log.apply(null, arguments);
    },
});

function logUmzugEvent(eventName) {
    return function(name, migration) {
        console.log(`${ name } ${ eventName }`);
    }
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated',  logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted',  logUmzugEvent('reverted'));

function cmdStatus() {
    let result = {};

    return umzug.executed()
      .then(executed => {
        result.executed = executed;
        return umzug.pending();
    }).then(pending => {
        result.pending = pending;
        return result;
    }).then(({ executed, pending }) => {

        executed = executed.map(m => {
            m.name = path.basename(m.file, '.js');
            return m;
        });
        pending = pending.map(m => {
            m.name = path.basename(m.file, '.js');
            return m;
        });

        const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
        const status = {
            current: current,
            executed: executed.map(m => m.file),
            pending: pending.map(m => m.file),
        }

        console.log(JSON.stringify(status, null, 2))

        return { executed, pending };
    })
}

function cmdMigrate() {
    return umzug.up();
}

function cmdMigrateNext() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            if (pending.length === 0) {
                return Promise.reject(new Error('No pending migrations'));
            }
            const next = pending[0].name;
            return umzug.up({ to: next });
        })
}

function cmdReset() {
    views.dropViews(sequelize)
    return umzug.down({ to: 0 });
}

function cmdResetPrev() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            if (executed.length === 0) {
                return Promise.reject(new Error('Already at initial state'));
            }
            const prev = executed[executed.length - 1].name;
            return umzug.down({ to: prev });
        })
}

function cmdHardReset() {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                console.log(`dropdb ${ database }`);
                child_process.spawnSync(`dropdb ${ database }`);
                console.log(`createdb ${ database } --username ${ username }`);
                child_process.spawnSync(`createdb ${ database } --username ${ username }`);
                resolve();
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    });
}

const cmd = process.argv[2].trim();
let executedCmd;

console.log(`${ cmd.toUpperCase() } BEGIN`);
switch(cmd) {
    case 'status':
        executedCmd = cmdStatus();
        break;

    case 'up':
    case 'migrate':
        executedCmd = cmdMigrate();
        break;

    case 'next':
    case 'migrate-next':
        executedCmd = cmdMigrateNext();
        break;

    case 'down':
    case 'reset':
        executedCmd = cmdReset();
        break;

    case 'prev':
    case 'reset-prev':
        executedCmd = cmdResetPrev();
        break;

    case 'reset-hard':
        executedCmd = cmdHardReset();
        break;

    default:
        console.log(`invalid cmd: ${ cmd }`);
        process.exit(1);
}

executedCmd
    .then((result) => {
        const doneStr = `${ cmd.toUpperCase() } DONE`;
        console.log(doneStr);
        console.log("=".repeat(doneStr.length));
    })
    .catch(err => {
        const errorStr = `${ cmd.toUpperCase() } ERROR`;
        console.log(errorStr);
        console.log("=".repeat(errorStr.length));
        console.log(err);
        console.log("=".repeat(errorStr.length));
    })
    .then(() => {
        if (cmd !== 'status' && cmd !== 'reset-hard') {
            return cmdStatus()
        }
        return Promise.resolve();
    })
    .then(() => process.exit(0))


