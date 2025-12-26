import type { FastifyInstance } from 'fastify';
import {
    postMaintenanceStateBodySchema,
    postMaintenanceStateResponseSchema,
    type PostMaintenanceBody,
    type PostMaintenanceReply,
} from './dto/post-maintenance-state.dto';

export default async function maintenanceRoutes(fastify: FastifyInstance) {
    fastify.post<{
        Body: PostMaintenanceBody;
        Reply: PostMaintenanceReply;
    }>(
        '/',
        {
            schema: {
                body: postMaintenanceStateBodySchema,
                response: {
                    200: postMaintenanceStateResponseSchema,
                },
            },
        },
        async (req, reply) => {
            const { enabled } = req.body;

            if (fastify.maintenance.enabled === enabled) {
                return reply.code(200).sendWithDates({
                    enabled: fastify.maintenance.enabled,
                    startTime: fastify.maintenance.startTime || null,
                });
            }

            fastify.maintenance.enabled = enabled;
            fastify.maintenance.startTime = enabled ? new Date() : null;

            reply.code(200).sendWithDates({
                enabled: fastify.maintenance.enabled,
                startTime: fastify.maintenance.startTime || null,
            });
        }
    );
}
