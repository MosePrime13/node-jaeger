import fastify from 'fastify';
import dotenv from 'dotenv';
import helmet from 'fastify-helmet';
import fastifyFormbody from 'fastify-formbody';
import fastswagger from 'fastify-swagger';
import fastifyStatic from 'fastify-static';
import fastifyJaeger from 'fastify-jaeger';
import path from 'path';
import { Server, IncomingMessage, ServerResponse } from "http";

dotenv.config({ path: __dirname + '/../.env' });

// import dbConnector from './plugins/dbConnector';
import routes from './routes';

const app: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
> = fastify({
    logger: true,
    pluginTimeout: 100000,
    trustProxy: true
});


app.register(helmet);
// app.register(dbConnector);
app.register(fastifyFormbody);
app.register(fastifyStatic, {
    root: path.join(__dirname, '/../public'),
});

const configs = (require('../config/url.json')[process.env.NODE_ENV]);

// OPEN TRACING
app.register(fastifyJaeger, {
    serviceName: process.env.PROJECT_NAME,
    agentHost: configs.jaeger.host,
    agentPort: configs.jaeger.port
});


// SWAGGER
const host = process.env.HOST || configs.host;
const scheme = process.env.SCHEME || configs.scheme;
const expose = process.env.NODE_ENV === 'production' ? false : true;

app.register(fastswagger, {
    exposeRoute: expose,
    routePrefix: '/api/documentation',
    swagger: {
        info: {
            title: 'Api title',
            description: 'Api description',
            version: '1.0.0'
        },
        host: host,
        schemes: scheme,
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'tag-name', description: 'tag-description' },
        ],
        securityDefinitions: {
            "Authorization": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header"
            }
        }
    }
});

routes(app);

app.listen(Number(process.env.PORT), '0.0.0.0', function(err, address){
    if(err){
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening on port ${address}`)
});

