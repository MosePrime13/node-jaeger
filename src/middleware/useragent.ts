import fastify from 'fastify';

export default async function(req: fastify.FastifyRequest, res, next){


    const ip = req.ips;    
    let source = req.headers['user-agent'] || ''
    if (req.headers['x-ucbrowser-ua']) {  //special case of UC Browser
        source = req.headers['x-ucbrowser-ua'];
    }

    req['useragent'] = {
        ip: ip,
        userAgent: source
    }
    return

}