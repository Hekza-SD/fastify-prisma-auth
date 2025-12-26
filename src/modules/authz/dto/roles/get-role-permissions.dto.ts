import type { FromSchema } from 'json-schema-to-ts';

export const getRolePermissionsRequestParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const getRolePermissionsResponseSchema200 = {
    type: 'array',
    properties: {
        id: { type: 'number' },
        action: { type: 'string' },
        resource: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        description: { type: 'string', nullable: true },
    },
    required: ['id', 'action', 'resource', 'createdAt'],
} as const;

export type GetRolePermissionsRequestParams = FromSchema<
    typeof getRolePermissionsRequestParamsSchema
>;
type GetRolePermissionsResponseSchema200 = FromSchema<typeof getRolePermissionsResponseSchema200>;
export type GetRolePermissionsReply = {
    200: GetRolePermissionsResponseSchema200;
};
