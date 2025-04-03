const fp = require('fastify-plugin');
const metricsPlugin = require('fastify-metrics');

module.exports = fp(async (fastify) => {
    try {
        await fastify.register(metricsPlugin, {
            endpoint: '/metrics',
            defaultMetrics: { enabled: true, prefix: 'sample_service_' },
        });

        const { client } = fastify.metrics;

        // Custom Histogram (original)
        const customResponseTimeTenantLevel = new client.Histogram({
            name: 'custom_response_time_duration',
            help: 'Custom response time of full operation in milliseconds',
            labelNames: ['tenant', 'env', 'operation', 'version', 'success'],
            buckets: [0.1, 0.5, 1, 3, 5],
        });

        // New Custom Counter 1
        const customRequestCounter = new client.Counter({
            name: 'custom_request_count',
            help: 'Count of requests processed',
            labelNames: ['tenant', 'env', 'operation', 'version', 'status'],
        });

        // New Custom Counter 2
        const customErrorCounter = new client.Counter({
            name: 'custom_error_count',
            help: 'Count of errors encountered',
            labelNames: ['tenant', 'env', 'operation', 'version', 'error_type'],
        });

        fastify.decorate('serviceCustomResponseTimeTenantLevel', customResponseTimeTenantLevel);
        fastify.decorate('serviceCustomRequestCounter', customRequestCounter);
        fastify.decorate('serviceCustomErrorCounter', customErrorCounter);
    } catch (error) {
        fastify.log.error('Failed to register metrics plugin:', error);
        throw error;
    }
}, { name: 'prom-metrics' });