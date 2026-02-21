/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_id_fkey";

-- DropTable
DROP TABLE "Token";

-- CreateTable
CREATE TABLE "Tokens" (
    "id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
