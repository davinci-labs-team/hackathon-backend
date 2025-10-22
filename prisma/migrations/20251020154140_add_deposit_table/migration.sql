-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('SUBMITTED', 'PENDING', 'EVALUATED');

-- CreateTable
CREATE TABLE "Deposit" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "files" TEXT[],
    "depositStatus" "DepositStatus" NOT NULL,
    "evaluationStatus" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT,
    "grade" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "reviewerId" TEXT,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);
