import type { FastifyInstance } from 'fastify';

export const createRolePermissionService = (fastify: FastifyInstance) => ({
    getRolePermissions: async (roleId: number, organizationId?: string) => {
        const permissions = await fastify.prisma.rolePermission.findMany({
            where: { roleId, role: { organizationId } },
            include: {
                permission: true,
            },
        });
        return permissions.map((rp) => rp.permission);
    },

    createRolePermission: async (roleId: number, permissionId: number) => {
        await fastify.prisma.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
        });
    },

    deleteRolePermission: async (roleId: number, permissionId: number, organizationId?: string) => {
        await fastify.prisma.rolePermission.delete({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
                role: {
                    organizationId,
                },
            },
        });
    },
});
