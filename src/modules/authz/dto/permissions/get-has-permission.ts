import type { FromSchema } from 'json-schema-to-ts';
import { PermissionAction } from '../../permission-action';
import { PermissionResource } from '../../permission-resource';

export const getHasPermissionQueryStringSchema = {
    type: 'object',
    properties: {
        action: { type: 'string', enum: Object.values(PermissionAction) },
        resource: {
            type: 'string',
            enum: Object.values(PermissionResource),
        },
    },
    required: ['action', 'resource'],
} as const;

export const getHasPermissionResponseSchema200 = {
    type: 'object',
    properties: {
        hasPermission: { type: 'boolean' },
    },
    required: ['hasPermission'],
} as const;

export type GetHasPermissionQueryString = FromSchema<typeof getHasPermissionQueryStringSchema>;

type GetHasPermissionResponse200 = FromSchema<typeof getHasPermissionResponseSchema200>;

export type GetHasPermissionReply = {
    200: GetHasPermissionResponse200;
};
