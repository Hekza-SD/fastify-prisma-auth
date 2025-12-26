import type { FromSchema } from 'json-schema-to-ts';

export const getRoleByIdRequestParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const getRoleByIdResponseSchema200 = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        organizationId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'name', 'description', 'organizationId', 'createdAt'],
} as const;

export type GetRoleByIdRequestParams = FromSchema<typeof getRoleByIdRequestParamsSchema>;
type GetRoleByIdResponseSchema200 = FromSchema<typeof getRoleByIdResponseSchema200>;
export type GetRoleByIdReply = {
    200: GetRoleByIdResponseSchema200;
};
