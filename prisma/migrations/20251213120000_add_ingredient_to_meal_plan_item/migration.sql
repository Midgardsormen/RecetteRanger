-- AlterTable
ALTER TABLE "MealPlanItem" ADD COLUMN "ingredientId" TEXT,
ADD COLUMN "quantity" DECIMAL(10,3),
ADD COLUMN "unit" TEXT;

-- CreateIndex
CREATE INDEX "MealPlanItem_ingredientId_idx" ON "MealPlanItem"("ingredientId");

-- AddForeignKey
ALTER TABLE "MealPlanItem" ADD CONSTRAINT "MealPlanItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
