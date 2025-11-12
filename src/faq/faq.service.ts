import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { UUID } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { FaqResponse } from "./dto/faq-response";
import { Role } from "@prisma/client";

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createFaqDto: CreateFaqDto,
    supabaseUserId: string,
  ): Promise<FaqResponse> {
    await this.validateUserRole(supabaseUserId);

    return await this.prisma.faq.create({
      data: {
        question: createFaqDto.question,
        answer: createFaqDto.answer,
        isPrivate: createFaqDto.isPrivate,
      },
    });
  }

  async findAll(): Promise<FaqResponse[]> {
    return await this.prisma.faq.findMany();
  }

  async findOne(id: UUID): Promise<FaqResponse> {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return faq;
  }

  async update(
    id: UUID,
    updateFaqDto: UpdateFaqDto,
    supabaseUserId: string,
  ): Promise<FaqResponse> {
    await this.validateUserRole(supabaseUserId);

    // Check if the FAQ exists
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return await this.prisma.faq.update({
      where: { id },
      data: {
        question: updateFaqDto.question,
        answer: updateFaqDto.answer,
        isPrivate: updateFaqDto.isPrivate,
      },
    });
  }

  async remove(id: UUID, supabaseUserId: string): Promise<FaqResponse> {
    await this.validateUserRole(supabaseUserId);

    // Check if the FAQ exists
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return await this.prisma.faq.delete({
      where: { id },
    });
  }

  private async validateUserRole(supabaseUserId: string) {
    const existUser = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (!existUser) {
      throw new NotFoundException("User not found.");
    }
    if (existUser?.role !== Role.ORGANIZER) {
      throw new ForbiddenException("Only organizer can create FAQs.");
    }
  }
}
