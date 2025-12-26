import type { FastifyInstance } from 'fastify';

import { prismaPlugin } from './prisma';
import { corsPlugin } from './cors';
import { correlationPlugin } from './correlation-plugin';
import fastifyHelmet from '@fastify/helmet';
import { slowRequestPlugin } from './slow-logger';
import { config } from '../config';
import { helperPlugin } from './helper';

export async function registerGlobalPlugins(app: FastifyInstance) {
    await app.register(prismaPlugin);
    await app.register(corsPlugin);
    await app.register(correlationPlugin);
    await app.register(fastifyHelmet);
    await app.register(slowRequestPlugin, {
        threshold: config.SLOW_LOG_THRESHOLD_MS,
        logFile: `${config.LOG_DIRECTORY}/slow.log`,
    });
    await app.register(helperPlugin);
}
