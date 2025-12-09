import Fastify from 'fastify';

import { registerGlobalPlugins } from './plugins';
import { registerModules } from './modules';
import { errorHandler } from './middlewares/error-handler';
import { loggerOptions } from './config/correlation-logger';
import { configPlugin } from './plugins/config';

export async function buildApp() {
    const app = Fastify({ logger: loggerOptions });

    app.register(configPlugin); // Load config first

    await registerGlobalPlugins(app);

    await registerModules(app);

    app.setErrorHandler(errorHandler);

    await app.ready();

    app.log.info(app.printRoutes());

    return app;
}
