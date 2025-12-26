import fp from 'fastify-plugin';

import monitoringRoutes from './monitoring.routes';
import monitoringPlugin from './monitoring.plugin';

const DEFAULT_MODULE_PREFIX = '/api/monitoring';

export interface MonitoringPluginOptions {
    prefix?: string;
}

export const monitoringModule = fp(async (fastify, opts: MonitoringPluginOptions) => {
    await fastify.register(monitoringPlugin);
    await fastify.register(monitoringRoutes, { prefix: opts.prefix ?? DEFAULT_MODULE_PREFIX });
});
