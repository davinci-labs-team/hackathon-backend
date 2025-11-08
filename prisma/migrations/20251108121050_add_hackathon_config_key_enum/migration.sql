/*
  Warnings:

  - A unique constraint covering the columns `[key2]` on the table `HackathonConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "HackathonConfigKey" AS ENUM ('LEGAL', 'MEDIA', 'TEXTS', 'PHASES', 'PARTNERS', 'MATCHMAKING', 'THEMES');

-- AlterTable
ALTER TABLE "HackathonConfig" ADD COLUMN     "key2" "HackathonConfigKey";

-- CreateIndex
CREATE UNIQUE INDEX "HackathonConfig_key2_key" ON "HackathonConfig"("key2");
