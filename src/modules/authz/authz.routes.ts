import type { FastifyInstance } from 'fastify';
import { permissionsRoutes } from './routes/permissions.routes';
import { rolesRoutes } from './routes/roles.routes';
import { organizationRoutes } from './routes/organization.routes';
import { accessAuditLogRoutes } from './routes/access-audit-log.routes';

export default async function authzRoutes(fastify: FastifyInstance) {
    await permissionsRoutes(fastify);
    await rolesRoutes(fastify);
    await organizationRoutes(fastify);
    await accessAuditLogRoutes(fastify);
}
