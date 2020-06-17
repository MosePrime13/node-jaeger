import assert from 'assert';
import fp from 'fastify-plugin';
import {initTracer} from 'jaeger-client';
import url from 'url';
import fastify from 'fastify';
import {FORMAT_HTTP_HEADERS, Tags} from 'opentracing';



function jaegerCustomPlugin (fastify: fastify.FastifyInstance, opts, next) {

    assert(opts.serviceName, 'Jaeger Plugin requires serviceName option')

    const { state = {}, initTracerOpts = {}, ...tracerConfig } = opts

    const exposeAPI = opts.exposeAPI !== false
    const defaultConfig = {
        sampler: {
          type: 'const',
          param: 1
        },
        reporter: {
          logSpans: false
        }
    }

    const defaultOptions = {
    logger: fastify.log
    }

    const tracer = initTracer(
        { ...defaultConfig, ...tracerConfig },
        { ...defaultOptions, ...initTracerOpts }
    )

    const tracerMap = new WeakMap()

    function api () {
        const req = this
        return {
          get span () {
            return tracerMap.get(req)
          },
          tags: Tags,
          tracer: tracer
        }
    }

    if (exposeAPI) {
        fastify.decorateRequest('jaeger', api)
    }

    function filterObject (obj) {
        const ret = {}
        Object.keys(obj)
          .filter((key) => obj[key] != null)
          .forEach((key) => { ret[key] = obj[key] })
    
        return ret
    }

    function setContext (headers) {
        return filterObject({ ...headers, ...state })
    }

    function onRequest (req, res, done) {
        const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, setContext(req.raw.headers))
        const span = tracer.startSpan(`${req.raw.method} - ${url.format(req.raw.url)}`, {
          childOf: parentSpanContext,
          tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER, [Tags.HTTP_METHOD]: req.raw.method, [Tags.HTTP_URL]: url.format(req.raw.url) }
        })
    
        tracerMap.set(req, span)
        done()
    }

    function onResponse (req, reply, done) {
        const span = tracerMap.get(req)
        span.setTag(Tags.HTTP_STATUS_CODE, reply.res.statusCode)
        span.finish()
        done()
    }

    function onError (req, reply, error, done) {
        const span = tracerMap.get(req)
        span.setTag(Tags.ERROR, {
          'error.object': error,
          message: error.message,
          stack: error.stack
        })
        done()
    }

    function onClose (instance, done) {
        tracer.close(done)
    }

    fastify.addHook('onRequest', onRequest)
    fastify.addHook('onResponse', onResponse)
    fastify.addHook('onError', onError)
    fastify.addHook('onClose', onClose)

    next()
}

export default fp(jaegerCustomPlugin, { name: 'custom-jaeger' })
