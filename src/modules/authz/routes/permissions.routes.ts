import type { FastifyInstance } from 'fastify';
import { NotImplementedError } from '../../../errors/not-implemented.error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { ErrorMessages } from '../../../errors/error-messages';
import {
    getHasPermissionQueryStringSchema,
    getHasPermissionResponseSchema200,
    type GetHasPermissionQueryString,
    type GetHasPermissionReply,
} from '../dto/permissions/get-has-permission';
import { PermissionAction } from '../permission-action';
import { PermissionResource } from '../permission-resource';

export async function permissionsRoutes(fastify: FastifyInstance) {
    /**
     * Get all permissions for the active organization
     */
    fastify.get(
        '/permissions',
        {
            preHandler: [
                fastify.requireAuth,
                fastify.authz.userCan([
                    {
                        action: PermissionAction.READ,
                        resource: PermissionResource.PERMISSIONS,
                    },
                ]),
            ],
        },
        async (request, _reply) => {
            const activeOrganizationId =
                request.activeOrganizationId ??
                (
                    await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                        request.session!.user.id
                    )
                ).id;

            return await fastify.authz.permissions.getPermissions(activeOrganizationId);
        }
    );

    /**
     * Search through permissions of the active organization (not implemented)
     */
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
            preHandler: [fastify.requireAuth],
        },
        async (request, reply) => {
            const { action, resource } = request.query;

            try {
                fastify.authz.userCan([{ action: action, resource: resource }]);
                return reply.code(200).send({ hasPermission: true });
            } catch (e) {
                if (e instanceof UnauthorizedError) {
                    return reply.code(200).send({ hasPermission: false });
                }
                throw e;
            }
        }
    );
}
