-- CreateTable
CREATE TABLE "Announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],
    "description" TEXT NOT NULL,
    "imageUrl" TEXT[],

    CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id")
);
