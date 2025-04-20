/*
  Warnings:

  - You are about to drop the column `userId` on the `CommunityGraph` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityGraph" DROP CONSTRAINT "CommunityGraph_userId_fkey";

-- AlterTable
ALTER TABLE "CommunityGraph" DROP COLUMN "userId";
