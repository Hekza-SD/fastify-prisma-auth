import type { FromSchema } from 'json-schema-to-ts';

export const postRoleMembershipParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const postRoleMembershipBodySchema = {
    type: 'object',
    properties: {
        userId: { type: 'string' },
    },
    required: ['userId'],
} as const;

export const postRoleMembershipResponseSchema201 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type PostRoleMembershipRequestBody = FromSchema<typeof postRoleMembershipBodySchema>;
export type PostRoleMembershipRequestParams = FromSchema<typeof postRoleMembershipParamsSchema>;
type PostRoleMembershipResponseSchema201 = FromSchema<typeof postRoleMembershipResponseSchema201>;
export type PostRoleMembershipReply = {
    201: PostRoleMembershipResponseSchema201;
};
