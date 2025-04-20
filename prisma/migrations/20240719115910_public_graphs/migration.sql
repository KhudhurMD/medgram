-- CreateTable
CREATE TABLE "PublicGraph" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "editUrl" TEXT,
    "viewUrl" TEXT,
    "authorName" TEXT NOT NULL,
    "authorUrl" TEXT,

    CONSTRAINT "PublicGraph_pkey" PRIMARY KEY ("id")
);
