import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { FaqService } from "./faq.service";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { UUID } from "crypto";
import { SupabaseUser } from "src/common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "src/common/decorators/supabase-decoded-user.types";
import { Public } from "src/common/decorators/public.decorator";

@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @Post()
    async create(@Body() createFaqDto: CreateFaqDto, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
        return this.faqService.create(createFaqDto, supabaseUser.sub);
    }

    @Get()
    @Public()
    findAll() {
        return this.faqService.findAll();
    }

    @Get(':faqId')
    findOne(@Param('faqId') faqId: UUID) {
        return this.faqService.findOne(faqId);
    }

    @Patch(':faqId')
    update(@Param('faqId') faqId: UUID, @Body() updateFaqDto: UpdateFaqDto, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
        return this.faqService.update(faqId, updateFaqDto, supabaseUser.sub);
    }

    @Delete(':faqId')
    remove(@Param('faqId') faqId: UUID, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
        return this.faqService.remove(faqId, supabaseUser.sub);
    }
}
