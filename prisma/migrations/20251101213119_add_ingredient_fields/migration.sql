/*
  Warnings:

  - Added the required column `updatedAt` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('pincée', 'g', 'kg', 'mg', 'l', 'ml', 'cl', 'cuillère à café', 'cuillère à soupe', 'tasse', 'verre', 'bol', 'unité', 'tranche', 'morceau', 'branche', 'feuille', 'bouquet', 'botte', 'gousse', 'zeste', 'sachet', 'boîte', 'paquet', 'pot', 'barquette');

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "imageUrl" VARCHAR(2048),
ADD COLUMN     "seasonMonths" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "units" "Unit"[] DEFAULT ARRAY[]::"Unit"[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Ingredient_usageCount_idx" ON "Ingredient"("usageCount");
