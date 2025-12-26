import fp from 'fastify-plugin';

import sandboxRoutes from './sandbox.route';
import sandboxPlugin from './sandbox.plugin';

export interface SandboxPluginOptions {
    prefix?: string;
}

export const sandboxModule = fp(async (fastify, opts: SandboxPluginOptions) => {
    await fastify.register(sandboxPlugin);
    await fastify.register(sandboxRoutes, { prefix: opts.prefix ?? '/sandbox' });
});
