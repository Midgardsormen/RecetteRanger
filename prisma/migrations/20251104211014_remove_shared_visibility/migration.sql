-- AlterEnum
-- This migration removes the SHARED value from the RecipeVisibility enum
-- First, we need to update any existing recipes that use SHARED to PRIVATE
UPDATE "Recipe" SET "visibility" = 'PRIVATE' WHERE "visibility" = 'SHARED';

-- Then we can safely remove SHARED from the enum
ALTER TYPE "RecipeVisibility" RENAME TO "RecipeVisibility_old";
CREATE TYPE "RecipeVisibility" AS ENUM ('PRIVATE', 'PUBLIC');
ALTER TABLE "Recipe" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Recipe" ALTER COLUMN "visibility" TYPE "RecipeVisibility" USING ("visibility"::text::"RecipeVisibility");
ALTER TABLE "Recipe" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';
DROP TYPE "RecipeVisibility_old";
