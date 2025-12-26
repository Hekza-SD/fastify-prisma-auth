import type { FastifyInstance } from 'fastify';

export const createRoleMembershipService = (fastify: FastifyInstance) => ({
    getRoleMembersForOrganization: async (roleId: number, organizationId: string) => {
        const members = await fastify.prisma.roleMembership.findMany({
            where: { roleId, role: { organizationId } },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                        image: true,
                    },
                },
            },
        });
        return members.map((member) => member.user);
    },

    createRoleMembership: async (roleId: number, userId: string) => {
        await fastify.prisma.roleMembership.create({
            data: {
                roleId,
                userId,
            },
        });
    },

    deleteRoleMembership: async (roleId: number, userId: string, organizationId?: string) => {
        await fastify.prisma.roleMembership.delete({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
                role: { organizationId },
            },
        });
    },
});
