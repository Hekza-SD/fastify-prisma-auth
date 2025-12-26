import type { FromSchema } from 'json-schema-to-ts';

export const patchRoleRequestParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
    },
    required: ['roleId'],
} as const;

export const patchRoleRequestBodySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
    },
    required: [],
} as const;

export const patchRoleResponseSchema204 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type PatchRoleRequestParams = FromSchema<typeof patchRoleRequestParamsSchema>;
export type PatchRoleRequestBody = FromSchema<typeof patchRoleRequestBodySchema>;

type PatchRoleResponseSchema204 = FromSchema<typeof patchRoleResponseSchema204>;
export type PatchRoleReply = {
    204: PatchRoleResponseSchema204;
};
