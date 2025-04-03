const fastify = require('fastify')({ logger: true });
const handlers = require('./handler');

fastify.register(require('./metrics'));

// Define multiple routes
fastify.get('/test', handlers.testHandler);
fastify.get('/count-me', handlers.countMeHandler);
fastify.post('/track-error', handlers.trackErrorHandler);

fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info('Server running at http://localhost:3000');
});