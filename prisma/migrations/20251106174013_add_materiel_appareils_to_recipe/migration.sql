-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "appareils" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "materiel" TEXT[] DEFAULT ARRAY[]::TEXT[];
