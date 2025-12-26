import { createMonitoringService } from './monitoring.service';

export default async function monitoringRoutes(fastify: any) {
    const service = createMonitoringService(fastify);

    fastify.get('/health', async () => {
        return service.health();
    });

    fastify.get('/version', async () => {
        return service.version();
    });

    fastify.get('/', async () => {
        return {
            uptime: await service.getUptime(),
            memoryUsage: process.memoryUsage(),
            status: 'OK',
        };
    });

    fastify.get('/ping', async () => {
        return {
            message: 'pong',
        };
    });
}
