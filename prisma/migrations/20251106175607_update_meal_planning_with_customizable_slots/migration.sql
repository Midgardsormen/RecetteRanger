-- DropIndex
DROP INDEX "public"."MealPlanItem_dayId_slot_key";

-- AlterTable
ALTER TABLE "MealPlanItem" ADD COLUMN     "customSlotName" TEXT,
ADD COLUMN     "isExceptional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MealSlotConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slot" "MealSlot" NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealSlotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MealSlotConfig_userId_idx" ON "MealSlotConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MealSlotConfig_userId_slot_key" ON "MealSlotConfig"("userId", "slot");

-- CreateIndex
CREATE INDEX "MealPlanItem_dayId_slot_idx" ON "MealPlanItem"("dayId", "slot");

-- AddForeignKey
ALTER TABLE "MealSlotConfig" ADD CONSTRAINT "MealSlotConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
