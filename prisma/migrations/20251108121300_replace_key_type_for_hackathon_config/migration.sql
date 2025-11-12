/*
  Warnings:

  - You are about to drop the column `key2` on the `HackathonConfig` table. All the data in the column will be lost.
  - The `key` column on the `HackathonConfig` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "HackathonConfig_key2_key";

-- AlterTable
ALTER TABLE "HackathonConfig" DROP COLUMN "key2",
DROP COLUMN "key",
ADD COLUMN     "key" "HackathonConfigKey";

-- CreateIndex
CREATE UNIQUE INDEX "HackathonConfig_key_key" ON "HackathonConfig"("key");
