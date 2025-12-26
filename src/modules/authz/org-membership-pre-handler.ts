import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { ErrorMessages } from '../../errors/error-messages';
import { ValidationError } from '../../errors/validation-error';
import { PermissionAction } from './permission-action';
import { PermissionResource } from './permission-resource';

/**
 * Check if the user is a member of the organization specified in the request.
 * The organizationId can be provided in the query, params or body of the request.
 * A user with a bypass permission for organization membership will be allowed.
 * @param request
 * @param reply
 * @returns
 * @throws UnauthorizedError if the user is not authenticated.
 * @throws ValidationError if the organizationId is not provided.
 * @throws UnauthorizedError if the user is not a member of the organization.
 */
export const requireOrgMembership = async function (request: FastifyRequest, reply: FastifyReply) {
    const { organizationId } = (request.query ?? request.params ?? request.body ?? {}) as {
        organizationId?: string;
    };

    if (!organizationId) {
        throw new ValidationError();
    }

    const user = request.session?.user;

    if (!user) {
        request.server.log.warn(
            'Trying to check organization membership for unauthenticated user. You may want to add fastify.requireAuth preHandler before authz.requireOrgMembership.'
        );
        throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
    }

    if (
        await request.server.authz.userCan([
            {
                action: PermissionAction.BYPASS,
                resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
            },
        ])
    ) {
        return;
    }

    await request.server.authz.organizationMemberships.isUserMemberOfOrganizationOrThrow(
        user.id,
        organizationId
    );
};
