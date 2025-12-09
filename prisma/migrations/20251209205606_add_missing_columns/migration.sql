-- Add missing columns with conditional checks to avoid errors if they already exist

-- Add sourceUrl to Recipe table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='Recipe'
    AND column_name='sourceUrl'
  ) THEN
    ALTER TABLE "Recipe" ADD COLUMN "sourceUrl" VARCHAR(2048);
  END IF;
END$$;

-- Add isFood to Ingredient table (Article)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='Ingredient'
    AND column_name='isFood'
  ) THEN
    ALTER TABLE "Ingredient" ADD COLUMN "isFood" BOOLEAN NOT NULL DEFAULT true;
    CREATE INDEX "Ingredient_isFood_idx" ON "Ingredient"("isFood");
  END IF;
END$$;
