import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { UUID } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { FaqResponse } from "./dto/faq-response";

@Injectable()
export class FaqService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createFaqDto: CreateFaqDto): Promise<FaqResponse> {
        return await this.prisma.faq.create({
            data: {
                question: createFaqDto.question,
                answer: createFaqDto.answer,
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

    async update(id: UUID, updateFaqDto: UpdateFaqDto): Promise<FaqResponse> {
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
            },
        });
    }

    async remove(id: UUID): Promise<FaqResponse> {
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
}
