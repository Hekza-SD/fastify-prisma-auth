import { Organization, PrismaClient } from '../../../src/generated/prisma/client';
import { config } from '../../../src/config/index';

export const GLOBAL_ORG_ID = config.GLOBAL_ORGANIZATION_ID;
export const GLOBAL_ORG_SLUG = config.GLOBAL_ORGANANIZATION_SLUG;
export const GLOBAL_ORG_NAME = config.GLOBAL_ORG_NAME;

const organizations: Omit<Organization, 'createdAt' | 'updatedAt'>[] = [
    {
        id: GLOBAL_ORG_ID,
        slug: GLOBAL_ORG_SLUG,
        name: GLOBAL_ORG_NAME,
    },
    {
        id: '11111111-1111-1111-1111-111111111111',
        slug: 'dev-org',
        name: 'Development Organization',
    },
];

export async function seedOrganizations(prisma: PrismaClient) {
    console.log('Seeding organizations...');

    for (const org of organizations) {
        await prisma.organization.upsert({
            where: { id: org.id },
            update: {},
            create: org,
        });
    }

    console.log('Organizations seeded.');
}
