/*
  Warnings:

  - Added the required column `organizationId` to the `AccessAuditLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `AccessAuditLog` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `action` on the `AccessAuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `resource` to the `AccessAuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "authz"."PermissionResource" ADD VALUE 'ACCESS_AUDIT_LOGS';

-- DropForeignKey
ALTER TABLE "audit"."AccessAuditLog" DROP CONSTRAINT "AccessAuditLog_userId_fkey";

-- AlterTable
ALTER TABLE "audit"."AccessAuditLog" ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "authz"."PermissionAction" NOT NULL,
DROP COLUMN "resource",
ADD COLUMN     "resource" "authz"."PermissionResource" NOT NULL;

-- AddForeignKey
ALTER TABLE "audit"."AccessAuditLog" ADD CONSTRAINT "AccessAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."AccessAuditLog" ADD CONSTRAINT "AccessAuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "authz"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
