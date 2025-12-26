import type { FromSchema } from 'json-schema-to-ts';

export const getRoleMembersRequestParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const getRoleMembersResponseSchema200 = {
    type: 'array',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        image: { type: 'string', nullable: true },
    },
    required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
} as const;

export type GetRoleMembersRequestParams = FromSchema<typeof getRoleMembersRequestParamsSchema>;
type GetRoleMembersResponseSchema200 = FromSchema<typeof getRoleMembersResponseSchema200>;
export type GetRoleMembersReply = {
    200: GetRoleMembersResponseSchema200;
};
