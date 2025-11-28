import { PrismaClient } from '../../../src/generated/prisma/client';
import { PermissionAction } from '../../../src/modules/authz/permission-action';
import { PermissionResource } from '../../../src/modules/authz/permission-resource';
import { PermissionScope } from '../../../src/modules/authz/permission-scope';

const permissions = () => {
    const perms = [];
    for (const actionKey in PermissionAction) {
        const action = PermissionAction[actionKey as keyof typeof PermissionAction];
        for (const resourceKey in PermissionResource) {
            const resource = PermissionResource[resourceKey as keyof typeof PermissionResource];
            for (const scopeKey in PermissionScope) {
                const scope = PermissionScope[scopeKey as keyof typeof PermissionScope];
                perms.push({ action, resource, scope });
            }
        }
    }
    return perms;
};

export async function seedPermissions(prisma: PrismaClient) {
    console.log('Seeding permissions...');
    for (const { action, resource, scope } of permissions()) {
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
