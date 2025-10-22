-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('SUBMITTED', 'PENDING', 'EVALUATED', 'NOT_EVALUATED');

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "files" TEXT[],
    "depositStatus" "DepositStatus" NOT NULL,
    "evaluationStatus" "DepositStatus" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,
    "submittedAt" TIMESTAMP(3),
    "feedback" TEXT,
    "grade" INTEGER,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_teamId_key" ON "Deposit"("teamId");
