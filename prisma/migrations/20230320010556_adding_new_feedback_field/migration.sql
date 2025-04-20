/*
  Warnings:

  - The primary key for the `WishlistEmails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `WishlistEmails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WishlistEmails" DROP CONSTRAINT "WishlistEmails_pkey";

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WishlistEmails_email_key" ON "WishlistEmails"("email");
