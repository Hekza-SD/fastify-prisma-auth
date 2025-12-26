import type { FastifyInstance } from 'fastify';

import { monitoringModule } from './monitoring';
import { maintenanceModule } from './maintenance';
import { authModule } from './auth';
import { sandboxModule } from './sandbox';

export async function registerModules(fastify: FastifyInstance) {
    fastify.register(maintenanceModule, {
        prefix: '/api/maintenance',
        ignoreRoutes: ['/api/monitoring/health', '/api/monitoring/version'],
    });
    fastify.register(monitoringModule, { prefix: '/api/monitoring' });
    fastify.register(authModule, { prefix: '/api/auth' });
    if (fastify.config.isDevelopment) {
        fastify.register(sandboxModule, { prefix: '/api/sandbox' });
    }
}
