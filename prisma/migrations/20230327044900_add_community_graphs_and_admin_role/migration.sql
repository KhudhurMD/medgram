/*
  Warnings:

  - You are about to drop the `ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "ticket";

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "type" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityGraph" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "graphData" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "graphId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "CommunityGraph_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunityGraph" ADD CONSTRAINT "CommunityGraph_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityGraph" ADD CONSTRAINT "CommunityGraph_graphId_fkey" FOREIGN KEY ("graphId") REFERENCES "Graph"("id") ON DELETE CASCADE ON UPDATE CASCADE;
