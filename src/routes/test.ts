import fastify from 'fastify';

export default function (app: fastify.FastifyInstance, options, done){

    const db = app['cockroachdb'].db;

    // CREATE FREQUENCY CONFIG
    app.post('/create', {}, async(req, res) => {

    });

    // FETCH ALL FREQUENCY CONFIGS
    app.get('/fetch', {}, async(req, res) => {

    });

    // FETCH ALL FREQUENCY CONFIGS BY ID
    app.get('/fetch/:id', {}, async(req, res) => {

    });

    // FETCH ALL FREQUENCY CONFIGS DATATABLES
    app.post('/fetch', {}, async(req, res) => {

    });

    // UPDATE FREQUENCY CONFIG BY ID
    app.put('/update/:id', {}, async(req, res) => {

    });

    // SOFT DELETE FREQUENCY CONFIG BY ID
    app.delete('/delete-s/:id', {}, async(req, res) => {

    });

    // HARD DELETE FREQUENCY CONFIG BY ID
    app.delete('/delete-h/:id', {}, async(req, res) => {

    });

    done();
}