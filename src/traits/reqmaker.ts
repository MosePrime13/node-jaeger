import dotenv from 'dotenv';
import moment from 'moment-timezone';
import axios, { Method } from 'axios';
import {Span, Tags, Tracer, FORMAT_HTTP_HEADERS} from 'opentracing';

dotenv.config({path: __dirname + '/../../.env'});
const environment = process.env.NODE_ENV;
const services = (require('../../config/url.json')[environment]).services;
type Apis =
  | 'test' | 'development_2'

interface Ctx{
    span: Span,
    tracer: Tracer
}

interface Reqmaker{
    service: Apis,
    action: string,
    method: Method,
    data?: any,
    headers?: Object,
    ctx?: Ctx,
}

export default function({service, action, method, data = '', headers = {}, ctx}: Reqmaker){
    return new Promise( (resolve, reject) => {
    


        const url = ((services.find((el) => el.name === service )).url) + '/' + action;
        const now = moment.tz(moment(), 'Africa/Nairobi').format('DD/MM/YYYY HH:mm');
        console.log(`${now} - ${url}`);

        if(ctx){
            
        }
        // ADD TRACING
        ctx.span.setTag(Tags.HTTP_URL, url);
        ctx.span.setTag(Tags.HTTP_METHOD, method);
        ctx.span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
        //Send span context via request headers (parent id etc.)
        ctx.tracer.inject(ctx.span, FORMAT_HTTP_HEADERS, headers);
        
        axios({
            url: url,
            method: method,
            headers: headers,
            data: data
        }).then((response) => {
            console.log(response.status);
            resolve(response.data)
        }).catch((error) => {
            console.log(error.response.status);
            reject(error.response.data);
        });

    
    });
}
