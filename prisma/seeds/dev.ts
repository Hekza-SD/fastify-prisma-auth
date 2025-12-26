import { seedPermissions } from './dev/seed-permissions';
import { PrismaClient } from '../../src/generated/prisma/client';
import { seedRoles } from './dev/seed-roles';
import { seedOrganizations } from './dev/seed-organization';
import { seedRolePermissions } from './dev/seed-role-permissions';

export async function seedDev(prisma: PrismaClient) {
    await seedPermissions(prisma);
    await seedOrganizations(prisma);
    await seedRoles(prisma);
    await seedRolePermissions(prisma);
}
