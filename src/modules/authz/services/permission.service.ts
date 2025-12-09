import type { FastifyInstance } from 'fastify';
import type { PermissionAction } from '../permission-action';
import type { PermissionResource } from '../permission-resource';
import { PermissionScope } from '../permission-scope';
import { NotFoundError } from '../../../errors/not-found-error';
import { ErrorMessages } from '../../../errors/error-messages';
import { ErrorCodes } from '../../../errors/error-codes';

export const createPermissionService = (fastify: FastifyInstance) => ({
    getPermissionByIdOrThrow: async (id: number, scope?: PermissionScope[]) => {
        try {
            return await fastify.prisma.permission.findUniqueOrThrow({
                where: { id, scope: scope ? { in: scope } : undefined },
            });
        } catch (error) {
            throw new NotFoundError(
                ErrorMessages.RESOURCE_NOT_FOUND,
                ErrorCodes.PERMISSION_NOT_FOUND
            );
        }
    },

    getPermission(action: PermissionAction, resource?: PermissionResource) {
        if (!resource) {
            return fastify.prisma.permission.findFirst({
                where: { action },
            });
        }

        return fastify.prisma.permission.findUnique({
            where: {
                action_resource: {
                    action: action,
                    resource: resource,
                },
            },
        });
    },

    getPermissions: async (activeOrganizationId: string) => {
        return fastify.prisma.permission.findMany({
            where: {
                rolePermissions: {
                    some: {
                        role: {
                            organizationId: activeOrganizationId,
                        },
                    },
                },
            },
        });
    },

    /**
     * Check if a user has a specific permission within an organization
     */
    userHasPermission: async (
        userId: string,
        organizationId: string,
        action: PermissionAction,
        resource: PermissionResource
    ) => {
        const permission = await fastify.prisma.permission.findFirst({
            where: {
                action,
                resource,
                rolePermissions: {
                    some: {
                        role: {
                            organizationId,
                            memberships: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                },
            },
        });

        return Boolean(permission);
    },

    /**
     * Check if a user has a specific global permission
     */
    userHasGlobalPermission: async (
        userId: string,
        action: PermissionAction,
        resource: PermissionResource
    ) => {
        const permission = await fastify.prisma.permission.findFirst({
            where: {
                action,
                resource,
                scope: PermissionScope.GLOBAL,
                rolePermissions: {
                    some: {
                        role: {
                            memberships: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                },
            },
        });

        return Boolean(permission);
    },
});
