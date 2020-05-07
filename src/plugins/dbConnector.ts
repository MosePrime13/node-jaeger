import fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { db } from '../db/sequelize';
import datatable from 'sequelize-datatable';
import {createViews} from '../db/views';

async function dbConnector(app: fastify.FastifyInstance, options){
   
    createViews(db);

    const data = {
        db: db,
        dt: datatable
    }  
    app.decorate('cockroachdb', data);
}

export default fastifyPlugin(dbConnector);