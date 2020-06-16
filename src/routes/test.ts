import fastify from 'fastify';
import { RouteSchema } from './../@types/routeschema';
import { errorResponseObj, successResponseObj } from '../traits/responses';
import reqmaker from '../traits/reqmaker';


export default function (app: fastify.FastifyInstance, options, done){

    // const db = app['cockroachdb'].db;

    const testSchema: RouteSchema = {
        tags: ['test'],
        summary: 'Test Get route',
        body: {
            type: 'object',
            additionalProperties: false,
            properties: {}
        },
        params: {
            type: 'object',
            properties: {}
        },
        response:{
            400: errorResponseObj,
            200: successResponseObj({type: 'object', properties: {}})
        }
    }

    app.get('/fetch', {}, async(req, res) => {
        
        let data;
        try{
            data = await reqmaker({
                service: 'test',
                action: 'posts',
                method: 'GET',
            });
        }catch(e){
            res.code(400).send(e)
        }
        
        res.send(data);
    });

    app.post('/create', {}, async(req, res) => {
        res.send('Test Post')
    });

    app.put('/update', {}, async(req, res) => {
        res.send('Test Update')
    });

    app.delete('/delete', {}, async(req, res) => {
        res.send('Test Delete')
    });


    done();
}