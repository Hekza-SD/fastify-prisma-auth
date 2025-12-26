import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const prismaPlugin = fp(async (fastify: FastifyInstance) => {
    const adapter = new PrismaPg({ connectionString: fastify.config.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    await prisma.$connect();
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
