import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../errors/unauthorized-error';

import { ErrorMessages } from '../../errors/error-messages';
import type { PermissionAction } from './permission-action';
import type { PermissionResource } from './permission-resource';
import { PermissionScope } from './permission-scope';

export type UserCanOptions = {
    action: PermissionAction;
    resource: PermissionResource;
    scope?: PermissionScope;

    // Specifies to use the organization of the user's active membership,
    // ignoring any organizationId in the request
    // Useful for routes that takes an organizationId but for which the
    // permission check should always be done on the active organization instead
    // It also prevents organizationId tampering by the client
    // True by default in such cases
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
        // By default, force using active organization for all options
        options.map((option) => {
            if (!option.forceActiveOrganization) {
                option.forceActiveOrganization = true;
            }
        });

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
        req.activeOrganizationId = activeOrganizationId;

        const auditLog = async (
            allowed: boolean,
            action: PermissionAction,
            resource: PermissionResource
        ) => {
            await req.server.authz.accessAuditLogs.createAccessAuditLog(
                action,
                resource,
                allowed,
                userId,
                activeOrganizationId,
                undefined,
                { query: req.query, params: req.params }
            );
        };

        for (const { action, resource, scope, forceActiveOrganization } of options) {
            const orgId = forceActiveOrganization
                ? activeOrganizationId
                : (organizationId ?? activeOrganizationId);

            if (scope === PermissionScope.GLOBAL) {
                const hasGlobalPermission =
                    await req.server.authz.permissions.userHasGlobalPermission(
                        userId,
                        action,
                        resource
                    );

                if (hasGlobalPermission) {
                    await auditLog(true, action, resource);
                    return;
                }

                await auditLog(false, action, resource);
                continue;
            }

            const hasPermission = await req.server.authz.permissions.userHasPermission(
                userId,
                orgId,
                action,
                resource
            );

            if (hasPermission) {
                await auditLog(true, action, resource);
                return;
            }

            const hasGlobalPermission = await req.server.authz.permissions.userHasGlobalPermission(
                userId,
                action,
                resource
            );

            if (hasGlobalPermission) {
                await auditLog(true, action, resource);
                return;
            }

            // Not granted for this option → log denied
            await auditLog(false, action, resource);
        }

        // None of the permissions allowed → denied
        throw new UnauthorizedError(ErrorMessages.FORBIDDEN);
    };
