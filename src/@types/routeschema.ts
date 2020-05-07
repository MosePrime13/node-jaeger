import fastify from 'fastify';

export interface RouteSchema extends fastify.RouteSchema {
    hide?: boolean;
    tags?: string[];
    description?: string;
    summary?: string;
    consumes?: string[];
    security?: Array<{ [securityLabel: string]: string[] }>; 
}