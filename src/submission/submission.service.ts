import { Injectable, NotFoundException } from "@nestjs/common";
import { SubmissionStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";
import { EvaluateSubmissionDto } from "./dto/evaluate-submission.dto";

// Define the Phase interface
interface Phase {
  order: number;
  endDate: string;
  [key: string]: unknown;
}

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

  async getDueDate(): Promise<Date> {
    const hackathonConfig = await this.prisma.hackathonConfig.findFirst({
      where: { key: "phases" },
    });

    if (!hackathonConfig) {
      throw new Error("Hackathon configuration not found");
    }

    const rawValue = hackathonConfig.value;
    let phases: Phase[];

    if (typeof rawValue === "string") {
      phases = JSON.parse(rawValue) as Phase[];
    } else if (Array.isArray(rawValue)) {
      phases = rawValue as Phase[];
    } else {
      throw new Error("Invalid format for hackathonConfig.value");
    }

    const phase3 = phases.find(phase => phase.order === 3);

    if (!phase3?.endDate) {
      throw new Error("Phase 3 endDate not found");
    }

    const dueDate = new Date(phase3.endDate);
    return dueDate;
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
