const metricsUtil = require('./metricsUtil');

const testHandler = async (request, reply) => {
    const metricsObject = metricsUtil.startMetrics(
        request.server,
        'serviceCustomResponseTimeTenantLevel',
        'metricsLabelsSetter',
        'testOperation',
        { appId: 'testApp', env: 'dev', ver: 'v1' }
    );

    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
    metricsUtil.endMetrics(metricsObject, true);

    reply.send({ message: 'Test route' });
};

const countMeHandler = async (request, reply) => {
    const metricsObject = metricsUtil.startMetrics(
        request.server,
        'serviceCustomRequestCounter',
        'metricsLabelsSetter',
        'countMeOperation',
        { appId: 'countApp', env: 'dev', ver: 'v1' }
    );

    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate quick work
    metricsUtil.endMetrics(metricsObject, true);

    reply.send({ message: 'Counted!' });
};

const trackErrorHandler = async (request, reply) => {
    const metricsObject = metricsUtil.startMetrics(
        request.server,
        'serviceCustomRequestCounter',
        'metricsLabelsSetter',
        'trackErrorOperation',
        { appId: 'errorApp', env: 'dev', ver: 'v1' }
    );

    try {
        await new Promise((_, reject) => setTimeout(() => reject(new Error('Simulated error')), 75));
        metricsUtil.endMetrics(metricsObject, true); // Won’t reach here
        reply.send({ message: 'This won’t happen' });
    } catch (error) {
        metricsUtil.endMetrics(metricsObject, false);
        const incremented = metricsUtil.incrementCounter(request.server, 'serviceCustomErrorCounter', {
            tenant: 'errorApp',
            env: 'dev',
            operation: 'trackErrorOperation',
            version: 'v1',
            error_type: error.message,
        });
        request.server.log.info(`Error counter incremented: ${incremented}`);
        reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

module.exports = { testHandler, countMeHandler, trackErrorHandler };