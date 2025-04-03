const metricsLabelsSetter = (appId, env, operation, ver) => ({
    tenant: appId ?? 'NoTenant',
    env: env ?? 'NoEnv',
    operation: operation ?? 'NoOperation',
    version: ver ?? 'NoVersion',
});

function startMetrics(fastify, customMetricsHandler, customMetricsLabelsSetter, operation, customMetricsLabelArgs) {
    const { appId, env, ver } = customMetricsLabelArgs;
    const timer = fastify[customMetricsHandler];
    const metricsLabels = metricsLabelsSetter(appId, env, operation, ver);

    return {
        timer,
        metricsLabels,
        startTime: Date.now(),
    };
}

function endMetrics(metricsStartObject, success) {
    const { timer, metricsLabels, startTime } = metricsStartObject;
    if (!timer) return;

    if (timer instanceof require('prom-client').Histogram) {
        const totalTime = (Date.now() - startTime) / 1000; // Convert to seconds
        timer.labels({ ...metricsLabels, success: success ? 'true' : 'false' }).observe(totalTime);
    } else if (timer instanceof require('prom-client').Counter) {
        timer.inc({ ...metricsLabels, status: success ? 'success' : 'failure' });
    }
}

function incrementCounter(fastify, counterName, labels) {
    const counter = fastify[counterName];
    if (counter) {
        counter.inc(labels);
        return true; // Indicate success for debugging
    }
    return false;
}

module.exports = { startMetrics, endMetrics, incrementCounter };