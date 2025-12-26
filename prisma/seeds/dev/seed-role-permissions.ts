import { PrismaClient, Role } from '../../../src/generated/prisma/client';
import { GLOBAL_ORG_ID } from './seed-organization';

export async function seedRolePermissions(prisma: PrismaClient) {
    console.log('Seeding role permissions...');
    if (
        (await prisma.role.findUnique({
            where: {
                name_organizationId: {
                    organizationId: GLOBAL_ORG_ID,
                    name: 'ADMIN',
                },
            },
        })) === null
    ) {
        console.error(
            `Unable to seed role permissions: Admin role does not exist in the global organization. Please run the organization and role seed scripts first.`
        );
        return;
    }

    //Give Admin role all permissions

    const adminRole = (await prisma.role.findUniqueOrThrow({
        where: {
            name_organizationId: {
                organizationId: GLOBAL_ORG_ID,
                name: 'ADMIN',
            },
        },
    })) as Role;

    const allPermissions = await prisma.permission.findMany();

    for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: permission.id,
            },
        });
    }

    console.log('Role permissions seeded.');
}
