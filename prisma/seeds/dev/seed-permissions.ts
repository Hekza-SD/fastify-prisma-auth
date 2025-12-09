import { PrismaClient } from '../../../src/generated/prisma/client';
import { PermissionAction } from '../../../src/modules/authz/permission-action';
import { PermissionResource } from '../../../src/modules/authz/permission-resource';
import { PermissionScope } from '../../../src/modules/authz/permission-scope';

export const globalOrganizationPermissions: {
    action: PermissionAction;
    resource: PermissionResource;
    scope: PermissionScope;
}[] = [
    {
        action: PermissionAction.BYPASS,
        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
        scope: PermissionScope.GLOBAL,
    },
    {
        action: PermissionAction.BYPASS,
        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
        scope: PermissionScope.GLOBAL,
    },
];

export const organizationPermissions: {
    action: PermissionAction;
    resource: PermissionResource;
    scope: PermissionScope;
}[] = [
    {
        action: PermissionAction.READ,
        resource: PermissionResource.PERMISSIONS,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.READ,
        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.CREATE,
        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.DELETE,
        resource: PermissionResource.ORGANIZATION_MEMBERSHIP,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.DELETE,
        resource: PermissionResource.ORGANIZATION_ROLES,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.READ,
        resource: PermissionResource.PERMISSIONS,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.READ,
        resource: PermissionResource.ORGANIZATION_ROLES,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.UPDATE,
        resource: PermissionResource.ORGANIZATION_ROLES,
        scope: PermissionScope.ORGANIZATION,
    },
    {
        action: PermissionAction.READ,
        resource: PermissionResource.ACCESS_AUDIT_LOGS,
        scope: PermissionScope.ORGANIZATION,
    },
];

export async function seedPermissions(prisma: PrismaClient) {
    console.log('Seeding permissions...');
    for (const { action, resource, scope } of globalOrganizationPermissions) {
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

    for (const { action, resource, scope } of organizationPermissions) {
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
