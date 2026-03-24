/*
  Warnings:

  - Added the required column `root_id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "path" DROP DEFAULT,
DROP COLUMN "root_id",
ADD COLUMN     "root_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "categories_root_id_idx" ON "categories"("root_id");
