import type { FastifyInstance } from 'fastify';
import { createRoleService } from './services/role.service';
import { createPermissionService } from './services/permission.service';
import fp from 'fastify-plugin';
import { createRoleMembershipService } from './services/role-membership.service';
import { createRolePermissionService } from './services/role-permission.service';
import { createOrganizationMembershipService } from './services/organization-membership.service';
import { userCan } from './permission-pre-handler';

async function authzPlugin(fastify: FastifyInstance) {
    fastify.decorate('authz', {
        userCan: userCan,
        roles: createRoleService(fastify),
        permissions: createPermissionService(fastify),
        roleMemberships: createRoleMembershipService(fastify),
        rolePermissions: createRolePermissionService(fastify),
        organizationMemberships: createOrganizationMembershipService(fastify),
    });
}

declare module 'fastify' {
    interface FastifyInstance {
        authz: {
            userCan: typeof userCan;
            roles: ReturnType<typeof createRoleService>;
            permissions: ReturnType<typeof createPermissionService>;
            roleMemberships: ReturnType<typeof createRoleMembershipService>;
            rolePermissions: ReturnType<typeof createRolePermissionService>;
            organizationMemberships: ReturnType<typeof createOrganizationMembershipService>;
        };
    }
}

export default fp(authzPlugin, { name: 'authz-plugin' });
