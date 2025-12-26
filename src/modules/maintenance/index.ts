import fp from 'fastify-plugin';
import maintenanceRoutes from './maintenance.routes';
import maintenancePlugin from './maintenance.plugin';

export const DEFAULT_MODULE_PREFIX = '/api/maintenance';

export interface MaintenancePluginOptions {
    ignoreRoutes?: string[];
    prefix?: string;
}

export const maintenanceModule = fp(async (fastify, opts: MaintenancePluginOptions) => {
    await fastify.register(maintenancePlugin, opts);
    await fastify.register(maintenanceRoutes, { prefix: opts.prefix ?? DEFAULT_MODULE_PREFIX });
});
