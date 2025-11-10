import { Controller, Query, Post, Get, Body, Put } from "@nestjs/common";
import { SubmissionService } from "./submission.service";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";
import { EvaluateSubmissionDto } from "./dto/evaluate-submission.dto";
import { submissionReponseDto } from "./dto/submission-reponse.dto";
import { SupabaseDecodedUser } from "src/common/decorators/supabase-decoded-user.types";
import { SupabaseUser } from "src/common/decorators/supabase-user.decorator";

@Controller("submission")
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(
    @Body() submission: CreateSubmissionDto,
  ): Promise<submissionReponseDto> {
    return this.submissionService.createsubmission(submission.teamId);
  }

  @Get()
  async find(
    @Query() submission: CreateSubmissionDto,
  ): Promise<submissionReponseDto[]> {
    return this.submissionService.getsubmissions(submission.teamId);
  }

  @Get("due-date")
  async getDueDate(): Promise<Date> {
    return this.submissionService.getDueDate();
  }

  @Put()
  async update(
    @Body() submission: UpdateSubmissionDto,
  ): Promise<submissionReponseDto> {
    return this.submissionService.updatesubmission(submission);
  }

  @Post("evaluate")
  async evaluate(
    @Body() evaluation: EvaluateSubmissionDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ): Promise<submissionReponseDto> {
    return this.submissionService.evaluatesubmission(
      evaluation,
      supabaseUser.sub,
    );
  }
}
