import type { FastifyInstance } from 'fastify';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { ErrorMessages } from '../../../errors/error-messages';
import { organization } from 'better-auth/plugins';

export const createRoleService = (fastify: FastifyInstance) => ({
    /**
     * @param organizationId Optionnal param
     * @returns An organization's roles or global roles if organizationId is null
     */
    getRolesForOrganization: async (organizationId: string) => {
        return fastify.prisma.role.findMany({
            where: {
                organizationId: organizationId,
            },
        });
    },

    getRoleByIdOrThrow: async (roleId: number) => {
        try {
            return await fastify.prisma.role.findUniqueOrThrow({
                where: {
                    id: roleId,
                },
            });
        } catch (error) {
            throw new UnauthorizedError(ErrorMessages.FORBIDDEN);
        }
    },

    getRoleByIdAndOrganizationIdOrThrow: async (roleId: number, organizationId: string) => {
        try {
            return await fastify.prisma.role.findFirstOrThrow({
                where: {
                    id: roleId,
                    organizationId: organizationId,
                },
            });
        } catch (error) {
            throw new UnauthorizedError(ErrorMessages.FORBIDDEN);
        }
    },

    createRole: async (organizationId: string, name: string, description: string) => {
        return fastify.prisma.role.create({
            data: {
                name,
                description,
                organizationId,
            },
        });
    },

    deleteRoleForOrganization: async (organizationId: string, roleId: number) => {
        await fastify.prisma.role.delete({
            where: {
                id: roleId,
                organizationId: organizationId,
            },
        });
    },

    patchRole: async (roleId: number, name?: string, description?: string) => {
        return fastify.prisma.role.update({
            where: {
                id: roleId,
            },
            data: {
                name,
                description,
            },
        });
    },
});
