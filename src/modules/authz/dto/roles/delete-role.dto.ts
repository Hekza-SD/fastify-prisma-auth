import type { FromSchema } from 'json-schema-to-ts';

export const deleteRoleRequestParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const deleteRoleResponseSchema204 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type DeleteRoleRequestParams = FromSchema<typeof deleteRoleRequestParamsSchema>;
type DeleteRoleResponseSchema204 = FromSchema<typeof deleteRoleResponseSchema204>;
export type DeleteRoleReply = {
    204: DeleteRoleResponseSchema204;
};
