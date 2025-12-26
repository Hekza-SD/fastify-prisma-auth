import type { FromSchema } from 'json-schema-to-ts';

export const deleteRolePermissionRequestParamsSchema = {
    type: 'object',
    properties: {
        roleId: { type: 'number' },
        permissionId: { type: 'number' },
    },
    required: ['roleId', 'permissionId'],
} as const;

export const deleteRolePermissionResponseSchema204 = {
    type: 'object',
    properties: {},
    required: [],
} as const;

export type DeleteRolePermissionRequestParams = FromSchema<
    typeof deleteRolePermissionRequestParamsSchema
>;
type DeleteRolePermissionResponseSchema204 = FromSchema<
    typeof deleteRolePermissionResponseSchema204
>;
export type DeleteRolePermissionReply = {
    204: DeleteRolePermissionResponseSchema204;
};
