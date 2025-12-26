import type { FromSchema } from 'json-schema-to-ts';

export const postRolePermissionParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const postRolePermissionBodySchema = {
    type: 'object',
    properties: {
        permissionId: { type: 'number' },
    },
    required: ['permissionId'],
} as const;

export const postRolePermissionResponseSchema201 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type PostRolePermissionRequestBody = FromSchema<typeof postRolePermissionBodySchema>;
export type PostRolePermissionRequestParams = FromSchema<typeof postRolePermissionParamsSchema>;
type PostRolePermissionResponseSchema201 = FromSchema<typeof postRolePermissionResponseSchema201>;
export type PostRolePermissionReply = {
    201: PostRolePermissionResponseSchema201;
};
