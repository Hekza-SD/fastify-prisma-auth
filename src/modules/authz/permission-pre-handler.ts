import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../errors/unauthorized-error';

import { ErrorMessages } from '../../errors/error-messages';
import type { PermissionAction } from './permission-action';
import type { PermissionResource } from './permission-resource';

export const userCan =
    (action: PermissionAction, resource: PermissionResource) =>
    async (req: FastifyRequest, _res: FastifyReply) => {
        const userId = req.session?.user.id;

        if (!userId) {
            throw new UnauthorizedError(ErrorMessages.UNAUTHENTICATED);
        }

        const activeOrganization =
            await req.server.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                userId
            );

        const hasPermission =
            await req.server.authz.permissions.userHasPermissionInActiveOrganization(
                userId,
                activeOrganization.id,
                action,
                resource
            );

        if (!hasPermission) {
            throw new UnauthorizedError(ErrorMessages.FORBIDDEN);
        }
    };
