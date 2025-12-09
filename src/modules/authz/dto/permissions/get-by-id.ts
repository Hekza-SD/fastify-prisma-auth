import type { FromSchema } from 'json-schema-to-ts';

// Not currently used, but defined for consistency and future use

export const getPermissionByIdParamSchema = {
    type: 'object',
    properties: {
        permissionId: { type: 'number' },
    },
    required: ['permissionId'],
} as const;

export const getPermissionByIdResponseSchema200 = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        action: { type: 'string' },
        resource: { type: 'string' },
        description: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'action', 'resource', 'description', 'createdAt'],
} as const;

export type GetPermissionByIdParams = FromSchema<typeof getPermissionByIdParamSchema>;

type GetPermissionByIdResponse200 = FromSchema<typeof getPermissionByIdResponseSchema200>;

export type GetPermissionByIdReply = {
    200: GetPermissionByIdResponse200;
};
