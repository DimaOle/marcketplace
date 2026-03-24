-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "path" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "root_id" TEXT;

-- CreateIndex
CREATE INDEX "categories_path_idx" ON "categories"("path");

-- CreateIndex
CREATE INDEX "categories_root_id_idx" ON "categories"("root_id");
