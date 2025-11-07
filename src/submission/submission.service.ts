import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { EvaluateSubmissionDto } from './dto/evaluate-submission.dto';

@Injectable()
export class SubmissionService {
    constructor(private readonly prisma: PrismaService) {}

    async createsubmission(teamId: string) {
        return this.prisma.submission.create({
            data: {
                teamId,
                grade: null,
                status: SubmissionStatus.NOT_SUBMITTED,
                submissionFilePath: null,
            },
        });
    }

    async getsubmissions(teamId: string) {
        return this.prisma.submission.findMany({
            where: { teamId },
        });
    }

    async updatesubmission(submission: UpdateSubmissionDto) {
        return this.prisma.submission.update({
            where: { teamId: submission.teamId },
            data: {
                submissionFilePath: submission.submissionFilePath,
                status: SubmissionStatus.PENDING,
            },
        });
    }

    async evaluatesubmission(evaluation: EvaluateSubmissionDto, supabaseJuryId: string) {
        const user = await this.prisma.user.findUnique({
            where: { supabaseUserId: supabaseJuryId },
        });
        if (!user) {
            throw new NotFoundException(`Jury with supabaseUserId ${supabaseJuryId} not found`);
        }
        const juryId = user.id;

        await this.prisma.evaluation.create({
            data: {
                juryId,
                submissionId: evaluation.submissionId,
                grade: evaluation.grade,
                comment: evaluation.comment,
                evaluationFilePath: evaluation.evaluationFilePath,
            },
        });

        const all_evaluations = await this.prisma.evaluation.findMany({
            where: { submissionId: evaluation.submissionId },
        });

        const total_grade = all_evaluations.reduce((sum, evalItem) => sum + evalItem.grade, 0);
        const average_grade = Math.round(total_grade / all_evaluations.length);

        return this.prisma.submission.update({
            where: { id: evaluation.submissionId },
            data: {
                grade: average_grade,
                status: SubmissionStatus.GRADED,
            },
        });

    }
}
