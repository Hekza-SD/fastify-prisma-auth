import type { FromSchema } from 'json-schema-to-ts';

export const getActiveOrganizationRequestParamsSchema = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export const getActiveOrganizationResponseSchema200 = {
    oneOf: [
        {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                slug: { type: 'string' },
            },
            required: ['id', 'name', 'createdAt', 'updatedAt', 'slug'],
        },
        { type: 'null' },
    ],
} as const;

export type GetActiveOrganizationRequestParams = FromSchema<
    typeof getActiveOrganizationRequestParamsSchema
>;
type GetActiveOrganizationResponseSchema200 = FromSchema<
    typeof getActiveOrganizationResponseSchema200
>;
export type GetActiveOrganizationReply = {
    200: GetActiveOrganizationResponseSchema200;
};
