-- AlterEnum
ALTER TYPE "authz"."PermissionAction" ADD VALUE 'BYPASS';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "authz"."PermissionResource" ADD VALUE 'PERMISSIONS';
ALTER TYPE "authz"."PermissionResource" ADD VALUE 'ORGANIZATION_ROLES';
ALTER TYPE "authz"."PermissionResource" ADD VALUE 'ACTIVE_ORGANIZATION';
