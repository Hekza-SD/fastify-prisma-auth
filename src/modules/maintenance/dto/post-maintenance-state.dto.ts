import type { FromSchema } from 'json-schema-to-ts';

export const postMaintenanceStateBodySchema = {
    type: 'object',
    properties: {
        enabled: { type: 'boolean' },
    },
    required: ['enabled'],
} as const;

export const postMaintenanceStateResponseSchema = {
    type: 'object',
    properties: {
        enabled: { type: 'boolean' },
        startTime: { type: ['string', 'null'] },
    },
    required: ['enabled', 'startTime'],
} as const;

export type PostMaintenanceBody = FromSchema<typeof postMaintenanceStateBodySchema>;

type PostMaintenanceResponse200 = FromSchema<typeof postMaintenanceStateResponseSchema>;
export type PostMaintenanceReply = {
    200: PostMaintenanceResponse200;
};
