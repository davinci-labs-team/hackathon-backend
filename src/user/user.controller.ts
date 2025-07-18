import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseGuard } from '../supabase';
import { ApiCreateUser } from './api-responses.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  @ApiCreateUser()
   async create(@Body() createUserDto: CreateUserDto, @Req() req) {
      // Extract the Supabase user ID from the authenticated user
      const supabaseUserId = req.user.sub;
      
      // Check if user already exists
      // const existingUser = await this.userService.findBySupabaseId(supabaseUserId);
      // if (existingUser) {
      //     throw new ForbiddenException('User already exists');
      // }
      
      return this.userService.create(createUserDto, supabaseUserId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/protected')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  async protected(@Req() req) {
    return {
      "message": "AuthGuard works 🎉",
      "authenticated_user": req.user
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
