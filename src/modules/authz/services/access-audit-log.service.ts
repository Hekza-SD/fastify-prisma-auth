import type { FastifyInstance } from 'fastify';
import type { PermissionAction } from '../permission-action';
import type { PermissionResource } from '../permission-resource';
import type { AccessAuditLogFilter } from '../types';

export const createAccessAuditLogService = (fastify: FastifyInstance) => ({
    createAccessAuditLog: async (
        action: PermissionAction,
        resource: PermissionResource,
        allowed: boolean,
        userId: string,
        organizationId: string,
        resourceId?: string,
        context?: Record<string, any>
    ) => {
        fastify.prisma.accessAuditLog.create({
            data: {
                action,
                resource,
                allowed,
                userId,
                organizationId,
                resourceId,
                context,
            },
        });
    },
    getAccessAuditLogs: async (filter: AccessAuditLogFilter, organizationId?: string) => {
        const where: any = { organizationId };

        if (filter.userId) {
            where.userId = filter.userId;
        }
        if (filter.action) {
            where.action = filter.action;
        }
        if (filter.resource) {
            where.resource = filter.resource;
        }
        if (typeof filter.allowed === 'boolean') {
            where.allowed = filter.allowed;
        }
        if (filter.fromDate || filter.toDate) {
            where.createdAt = {};
            if (filter.fromDate) {
                where.createdAt.gte = filter.fromDate;
            }
            if (filter.toDate) {
                where.createdAt.lte = filter.toDate;
            }
        }

        if (filter.limit) {
            where.take = Math.min(filter.limit, 100);
        }

        if (filter.offset) {
            where.skip = filter.offset;
        }

        return await fastify.prisma.accessAuditLog.findMany({
            where,
            orderBy: { createdAt: filter.createdAtOrder ?? 'desc' },
        });
    },
});
