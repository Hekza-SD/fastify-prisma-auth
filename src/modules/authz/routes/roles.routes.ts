import type { FastifyInstance } from 'fastify';
import {
    getRolesRequestQuerySchema,
    getRolesResponseSchema200,
    type GetRolesQueryString,
    type GetRolesReply,
} from '../dto/roles/get-roles.dto';
import {
    postRoleRequestBodySchema,
    postRoleResponseSchema200,
    type PostRoleReply,
    type PostRoleRequestBody,
} from '../dto/roles/post-role.dto';
import {
    deleteRoleRequestParamsSchema,
    deleteRoleResponseSchema204,
    type DeleteRoleReply,
    type DeleteRoleRequestParams,
} from '../dto/roles/delete-role.dto';
import {
    getRoleByIdRequestParamsSchema,
    getRoleByIdResponseSchema200,
    type GetRoleByIdReply,
    type GetRoleByIdRequestParams,
} from '../dto/roles/get-role-by-id.dto';

import {
    patchRoleRequestBodySchema,
    patchRoleRequestParamsSchema,
    patchRoleResponseSchema204,
    type PatchRoleReply,
    type PatchRoleRequestBody,
    type PatchRoleRequestParams,
} from '../dto/roles/patch-role.dto';
import {
    getRoleMembersRequestParamsSchema,
    getRoleMembersResponseSchema200,
    type GetRoleMembersReply,
    type GetRoleMembersRequestParams,
} from '../dto/roles/get-role-members.dto';
import {
    postRoleMembershipBodySchema,
    postRoleMembershipParamsSchema,
    postRoleMembershipResponseSchema201,
    type PostRoleMembershipReply,
    type PostRoleMembershipRequestBody,
    type PostRoleMembershipRequestParams,
} from '../dto/roles/add-role-membership.dto';
import {
    deleteRoleMembershipRequestParamsSchema,
    deleteRoleMembershipResponseSchema204,
    type DeleteRoleMembershipReply,
    type DeleteRoleMembershipRequestParams,
} from '../dto/roles/delete-role-membership.dto';
import {
    getRolePermissionsRequestParamsSchema,
    getRolePermissionsResponseSchema200,
    type GetRolePermissionsReply,
    type GetRolePermissionsRequestParams,
} from '../dto/roles/get-role-permissions.dto';
import {
    postRolePermissionBodySchema,
    postRolePermissionParamsSchema,
    postRolePermissionResponseSchema201,
    type PostRolePermissionReply,
    type PostRolePermissionRequestBody,
    type PostRolePermissionRequestParams,
} from '../dto/roles/post-role-permission.dto';
import {
    deleteRolePermissionRequestParamsSchema,
    deleteRolePermissionResponseSchema204,
    type DeleteRolePermissionReply,
    type DeleteRolePermissionRequestParams,
} from '../dto/roles/delete-role-permission.dto';

