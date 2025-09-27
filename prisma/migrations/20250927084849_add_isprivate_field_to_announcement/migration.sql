/*
  Warnings:

  - Made the column `title` on table `Announcement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Announcement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL;
