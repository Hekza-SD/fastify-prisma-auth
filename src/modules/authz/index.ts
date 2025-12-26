import fp from 'fastify-plugin';

import authzRoutes from './authz.routes';
import authzPlugin from './authz.plugin';
import type { AuthzModuleOptions } from './types';

const DEFAULT_MODULE_PREFIX = '/api/authz';

export const authzModule = fp(async (fastify, opts: AuthzModuleOptions) => {
    await fastify.register(authzPlugin);
    await fastify.register(authzRoutes, { prefix: opts.prefix || DEFAULT_MODULE_PREFIX });
});
