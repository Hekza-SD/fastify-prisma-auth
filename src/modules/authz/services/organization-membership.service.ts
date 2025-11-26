import type { FastifyInstance } from 'fastify';
import { is } from 'zod/locales';
import { OrganizationError } from '../../../errors/organization-error';
import { ErrorMessages } from '../../../errors/error-messages';
import { ErrorCodes } from '../../../errors/error-codes';

export const createOrganizationMembershipService = (fastify: FastifyInstance) => ({
    async createOrganizationMembership(organizationId: string, userId: string) {
        return await fastify.prisma.organizationMembership.create({
            data: {
                organizationId,
                userId,
            },
        });
    },

    async deleteOrganizationMembership(organizationId: string, userId: string) {
        return await fastify.prisma.organizationMembership.delete({
            where: {
                userId_organizationId: {
                    organizationId,
                    userId,
                },
            },
        });
    },

    // Retrieves all members of an organization along with their user details and roles
    // We make sure to filter the organizationId on both organizationMembership and roleMemberships to ensure we don't leak roles
    async getOrganizationMembers(organizationId: string) {
        const members = await fastify.prisma.organizationMembership.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true,
                        updatedAt: true,
                        roleMemberships: {
                            where: {
                                role: { organizationId },
                            },
                            include: {
                                role: {
                                    select: {
                                        id: true,
                                        name: true,
                                        description: true,
                                        createdAt: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return members.map((member) => ({
            ...member.user,
            roles: member.user.roleMemberships.map((rm) => rm.role),
            roleMemberships: undefined,
        }));
    },

    async getActiveOrganizationForUser(userId: string) {
        const result = await fastify.prisma.userActiveOrganization.findUnique({
            where: {
                userId,
            },
            include: { organization: true },
        });
        return result?.organization;
    },

    // Create a UserActiveOrganization entry or update the existing one
    async setActiveOrganizationForUser(userId: string, organizationId: string) {
        return await fastify.prisma.userActiveOrganization.upsert({
            where: { userId },
            create: {
                userId,
                organizationId,
            },
            update: {
                organizationId,
            },
        });
    },

    // Throws an OrganizationError if the user is not a member of the organization
    async isUserMemberOfOrganizationOrThrow(userId: string, organizationId: string) {
        try {
            const membership = await fastify.prisma.organizationMembership.findUniqueOrThrow({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId,
                    },
                },
            });
            return membership;
        } catch (error) {
            throw new OrganizationError(
                ErrorMessages.ORGANIZATION_MEMBERSHIP_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND,
                {},
                { originalError: error }
            );
        }
    },
});
