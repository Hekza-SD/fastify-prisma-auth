import { PrismaClient, Role } from '../../../src/generated/prisma/client';
import { GLOBAL_ORG_ID } from './seed-organization';

const roles: Omit<Role, 'id' | 'createdAt'>[] = [
    {
        name: 'ADMIN',
        description: 'Administrator with full access',
        organizationId: GLOBAL_ORG_ID,
    },
    {
        name: 'MODERATOR',
        description: 'Moderator with elevated access',
        organizationId: GLOBAL_ORG_ID,
    },
    {
        name: 'USER',
        description: 'Regular user with limited access',
        organizationId: GLOBAL_ORG_ID,
    },
];

export async function seedRoles(prisma: PrismaClient) {
    console.log('Seeding roles...');
    if ((await prisma.organization.findUnique({ where: { id: GLOBAL_ORG_ID } })) === null) {
        console.error(
            `Unable to seed roles: a global organization with ID ${GLOBAL_ORG_ID} does not exist. Please seed organizations first.`
        );
        return;
    }

    for (const roleData of roles) {
        await prisma.role.upsert({
            where: {
                name_organizationId: {
                    name: roleData.name,
                    organizationId: roleData.organizationId,
                },
            },
            update: {},
            create: roleData,
        });
    }
    console.log('Roles seeded.');
}
