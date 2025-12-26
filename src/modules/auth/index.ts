import fp from 'fastify-plugin';
import authRoutes from './auth.route';
import authPlugin from './auth.plugin';

export interface AuthPluginOptions {
    prefix?: string;
}

const DEFAULT_MODULE_PREFIX = '/api/auth';

export const authModule = fp(async (fastify, opts: AuthPluginOptions) => {
    await fastify.register(authPlugin);
    await fastify.register(authRoutes, { prefix: opts.prefix ?? DEFAULT_MODULE_PREFIX });
});
