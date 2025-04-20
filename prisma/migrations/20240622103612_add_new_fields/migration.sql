-- AlterTable
ALTER TABLE "Graph" ADD COLUMN     "anonymousId" TEXT,
ADD COLUMN     "editorVersion" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "userId" DROP NOT NULL;
