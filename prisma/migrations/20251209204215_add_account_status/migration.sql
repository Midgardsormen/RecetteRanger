-- CreateEnum (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountStatus') THEN
    CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END$$;

-- AlterTable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='User'
    AND column_name='accountStatus'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING';
  END IF;
END$$;

-- CreateIndex
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'User'
    AND indexname = 'User_accountStatus_idx'
  ) THEN
    CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");
  END IF;
END$$;
