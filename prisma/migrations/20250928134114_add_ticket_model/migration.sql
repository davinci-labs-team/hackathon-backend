-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "emitter_platform_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "channel_id" TEXT NOT NULL,
    "user_discord_id" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
