import type { FastifyInstance } from 'fastify';
import {
    getOrganizationMembersRequestParamsSchema,
    getOrganizationMembersResponseSchema200,
    type GetOrganizationMembersReply,
    type GetOrganizationMembersRequestParams,
} from '../dto/organization/get-organization-members.dto';
import {
    postOrganizationMembershipBodySchema,
    postOrganizationMembershipParamsSchema,
    postOrganizationMembershipResponseSchema201,
    type PostOrganizationMembershipReply,
    type PostOrganizationMembershipRequestBody,
    type PostOrganizationMembershipRequestParams,
} from '../dto/organization/post-organization-membership';
import {
    deleteOrganizationMembershipRequestParamsSchema,
    deleteOrganizationMembershipResponseSchema204,
    type DeleteOrganizationMembershipReply,
    type DeleteOrganizationMembershipRequestParams,
} from '../dto/organization/delete-organization-membership.dto';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { ErrorMessages } from '../../../errors/error-messages';
import {
    postActiveOrganizationRequestBodySchema,
    postActiveOrganizationResponseSchema200,
    type PostActiveOrganizationReply,
    type PostActiveOrganizationRequestBody,
} from '../dto/organization/post-active-organization.dto';
import {
    getActiveOrganizationRequestParamsSchema,
    getActiveOrganizationResponseSchema200,
    type GetActiveOrganizationReply,
    type GetActiveOrganizationRequestParams,
} from '../dto/organization/get-active-organization.dto';
import { PermissionAction } from '../permission-action';
import { PermissionResource } from '../permission-resource';

export async function organizationRoutes(fastify: FastifyInstance) {
    fastify.get<{
        Params: GetOrganizationMembersRequestParams;
        Reply: GetOrganizationMembersReply;
    }>(
        '/organizations/:organizationId/members',
        {
            schema: {
                params: getOrganizationMembersRequestParamsSchema,
                response: { 200: getOrganizationMembersResponseSchema200 },
            },
            preHandler: [
                fastify.requireAuth,
                fastify.authz.userCan([
                    {
                        action: PermissionAction.READ,
                        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
                    },
                ]),
            ],
        },
        async (request, reply) => {
            const userId = request.session?.user.id;
            if (!userId) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }

            const activeOrganizationId =
                request.activeOrganizationId ??
                (
                    await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                        userId
                    )
                ).id;

            const members =
                await fastify.authz.organizationMemberships.getOrganizationMembers(
                    activeOrganizationId
                );
            return reply.code(200).sendWithDates(members);
        }
    );

    fastify.post<{
        Params: PostOrganizationMembershipRequestParams;
        Body: PostOrganizationMembershipRequestBody;
        Reply: PostOrganizationMembershipReply;
    }>(
        '/organizations/:organizationId/members',
        {
            schema: {
                params: postOrganizationMembershipParamsSchema,
                body: postOrganizationMembershipBodySchema,
                response: { 201: postOrganizationMembershipResponseSchema201 },
            },
            preHandler: [
                fastify.requireAuth,
                fastify.authz.userCan([
                    {
                        action: PermissionAction.CREATE,
                        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
                    },
                ]),
            ],
        },
        async (request, reply) => {
            const { userId } = request.body;

            const user = request.session?.user;
            if (!user) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }
            const activeOrganizationId =
                request.activeOrganizationId ??
                (
                    await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                        user.id
                    )
                ).id;

            await fastify.authz.organizationMemberships.createOrganizationMembership(
                activeOrganizationId,
                userId
            );

            return reply.code(201).send();
        }
    );

    fastify.delete<{
        Params: DeleteOrganizationMembershipRequestParams;
        Reply: DeleteOrganizationMembershipReply;
    }>(
        '/organizations/:organizationId/members/:userId',
        {
            schema: {
                params: deleteOrganizationMembershipRequestParamsSchema,
                response: {
                    204: deleteOrganizationMembershipResponseSchema204,
                },
            },
            preHandler: [
                fastify.requireAuth,
                fastify.authz.userCan([
                    {
                        action: PermissionAction.DELETE,
                        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
                    },
                ]),
            ],
        },
        async (request, reply) => {
            const { userId } = request.params;

            const user = request.session?.user;
            if (!user) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }
            const activeOrganizationId =
                request.activeOrganizationId ??
                (
                    await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                        user.id
                    )
                ).id;

            await fastify.authz.organizationMemberships.deleteOrganizationMembership(
                activeOrganizationId,
                userId
            );

            return reply.code(204).send();
        }
    );

    fastify.get<{ Params: GetActiveOrganizationRequestParams; Reply: GetActiveOrganizationReply }>(
        '/organizations/active',
        {
            schema: {
                params: getActiveOrganizationRequestParamsSchema,
                response: { 200: getActiveOrganizationResponseSchema200 },
            },
            preHandler: [fastify.requireAuth],
        },
        async (request, reply) => {
            const userId = request.session?.user.id;

            if (!userId) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }

            const organization =
                await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                    userId
                );

            return reply.code(200).sendWithDates(organization);
        }
    );

    /**
     * Set the active organization for the connected user.
     */
    fastify.post<{
        Body: PostActiveOrganizationRequestBody;
        Reply: PostActiveOrganizationReply;
    }>(
        '/organizations/active',
        {
            schema: {
                body: postActiveOrganizationRequestBodySchema,
                response: { 200: postActiveOrganizationResponseSchema200 },
            },
            preHandler: [fastify.requireAuth, fastify.authz.requireOrgMembership],
        },
        async (request, reply) => {
            const { organizationId } = request.body;

            const userId = request.session?.user.id;

            if (!userId) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }

            await fastify.authz.organizationMemberships.setActiveOrganizationForUser(
                userId,
                organizationId
            );

            return reply.code(200).send();
        }
    );
}
