/*
  Warnings:

  - Made the column `key` on table `HackathonConfig` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HackathonConfig" ALTER COLUMN "key" SET NOT NULL;
