/*
  Warnings:

  - The `discord` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `github` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "discord",
ADD COLUMN     "discord" JSONB,
DROP COLUMN "github",
ADD COLUMN     "github" JSONB;
