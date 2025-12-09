import type { FastifyInstance } from 'fastify';
import { PermissionAction } from '../permission-action';
import { PermissionResource } from '../permission-resource';
import type { AccessAuditLogFilter } from '../types';
import {
    searchAccessAuditLogsRequestQuerySchema,
    searchAccessAuditLogsResponseSchema200,
    type SearchAccessAuditLogsReply,
    type SearchAccessAuditLogsRequestQuery,
} from '../dto/access-audit-log/search.dto';
import { UnauthorizedError } from '../../../errors/unauthorized-error';

/**
 * APIs registered
 * GET /audit/role-changes
 * GET /audit/permission-changes
 * GET /audit/organization-activity
 */

export async function accessAuditLogRoutes(fastify: FastifyInstance) {
    fastify.get<{
        Querystring: SearchAccessAuditLogsRequestQuery;
        Reply: SearchAccessAuditLogsReply;
    }>(
        '/audit/access-logs',
        {
            schema: {
                querystring: searchAccessAuditLogsRequestQuerySchema,
                response: {
                    200: searchAccessAuditLogsResponseSchema200,
                },
            },
            preHandler: [
                fastify.requireAuth,
                fastify.authz.userCan([
                    {
                        action: PermissionAction.READ,
                        resource: PermissionResource.ACCESS_AUDIT_LOGS,
                    },
                ]),
            ],
        },
        async (request, reply) => {
            const filter = request.query;

            const userId = request.session?.user.id;
            if (!userId) {
                throw new UnauthorizedError('Unauthenticated');
            }
            const activeOrganizationId =
                request.activeOrganizationId ??
                (
                    await fastify.authz.organizationMemberships.getActiveOrganizationForUserOrThrow(
                        userId
                    )
                ).id;

            const logs = await fastify.authz.accessAuditLogs.getAccessAuditLogs(
                filter,
                activeOrganizationId
            );

            return reply.code(200).sendWithDates(logs);
        }
    );
}
