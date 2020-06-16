import dotenv from 'dotenv';
import moment from 'moment-timezone';
import axios, { Method } from 'axios';

dotenv.config({path: __dirname + '/../../.env'});
const environment = process.env.NODE_ENV;
const services = (require('../../config/url.json')[environment]).services;
type Apis =
  | 'test' | 'test_2'

interface Reqmaker{
    service: Apis,
    action: string,
    method: Method,
    data?: any,
    headers?: Object
}

export default function({service, action, method, data = '', headers = {  'Content-Type': 'application/json' }}: Reqmaker){
    return new Promise( (resolve, reject) => {
    

        const url = ((services.find((el) => el.name === service )).url) + '/' + action;
        const now = moment.tz(moment(), 'Africa/Nairobi').format('DD/MM/YYYY HH:mm');
        console.log(`${now} - ${url}`);
            
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
