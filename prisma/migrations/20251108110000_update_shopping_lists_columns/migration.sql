-- Step 2: Alter tables (after enum values are committed)

-- AlterTable: Rename title to name in ShoppingList
ALTER TABLE "ShoppingList" RENAME COLUMN "title" TO "name";

-- AlterTable: Update ShoppingList status default
ALTER TABLE "ShoppingList" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable: Update ShoppingListItem - rename fromPlan to isManual and add mealPlanItemIds
ALTER TABLE "ShoppingListItem"
  DROP COLUMN IF EXISTS "fromPlan";

ALTER TABLE "ShoppingListItem"
  ADD COLUMN IF NOT EXISTS "isManual" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ShoppingListItem"
  ADD COLUMN IF NOT EXISTS "mealPlanItemIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "ShoppingListItem"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "ShoppingListItem"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ShoppingList_status_idx" ON "ShoppingList"("status");
CREATE INDEX IF NOT EXISTS "ShoppingListItem_listId_idx" ON "ShoppingListItem"("listId");
CREATE INDEX IF NOT EXISTS "ShoppingListItem_ingredientId_idx" ON "ShoppingListItem"("ingredientId");
