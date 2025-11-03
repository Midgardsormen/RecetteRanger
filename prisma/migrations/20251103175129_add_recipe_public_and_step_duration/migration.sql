-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "durationMinutes" INTEGER DEFAULT 0;
