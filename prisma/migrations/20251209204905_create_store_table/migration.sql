-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" VARCHAR(2048),
    "color" TEXT DEFAULT '#667eea',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "Store"("name");

-- CreateIndex
CREATE INDEX "Store_name_idx" ON "Store"("name");

-- AlterTable ShoppingListItem to add storeId column if migration hasn't been applied yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='ShoppingListItem'
    AND column_name='storeId'
  ) THEN
    ALTER TABLE "ShoppingListItem" ADD COLUMN "storeId" TEXT;
    CREATE INDEX "ShoppingListItem_storeId_idx" ON "ShoppingListItem"("storeId");
    ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
