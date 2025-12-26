import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    // Hook pour logger les requêtes sandbox
    fastify.addHook('onRequest', async (req) => {
        if (req.url.startsWith('/sandbox')) {
            req.log.info(
                {
                    url: req.url,
                    method: req.method,
                    query: req.query,
                },
                'Sandbox request received'
            );
        }
    });

    fastify.addHook('onResponse', async (req, reply) => {
        if (req.url.startsWith('/sandbox')) {
            req.log.info(
                {
                    url: req.url,
                    method: req.method,
                    statusCode: reply.statusCode,
                    duration: req.duration,
                },
                'Sandbox request completed'
            );
        }
    });
});
