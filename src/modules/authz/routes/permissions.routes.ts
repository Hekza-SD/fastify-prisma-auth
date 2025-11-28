import type { FastifyInstance } from 'fastify';
import {
    getPermissionByIdParamSchema,
    getPermissionByIdResponseSchema200,
    type GetPermissionByIdParams,
    type GetPermissionByIdReply,
} from '../dto/permissions/get-by-id';
import { NotImplementedError } from '../../../errors/not-implemented.error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { ErrorMessages } from '../../../errors/error-messages';
import { requireAuth } from '../../auth/auth-pre-handler.';
import {
    getHasPermissionQueryStringSchema,
    getHasPermissionResponseSchema200,
    type GetHasPermissionQueryString,
    type GetHasPermissionReply,
} from '../dto/permissions/get-has-permission';

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

    fastify.get<{ Querystring: GetHasPermissionQueryString; Reply: GetHasPermissionReply }>(
        '/permissions/has-permission',
        {
            schema: {
                querystring: getHasPermissionQueryStringSchema,
                response: { 200: getHasPermissionResponseSchema200 },
            },
            preHandler: [requireAuth],
        },
        async (request, reply) => {
            const { action, resource } = request.query;
            const userId = request.session?.user.id;

            if (!userId) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }

            const organizationId =
                await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                    userId
                );

            const hasPermission =
                await fastify.authz.permissions.userHasPermissionInActiveOrganization(
                    userId,
                    organizationId.id,
                    action,
                    resource
                );

            return reply.code(200).send({ hasPermission });
        }
    );
}
