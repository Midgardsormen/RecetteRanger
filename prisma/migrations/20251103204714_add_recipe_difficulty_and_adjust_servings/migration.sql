-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('très facile', 'facile', 'moyen', 'difficile');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "difficulty" "RecipeDifficulty" NOT NULL DEFAULT 'moyen',
ALTER COLUMN "servings" SET DEFAULT 1;
