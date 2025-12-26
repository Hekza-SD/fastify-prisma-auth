import { seedDev } from './seeds/dev';
import { seedProd } from './seeds/prod';
import { seedBase } from './seeds/base';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../src/config/index';

const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');

    await seedBase(prisma);

    if (process.env.NODE_ENV?.includes('prod')) {
        await seedProd(prisma);
    } else {
        await seedDev(prisma);
    }

    console.log('Seeding complete.');
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
