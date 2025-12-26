import type { FastifyInstance } from 'fastify';
import { MaintenanceError } from '../../errors/maintenance-error';
import { DEFAULT_MODULE_PREFIX, type MaintenancePluginOptions } from '.';

import fp from 'fastify-plugin';

interface MaintenanceState {
    enabled: boolean;
    startTime: Date | null;
}

/**
 * Maintenance mode plugin to handle maintenance state and requests.
 * @param app Fastify instance
 * @param opts Plugin options
 */
async function maintenancePlugin(app: FastifyInstance, opts: MaintenancePluginOptions) {
    const state: MaintenanceState = { enabled: false, startTime: null };

    app.decorate('maintenance', state);

    app.addHook('onRequest', async (req, _) => {
        if (
            req.url.startsWith(opts.prefix ?? DEFAULT_MODULE_PREFIX) ||
            isIgnoredRoute(req.url, opts.ignoreRoutes)
        ) {
            return;
        }

        if (app.maintenance.enabled) {
            throw new MaintenanceError();
        }
    });
}

const isIgnoredRoute = (url: string, ignoreRoutes?: string[]) => {
    return ignoreRoutes?.some((route) => url.startsWith(route));
};

declare module 'fastify' {
    interface FastifyInstance {
        maintenance: MaintenanceState;
    }
}

export default fp(maintenancePlugin, { name: 'maintenance-plugin' });
