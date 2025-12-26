import type { FastifyInstance } from 'fastify';
import { createSandboxService } from './sandbox.service';

export default async function sandboxRoutes(fastify: FastifyInstance) {
    const service = createSandboxService(fastify);

    // Route de base - succès simple
    fastify.get('/', async () => {
        return service.success();
    });

    // Requête avec délai configurable
    fastify.get<{
        Querystring: { delay?: string };
    }>(
        '/delay',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        delay: {
                            type: 'string',
                            description: 'Delay in milliseconds (default: 500)',
                        },
                    },
                },
            },
        },
        async (request) => {
            const delayMs = request.query.delay ? parseInt(request.query.delay, 10) : 500;
            return service.delayedRequest(delayMs);
        }
    );

    // Test des erreurs personnalisées
    fastify.get<{
        Querystring: { code?: string };
    }>(
        '/error/custom',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        code: { type: 'string', description: 'Error code to throw' },
                    },
                },
            },
        },
        async (request) => {
            return service.throwCustomError();
        }
    );

    // Test des erreurs de base de données
    fastify.get('/error/database', async () => {
        return service.throwDatabaseError();
    });

    // Test des erreurs serveur (500)
    fastify.get('/error/server', async () => {
        return service.throwServerError();
    });

    // Génération de données aléatoires
    fastify.get<{
        Querystring: { count?: string };
    }>(
        '/random',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'string',
                            description: 'Number of random items (default: 10)',
                        },
                    },
                },
            },
        },
        async (request) => {
            const count = request.query.count ? parseInt(request.query.count, 10) : 10;
            return service.randomData(count);
        }
    );

    // Test de connexion base de données
    fastify.get('/test/database', async () => {
        return service.testDatabase();
    });

    // Tâche longue durée
    fastify.get<{
        Querystring: { duration?: string };
    }>(
        '/long-task',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        duration: {
                            type: 'string',
                            description: 'Duration in milliseconds (default: 2000)',
                        },
                    },
                },
            },
        },
        async (request) => {
            const duration = request.query.duration ? parseInt(request.query.duration, 10) : 2000;
            return service.longRunningTask(duration);
        }
    );

    // Informations système
    fastify.get('/system', async () => {
        return service.systemInfo();
    });

    // Echo endpoint - retourne ce qui est envoyé
    fastify.post<{
        Body: any;
    }>('/echo', async (request) => {
        return {
            message: 'Echo response',
            executionTime: 0,
            timestamp: new Date().toISOString(),
            data: {
                body: request.body,
                headers: request.headers,
                query: request.query,
            },
        };
    });
}
