export function errorResponses(status, description, error){
    return {
        status: status,
        description: description,
        error: error
    }
}

export function successResponses(status, description, data){
    return {
        status: status,
        description: description,
        data: data
    }
}

export const errorResponseObj = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: ['001'] },
        description: { type: 'string' },
        error: { 
            type: 'array', 
            items: { 
                type: 'object',
                properties: {
                    code: { type: 'string' },
                    description: { type: 'string' }
                } 
            } 
        } 
    }
}

export const successResponseObj = 
(data) => {

    return {
        type: 'object',
        properties: {
            status: { type: 'string', enum: ['000', '002'] },
            description: { type: 'string' },
            data: data 
        }
    }
    
}


export const datatableObj = {
    draw: { type: 'integer' },
    columns: { 
        type: 'array', 
        items: { 
            type: 'object',
            additionalProperties: false,
            properties: {
                data: { type: 'string' },
                name: { type: 'string' },
                searchable: { type: 'boolean' },
                orderable: { type: 'boolean' },
                search: { 
                    type: 'object',
                    properties: {
                        value: { type: 'string' },
                        regex: { type: 'boolean' }
                    }
                }
            }
        } 
    },
    order: {
        type: 'array', 
        items: { 
            type: 'object',
            properties: {
                column: { type: 'integer' },
                dir: {
                    type: 'string',
                    enum: ['asc', 'desc']
                  }
            }
        }
    },
    start: { type: 'integer' },
    length: { type: 'integer' },
    search: { 
        type: 'object',
        properties: {
            value: { type: 'string' },
            regex: { type: 'boolean' }
        }
    }
}