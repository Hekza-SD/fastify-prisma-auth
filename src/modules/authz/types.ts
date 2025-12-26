import type { RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput } from '../../generated/prisma/models';
import type { PermissionAction } from './permission-action';
import type { PermissionResource } from './permission-resource';

export interface AuthzModuleOptions {
    prefix?: string;
    adminPrefix?: string;
}

export type AuthContext = {
    userId?: string;
    organizationId?: string | null;
    resourceId?: string | null;
    [key: string]: any;
};

export type PermissionEntry = {
    action: string;
    resource?: string | null;
    policy?: any | null; // JSONLogic
};

export type EvaluatedPermission = PermissionEntry & {
    roleId: string;
    organizationId?: string | null;
};

export type AccessAuditLogFilter = {
    userId?: string;
    action?: PermissionAction;
    resource?: PermissionResource;
    allowed?: boolean;
    fromDate?: string | Date;
    toDate?: string | Date;
    createdAtOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
};
