/*
  Warnings:

  - You are about to drop the `feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "feedback";

-- CreateTable
CREATE TABLE "ticket" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "type" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);
