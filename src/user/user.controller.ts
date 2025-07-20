import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { SupabaseGuard } from "../supabase";
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiGetAllUsers,
  ApiGetUserById,
  ApiUpdateUser,
} from "./api-responses.decorator";
import { UUID } from "crypto";
import { RequestWithUser } from "src/common/interfaces/request-with-user";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto, @Req() req: RequestWithUser) {
    // Extract the Supabase user ID from the authenticated user
    const supabaseUserId = req.user.sub;

    return this.userService.create(createUserDto, supabaseUserId);
  }

  @Get()
  @ApiGetAllUsers()
  findAll() {
    return this.userService.findAll();
  }

  @Get("/protected")
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  protected(@Req() req: RequestWithUser) {
    return {
      message: "AuthGuard works 🎉",
      authenticated_user: req.user,
    };
  }

  @Get(":userId")
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  @ApiGetUserById()
  findOne(@Param("userId") userId: UUID, @Req() req: RequestWithUser) {
    const supabaseUserId = req.user.sub;

    return this.userService.findOne(userId, supabaseUserId);
  }

  @Patch(":userId")
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  @ApiUpdateUser()
  update(
    @Param("userId") userId: UUID,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser
  ) {
    const supabaseUserId = req.user.sub;

    return this.userService.update(userId, updateUserDto, supabaseUserId);
  }

  @Delete(":userId")
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth("supabase_token")
  @ApiDeleteUser()
  remove(@Param("userId") userId: UUID, @Req() req: RequestWithUser) {
    const supabaseUserId = req.user.sub;

    return this.userService.remove(userId, supabaseUserId);
  }
}
