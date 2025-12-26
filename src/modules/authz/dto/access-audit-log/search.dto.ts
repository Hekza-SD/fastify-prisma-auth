import type { FromSchema } from 'json-schema-to-ts';
import { PermissionAction } from '../../permission-action';
import { PermissionResource } from '../../permission-resource';

export const searchAccessAuditLogsRequestQuerySchema = {
    type: 'object',
    properties: {
        userId: { type: 'string' },
        action: { type: 'string', enum: Object.values(PermissionAction) },
        resource: { type: 'string', enum: Object.values(PermissionResource) },
        allowed: { type: 'boolean' },
        fromDate: { type: 'string', format: 'date-time' },
        toDate: { type: 'string', format: 'date-time' },
        createdAtOrder: { type: 'string', enum: ['asc', 'desc'] },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
        offset: { type: 'integer', minimum: 0 },
    },
    required: [],
} as const;

export const searchAccessAuditLogsResponseSchema200 = {
    type: 'object',
    properties: {
        logs: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    action: { type: 'string' },
                    resource: { type: 'string' },
                    resourceId: { type: 'string', nullable: true },
                    allowed: { type: 'boolean' },
                    context: { type: 'object', additionalProperties: true },
                    createdAt: { type: 'string', format: 'date-time' },
                },
                required: [
                    'id',
                    'userId',
                    'action',
                    'resource',
                    'resourceId',
                    'allowed',
                    'context',
                    'createdAt',
                ],
            },
        },
    },
    required: ['logs'],
} as const;

export type SearchAccessAuditLogsRequestQuery = FromSchema<
    typeof searchAccessAuditLogsRequestQuerySchema
>;
type SearchAccessAuditLogsResponseSchema200 = FromSchema<
    typeof searchAccessAuditLogsResponseSchema200
>;
export type SearchAccessAuditLogsReply = {
    200: SearchAccessAuditLogsResponseSchema200;
};
