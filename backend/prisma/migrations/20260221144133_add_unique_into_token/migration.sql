/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tokens_id_key" ON "Tokens"("id");
