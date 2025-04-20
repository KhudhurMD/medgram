/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "WishlistEmails" (
    "email" TEXT NOT NULL,
    "isAdded" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "WishlistEmails_email_key" ON "WishlistEmails"("email");
