import { Controller, Query, Post, Get, Body, Put } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { Public } from "../common/decorators/public.decorator";
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { EvaluateDepositDto } from './dto/evaluate-deposit.dto';

@Controller('deposit')
export class DepositController {
    constructor(private readonly depositService: DepositService) {}

    @Post()
    @Public()
    async create(@Body() deposit: CreateDepositDto){
        return this.depositService.createDeposit(deposit.teamId);
    }

    @Get()
    @Public()
    async findAll(@Query() deposit: CreateDepositDto){
        return this.depositService.getDeposits(deposit.teamId);
    }

    @Put()
    @Public()
    async update(@Body() deposit: UpdateDepositDto) {
        return this.depositService.updateDeposit(deposit);
    }

    @Post('evaluate')
    @Public()
    async evaluate(@Body() evaluation: EvaluateDepositDto) {
        return this.depositService.evaluateDeposit(evaluation);
    }
}
