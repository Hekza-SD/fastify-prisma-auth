import { PrismaClient } from '../../../src/generated/prisma/client';
import { PermissionAction } from '../../../src/modules/authz/permission-action';
import { PermissionResource } from '../../../src/modules/authz/permission-resource';
import { PermissionScope } from '../../../src/modules/authz/permission-scope';

const permissions = [
    {
        action: PermissionAction.READ,
        resource: PermissionResource.PERMISSION,
        scope: PermissionScope.GLOBAL,
    },
    {
        action: PermissionAction.READ,
        resource: PermissionResource.USER,
        scope: PermissionScope.ORGANIZATION,
    },
];

export async function seedPermissions(prisma: PrismaClient) {
    console.log('Seeding permissions...');
    for (const { action, resource, scope } of permissions) {
        await prisma.permission.upsert({
            where: { action_resource: { action, resource } },
            update: {},
            create: {
                action: action,
                resource: resource,
                scope: scope,
            },
        });
    }
    console.log('Permissions seeded.');
}
