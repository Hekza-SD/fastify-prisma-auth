import fp from 'fastify-plugin';
import { asyncLocalStorage } from '../utils/context';
import pino from 'pino';
import path from 'path';
import fs from 'fs';

interface SlowLoggerOptions {
    // Time threshold in milliseconds to consider a request as slow, default is 300 ms
    logFile?: string;
    threshold?: number;
    pinoOptions?: pino.LoggerOptions;
}

/**
 * A Fastify plugin that logs slow HTTP requests.
 * It uses AsyncLocalStorage to include correlationId if available.
 */
export const slowRequestPlugin = fp(async (fastify, opts: SlowLoggerOptions = {}) => {
    const threshold = opts.threshold ?? 300;
    const logFile = opts.logFile ?? path.resolve(__dirname, '../logs/slow.log');

    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    let slowLogger;
    if (opts.pinoOptions) {
        slowLogger = pino(
            {
                ...opts.pinoOptions,
                mixin() {
                    const store = asyncLocalStorage.getStore();
                    return store ? { correlationId: store.correlationId } : {};
                },
            },
            pino.destination({ dest: logFile, sync: false })
        );
    } else {
        slowLogger = pino(
            {
                level: 'warn',
                timestamp: () => `,"time":"${new Date().toISOString()}"`,
                mixin() {
                    const store = asyncLocalStorage.getStore();
                    return store ? { correlationId: store.correlationId } : {};
                },
            },
            pino.destination({ dest: logFile, sync: false })
        );
    }

    fastify.addHook('onRequest', (req, _, done) => {
        req.slowLogStartTime = Date.now();
        done();
    });

    fastify.addHook('onResponse', (req, reply, done) => {
        const duration = Date.now() - req.slowLogStartTime;
        if (duration > threshold) {
            slowLogger.warn(
                {
                    url: req.url,
                    method: req.method,
                    statusCode: reply.statusCode,
                    duration,
                },
                'slow HTTP request'
            );
        }
        done();
    });
});

declare module 'fastify' {
    interface FastifyRequest {
        slowLogStartTime: number;
    }
}
