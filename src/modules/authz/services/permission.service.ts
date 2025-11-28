import type { FastifyInstance } from 'fastify';
import type { PermissionAction } from '../permission-action';
import type { PermissionResource } from '../permission-resource';

export const createPermissionService = (fastify: FastifyInstance) => ({
    getPermissionById: async (id: number) => {
        return fastify.prisma.permission.findUniqueOrThrow({
            where: { id },
        });
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

    getPermissions: async () => {
        return fastify.prisma.permission.findMany();
    },

    userHasPermissionInActiveOrganization: async (
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
});
