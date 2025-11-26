-- CreateTable
CREATE TABLE "authz"."user_active_organization" (
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "user_active_organization_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_active_organization_userId_organizationId_key" ON "authz"."user_active_organization"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "authz"."user_active_organization" ADD CONSTRAINT "user_active_organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authz"."user_active_organization" ADD CONSTRAINT "user_active_organization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "authz"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
