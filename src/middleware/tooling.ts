import fastify from 'fastify';
import {Span, Tracer} from 'opentracing';

export default async function(req: fastify.FastifyRequest, res, next){


    const ip = req.ips;    
    let source = req.headers['user-agent'] || ''
    if (req.headers['x-ucbrowser-ua']) {  //special case of UC Browser
        source = req.headers['x-ucbrowser-ua'];
    }

    const tracer = req['jaeger']().tracer as Tracer;
    const span = req['jaeger']().span as Span;

    req['useragent'] = {
        ip: ip,
        userAgent: source
    }

    req['ctx'] = { span, tracer }
    return

}