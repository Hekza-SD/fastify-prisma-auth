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
                fastify.authz.userCan(
                    PermissionAction.READ,
                    PermissionResource.ORGANIZATION_MEMBERSHIP
                ),
            ],
        },
        async (request, reply) => {
            const { organizationId } = request.params;
            const members =
                await fastify.authz.organizationMemberships.getOrganizationMembers(organizationId);
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
                fastify.authz.userCan(
                    PermissionAction.CREATE,
                    PermissionResource.ORGANIZATION_MEMBERSHIP
                ),
            ],
        },
        async (request, reply) => {
            const { organizationId } = request.params;
            const { userId } = request.body;
            await fastify.authz.organizationMemberships.createOrganizationMembership(
                organizationId,
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
                fastify.authz.userCan(
                    PermissionAction.DELETE,
                    PermissionResource.ORGANIZATION_MEMBERSHIP
                ),
            ],
        },
        async (request, reply) => {
            const { organizationId, userId } = request.params;

            await fastify.authz.organizationMemberships.deleteOrganizationMembership(
                organizationId,
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
     * Set active organization for user if the user is a member of the organization
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
            preHandler: [fastify.requireAuth],
        },
        async (request, reply) => {
            const { organizationId } = request.body;
            const userId = request.session?.user.id;

            if (!userId) {
                throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
            }

            await fastify.authz.organizationMemberships.isUserMemberOfOrganizationOrThrow(
                userId,
                organizationId
            );

            await fastify.authz.organizationMemberships.setActiveOrganizationForUser(
                userId,
                organizationId
            );

            return reply.code(200).send();
        }
    );
}
