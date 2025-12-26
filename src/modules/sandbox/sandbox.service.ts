import type { FastifyInstance } from 'fastify';
import { CustomError } from '../../errors/custom-error';
import { DatabaseError } from '../../errors/database-error';
import { ErrorCodes } from '../../errors/error-codes';

export interface SandboxResponse {
    message: string;
    executionTime: number;
    timestamp: string;
    data?: any;
}

export const createSandboxService = (app: FastifyInstance) => ({
    /**
     * Simule une requête avec un délai configurable
     */
    async delayedRequest(delayMs: number = 500): Promise<SandboxResponse> {
        const start = Date.now();

        await new Promise((resolve) => setTimeout(resolve, delayMs));

        return {
            message: `Request completed after ${delayMs}ms delay`,
            executionTime: Date.now() - start,
            timestamp: new Date().toISOString(),
            data: {
                delayRequested: delayMs,
                success: true,
            },
        };
    },

    /**
     * Retourne un succès simple
     */
    async success(): Promise<SandboxResponse> {
        return {
            message: 'Success response',
            executionTime: 0,
            timestamp: new Date().toISOString(),
            data: { status: 'ok' },
        };
    },

    /**
     * Lance une erreur personnalisée
     */
    async throwCustomError(): Promise<never> {
        throw new CustomError(`This is a test error with code`);
    },

    /**
     * Lance une erreur de base de données
     */
    async throwDatabaseError(): Promise<never> {
        throw new DatabaseError(
            'Simulated database error',
            {
                constraint: 'test_constraint',
            },
            {},
            true
        );
    },

    /**
     * Lance une erreur 500
     */
    async throwServerError(): Promise<never> {
        throw new Error('Simulated internal server error');
    },

    /**
     * Retourne une réponse avec des données aléatoires
     */
    async randomData(count: number = 10) {
        const data = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            value: Math.random(),
            timestamp: new Date().toISOString(),
        }));

        return {
            message: `Generated ${count} random items`,
            executionTime: 0,
            timestamp: new Date().toISOString(),
            data,
        };
    },

    /**
     * Test de connexion à la base de données
     */
    async testDatabase(): Promise<SandboxResponse> {
        const start = Date.now();

        try {
            await app.prisma.$queryRaw`SELECT 1 as test`;

            return {
                message: 'Database connection successful',
                executionTime: Date.now() - start,
                timestamp: new Date().toISOString(),
                data: { connected: true },
            };
        } catch (error) {
            return {
                message: 'Database connection failed',
                executionTime: Date.now() - start,
                timestamp: new Date().toISOString(),
                data: {
                    connected: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    },

    /**
     * Simule une tâche longue avec progression
     */
    async longRunningTask(durationMs: number = 2000) {
        const start = Date.now();
        const steps = 5;
        const stepDuration = durationMs / steps;

        for (let i = 1; i <= steps; i++) {
            await new Promise((resolve) => setTimeout(resolve, stepDuration));
            // Log progress
            app.log.info(`Long running task: ${(i / steps) * 100}% complete`);
        }

        return {
            message: 'Long running task completed',
            executionTime: Date.now() - start,
            timestamp: new Date().toISOString(),
            data: {
                totalSteps: steps,
                durationRequested: durationMs,
            },
        };
    },

    /**
     * Retourne des informations système
     */
    async systemInfo() {
        return {
            message: 'System information',
            executionTime: 0,
            timestamp: new Date().toISOString(),
            data: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                env: process.env.NODE_ENV || 'development',
            },
        };
    },
});
