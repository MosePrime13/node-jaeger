import fastify from 'fastify';
import { RouteSchema } from './../@types/routeschema';
import { errorResponseObj, successResponseObj } from '../traits/responses';
import reqmaker from '../traits/reqmaker';
import { createControllerSpan, finishSpanWithResult } from '../traits/tracer';
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
       
        const helloTo = 'Moses';



        const tracer = req['jaeger']().tracer as Tracer;
        const span = req['jaeger']().span as Span;

        const ctx = { span, tracer }

        // span.setTag("hello-to", helloTo);

        // const helloToStr = formatString(ctx, helloTo)

        // storeHello(ctx, helloToStr);

        let data;
        try{
            data = await reqmaker({
                service: 'development_2',
                action: 'reciever',
                method: 'GET',
                ctx: ctx
            });
        }catch(e){
            res.code(400).send(e)
        }
        

        
        res.send(data);
        
        // const traceSpan = createControllerSpan(tracer, 'testController', 'doSomething', req.headers );

        // console.log('DO some work here');

        // finishSpanWithResult(traceSpan, 200);

        
        
        // res.send(data);
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