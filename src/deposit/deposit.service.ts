import { Injectable } from '@nestjs/common';
import { DepositStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { EvaluateDepositDto } from './dto/evaluate-deposit.dto';

@Injectable()
export class DepositService {
    constructor(private readonly prisma: PrismaService) {}

    async createDeposit(teamId: string) {
        const hackathonConfig = await this.prisma.hackathonConfig.findFirst(
            { where: { key: "phases" } }
        );
        if (!hackathonConfig) {
            throw new Error("Hackathon configuration not found");
        }

        const rawValue = hackathonConfig.value;

        let phases: any[];

        if (typeof rawValue === "string") {
            phases = JSON.parse(rawValue);
        } else if (Array.isArray(rawValue)) {
            phases = rawValue;
        } else {
            throw new Error("Invalid format for hackathonConfig.value");
        }
        const phase3 = phases.find((phase) => phase.order === 3);

        if (!phase3?.endDate) {
            throw new Error("Phase 3 endDate not found");
        }

        const dueDate = new Date(phase3.endDate);

        return this.prisma.deposit.create({
            data: {
                teamId,
                files: [],
                depositStatus: DepositStatus.PENDING,
                evaluationStatus: DepositStatus.NOT_EVALUATED,
                dueDate,
                comments: null,
                submittedAt: null,
                feedback: null,
                grade: null,
                reviewedAt: null,
            },
        });
    }

    async getDeposits(teamId: string) {
        return this.prisma.deposit.findMany({
            where: { teamId },
        });
    }

    async updateDeposit(deposit: UpdateDepositDto) {
        return this.prisma.deposit.update({
            where: { teamId: deposit.teamId },
            data: {
                files: deposit.files,
                depositStatus: deposit.depositStatus,
                comments: deposit.comments,
                submittedAt: new Date(),
            },
        });
    }

    async evaluateDeposit(evaluation: EvaluateDepositDto) {
        return this.prisma.deposit.update({
            where: { teamId: evaluation.teamId },
            data: {
                feedback: evaluation.feedback,
                grade: evaluation.grade,
                evaluationStatus: DepositStatus.EVALUATED,
                reviewedAt: new Date(),
            },
        });
    }
}
