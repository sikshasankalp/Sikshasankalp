ALTER TABLE "TeamMember" ADD COLUMN "responsibilities" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN "expertise" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN "department" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
