import type { FromSchema } from 'json-schema-to-ts';

export const postRoleRequestBodySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: ['string'] },
    },
    required: ['name', 'description'],
} as const;

export const postRoleResponseSchema200 = {
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

export type PostRoleRequestBody = FromSchema<typeof postRoleRequestBodySchema>;
type PostRoleResponseSchema200 = FromSchema<typeof postRoleResponseSchema200>;
export type PostRoleReply = {
    200: PostRoleResponseSchema200;
};
