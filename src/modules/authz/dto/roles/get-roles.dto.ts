import type { FromSchema } from 'json-schema-to-ts';

export const getRolesRequestQuerySchema = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export const getRolesResponseSchema200 = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: ['string', 'null'] },
            organizationId: { type: ['string', 'null'] },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'description', 'organizationId', 'createdAt'],
    },
} as const;

export type GetRolesQueryString = FromSchema<typeof getRolesRequestQuerySchema>;
type GetPermissionByIdResponseSchema200 = FromSchema<typeof getRolesResponseSchema200>;
export type GetRolesReply = {
    200: GetPermissionByIdResponseSchema200;
};
