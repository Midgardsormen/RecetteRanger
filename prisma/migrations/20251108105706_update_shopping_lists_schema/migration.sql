-- Step 1: Add new enum values (must be in separate transaction from usage)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ShoppingListStatus') THEN
    CREATE TYPE "ShoppingListStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
  ELSE
    -- Add new values if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'ShoppingListStatus' AND e.enumlabel = 'DRAFT') THEN
      ALTER TYPE "ShoppingListStatus" ADD VALUE 'DRAFT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'ShoppingListStatus' AND e.enumlabel = 'IN_PROGRESS') THEN
      ALTER TYPE "ShoppingListStatus" ADD VALUE 'IN_PROGRESS';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'ShoppingListStatus' AND e.enumlabel = 'COMPLETED') THEN
      ALTER TYPE "ShoppingListStatus" ADD VALUE 'COMPLETED';
    END IF;
  END IF;
END$$;
