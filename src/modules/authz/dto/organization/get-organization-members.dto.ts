import type { FromSchema } from 'json-schema-to-ts';

export const getOrganizationMembersRequestParamsSchema = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export const getOrganizationMembersResponseSchema200 = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },

            roles: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['id', 'name', 'createdAt', 'description'],
                },
            },
        },
        required: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'roles', 'image'],
    },
} as const;

export type GetOrganizationMembersRequestParams = FromSchema<
    typeof getOrganizationMembersRequestParamsSchema
>;
type GetOrganizationMembersResponseSchema200 = FromSchema<
    typeof getOrganizationMembersResponseSchema200
>;
export type GetOrganizationMembersReply = {
    200: GetOrganizationMembersResponseSchema200;
};
