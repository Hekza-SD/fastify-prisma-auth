import type { FromSchema } from 'json-schema-to-ts';

export const postOrganizationMembershipParamsSchema = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export const postOrganizationMembershipBodySchema = {
    type: 'object',
    properties: {
        userId: { type: 'string' },
    },
    required: ['userId'],
} as const;

export const postOrganizationMembershipResponseSchema201 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type PostOrganizationMembershipRequestBody = FromSchema<
    typeof postOrganizationMembershipBodySchema
>;
export type PostOrganizationMembershipRequestParams = FromSchema<
    typeof postOrganizationMembershipParamsSchema
>;
type PostOrganizationMembershipResponseSchema201 = FromSchema<
    typeof postOrganizationMembershipResponseSchema201
>;
export type PostOrganizationMembershipReply = {
    201: PostOrganizationMembershipResponseSchema201;
};
