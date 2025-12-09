-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");
