import fastify from 'fastify';
import { RouteSchema } from './../@types/routeschema';
import { errorResponseObj, successResponseObj } from '../traits/responses';
import reqmaker from '../traits/reqmaker';
import {Span, Tracer} from 'opentracing';


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
                service: 'development_2',
                action: 'reciever',
                method: 'GET',
                ctx: req['ctx']
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

function formatString(ctx, helloTo: string){
    ctx = { span: ctx.tracer.startSpan("formatString",{ childOf: ctx.span }) };
    for(let i=0; i<100; i++){
        let answ = 1+1;
    }
    const helloStr = `Hello ${helloTo}`;
    ctx.span.log({
        event: 'string-format',
        value: helloStr
    });
    ctx.span.finish();
    return helloStr
}

function storeHello( ctx, helloStr: string){
    ctx = {span: ctx.tracer.startSpan("printHello", { childOf: ctx.span })};
    for(let i=0; i<20; i++){
        let answ = 1+1;
    }
    ctx.span.log({ event: 'store-string' });
    ctx.span.finish();
    
}