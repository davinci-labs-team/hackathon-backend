/*
  Warnings:

  - You are about to drop the column `images` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "images",
ADD COLUMN     "files" JSONB;
