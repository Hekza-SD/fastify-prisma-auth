import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../errors/unauthorized-error';

import { ErrorMessages } from '../../errors/error-messages';
import type { PermissionAction } from './permission-action';
import type { PermissionResource } from './permission-resource';

export type UserCanOptions = {
    action: PermissionAction;
    resource: PermissionResource;

    // Specifies to use the organization of the user's active membership,
    // ignoring any organizationId in the request
    // Useful for routes that takes an organizationId but for which the
    // permission check should always be done on the active organization instead
    forceActiveOrganization?: boolean;
}[];

/**
 * Checks if the user has the required permissions. The permission is granted if the user has at least one of the specified permissions.
 * @param options
 * @returns
 * @throws UnauthorizedError if the user does not have the required permissions
 */
export const userCan =
    (options: UserCanOptions) => async (req: FastifyRequest, _res: FastifyReply) => {
        const userId = req.session?.user.id;

        if (!userId) {
            req.server.log.warn(
                'Trying to check permissions for unauthenticated user. You may want to add fastify.requireAuth preHandler before authz.userCan.'
            );
            throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
        }

        let { organizationId } = (req.query ?? req.params ?? req.body ?? {}) as {
            organizationId?: string;
        };

        const activeOrganizationId = (
            await req.server.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                userId
            )
        ).id;

        for (const { action, resource, forceActiveOrganization } of options) {
            const hasPermission = await req.server.authz.permissions.userHasPermission(
                userId,
                forceActiveOrganization
                    ? activeOrganizationId
                    : (organizationId ?? activeOrganizationId),
                action,
                resource
            );

            if (hasPermission) {
                return;
            }

            const hasGlobalPermission = await req.server.authz.permissions.userHasGlobalPermission(
                userId,
                action,
                resource
            );

            if (hasGlobalPermission) {
                return;
            }
        }

        throw new UnauthorizedError(ErrorMessages.FORBIDDEN);
    };
