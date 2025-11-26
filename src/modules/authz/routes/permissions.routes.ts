import type { FastifyInstance } from 'fastify';
import {
    getPermissionByIdParamSchema,
    getPermissionByIdResponseSchema200,
    type GetPermissionByIdParams,
    type GetPermissionByIdReply,
} from '../dto/permissions/get-by-id';
import { NotImplementedError } from '../../../errors/not-implemented.error';

export async function permissionsRoutes(fastify: FastifyInstance) {
    fastify.get('/permissions', async (request, reply) => {
        return await fastify.authz.permissions.getPermissions();
    });

    fastify.get<{ Params: GetPermissionByIdParams; Reply: GetPermissionByIdReply }>(
        '/permissions/:permissionId',
        {
            schema: {
                params: getPermissionByIdParamSchema,
                response: { 200: getPermissionByIdResponseSchema200 },
            },
        },
        async (request, reply) => {
            const permission = await fastify.authz.permissions.getPermissionById(
                request.params.permissionId
            );
            return reply.code(200).sendWithDates(permission);
        }
    );

    fastify.get('/permissions/search', async (request, reply) => {
        throw new NotImplementedError();
    });
}
