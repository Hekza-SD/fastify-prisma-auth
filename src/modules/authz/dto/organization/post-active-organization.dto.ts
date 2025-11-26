import type { FromSchema } from 'json-schema-to-ts';

export const postActiveOrganizationRequestBodySchema = {
    type: 'object',
    properties: {
        organizationId: { type: 'string' },
    },
    required: ['organizationId'],
} as const;

export const postActiveOrganizationResponseSchema200 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type PostActiveOrganizationRequestBody = FromSchema<
    typeof postActiveOrganizationRequestBodySchema
>;
type PostActiveOrganizationResponseSchema200 = FromSchema<
    typeof postActiveOrganizationResponseSchema200
>;
export type PostActiveOrganizationReply = {
    200: PostActiveOrganizationResponseSchema200;
};