export async function rolesRoutes(fastify: FastifyInstance) {
    // Get all roles for an organization
    fastify.get<{ Querystring: GetRolesQueryString; Reply: GetRolesReply }>(
        '/roles',
        {
            schema: {
                querystring: getRolesRequestQuerySchema,
                response: {
                    200: getRolesResponseSchema200,
                },
            },
        },
        async (request, reply) => {
            const { organizationId } = request.query;
            const roles = await fastify.authz.roles.getRoles(organizationId);
            return reply.code(200).sendWithDates(roles);
        }
    );

    // Create a new role
    fastify.post<{ Body: PostRoleRequestBody; Reply: PostRoleReply }>(
        '/roles',
        {
            schema: {
                body: postRoleRequestBodySchema,
                response: {
                    200: postRoleResponseSchema200,
                },
            },
        },
        async (request, reply) => {
            const { organizationId, name, description } = request.body;
            const role = await fastify.authz.roles.createRole(organizationId, name, description);
            return reply.code(200).sendWithDates(role);
        }
    );

    // Delete a role
    fastify.delete<{ Params: DeleteRoleRequestParams; Reply: DeleteRoleReply }>(
        '/roles/:roleId',
        {
            schema: {
                params: deleteRoleRequestParamsSchema,
                response: { 204: deleteRoleResponseSchema204 },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params;
            await fastify.authz.roles.deleteRole(roleId);
            return reply.code(204).send();
        }
    );

    // Get role by ID
    fastify.get<{ Params: GetRoleByIdRequestParams; Reply: GetRoleByIdReply }>(
        '/roles/:roleId',
        {
            schema: {
                params: getRoleByIdRequestParamsSchema,
                response: {
                    200: getRoleByIdResponseSchema200,
                },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params;

            const role = await fastify.authz.roles.getRoleByIdOrThrow(roleId);

            return reply.code(200).sendWithDates(role);
        }
    );

    // Patch a role
    fastify.patch<{
        Params: PatchRoleRequestParams;
        Body: PatchRoleRequestBody;
        Reply: PatchRoleReply;
    }>(
        '/roles/:roleId',
        {
            schema: {
                params: patchRoleRequestParamsSchema,
                body: patchRoleRequestBodySchema,
                response: {
                    204: patchRoleResponseSchema204,
                },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params;
            const { name, description } = request.body;

            await fastify.authz.roles.patchRole(roleId, name, description);

            return reply.code(204).send();
        }
    );

    fastify.get<{ Params: GetRoleMembersRequestParams; Reply: GetRoleMembersReply }>(
        '/roles/:roleId/members',
        {
            schema: {
                params: getRoleMembersRequestParamsSchema,
                response: {
                    200: getRoleMembersResponseSchema200,
                },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params as { roleId: number };
            const members = await fastify.authz.roleMemberships.getRoleMembers(roleId);
            return reply.code(200).sendWithDates(members);
        }
    );

    fastify.post<{
        Params: PostRoleMembershipRequestParams;
        Body: PostRoleMembershipRequestBody;
        Reply: PostRoleMembershipReply;
    }>(
        '/roles/:roleId/members',
        {
            schema: {
                params: postRoleMembershipParamsSchema,
                body: postRoleMembershipBodySchema,
                response: {
                    201: postRoleMembershipResponseSchema201,
                },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params;
            const { userId } = request.body;

            await fastify.authz.roleMemberships.createRoleMembership(roleId, userId);

            return reply.code(201).send();
        }
    );

    fastify.delete<{ Params: DeleteRoleMembershipRequestParams; Reply: DeleteRoleMembershipReply }>(
        '/roles/:roleId/members/:userId',
        {
            schema: {
                params: deleteRoleMembershipRequestParamsSchema,
                response: { 204: deleteRoleMembershipResponseSchema204 },
            },
        },
        async (request, reply) => {
            const { roleId, userId } = request.params as { roleId: number; userId: string };

            await fastify.authz.roleMemberships.deleteRoleMembership(roleId, userId);

            return reply.code(204).send();
        }
    );

    fastify.get<{ Params: GetRolePermissionsRequestParams; Reply: GetRolePermissionsReply }>(
        '/roles/:roleId/permissions',
        {
            schema: {
                params: getRolePermissionsRequestParamsSchema,
                response: {
                    200: getRolePermissionsResponseSchema200,
                },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params;
            const permissions = await fastify.authz.rolePermissions.getRolePermissions(roleId);
            return reply.code(200).sendWithDates(permissions);
        }
    );

    fastify.post<{
        Params: PostRolePermissionRequestParams;
        Body: PostRolePermissionRequestBody;
        Reply: PostRolePermissionReply;
    }>(
        '/roles/:roleId/permissions',
        {
            schema: {
                params: postRolePermissionParamsSchema,
                body: postRolePermissionBodySchema,
                response: {
                    201: postRolePermissionResponseSchema201,
                },
            },
        },
        async (request, reply) => {
            const { roleId } = request.params;
            const { permissionId } = request.body;
            await fastify.authz.rolePermissions.createRolePermission(roleId, permissionId);
            return reply.code(201).send();
        }
    );

    fastify.delete<{ Params: DeleteRolePermissionRequestParams; Reply: DeleteRolePermissionReply }>(
        '/roles/:roleId/permissions/:permissionId',
        {
            schema: {
                params: deleteRolePermissionRequestParamsSchema,
                response: { 204: deleteRolePermissionResponseSchema204 },
            },
        },
        async (request, reply) => {
            const { roleId, permissionId } = request.params;
            await fastify.authz.rolePermissions.deleteRolePermission(roleId, permissionId);
            return reply.code(204).send();
        }
    );
}
