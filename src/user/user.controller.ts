import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UUID } from "crypto";
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    return this.userService.create(createUserDto, supabaseUser.sub);
  }

  @Post("login")
  async login(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.userService.login(supabaseUser.sub);
  }

  @Post("invite/:userId")
  async invite(@Param("userId") userId: UUID, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.userService.invite(userId, supabaseUser.sub);
  }

  @Public()
  @Post("requestPasswordReset")
  async requestPasswordReset(@Body() requestPasswordReset: RequestPasswordResetDto) {
    return this.userService.requestPasswordReset(requestPasswordReset.email);
  }

  @Public()
  @Put("resetPassword")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.userService.findAll();
  }

  @Get("reduced")
  findAllReduced() {
    return this.userService.findAllReduced();
  }

  @Get("/protected")
  protected(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return supabaseUser;
  }

  @Get(":userId")
  findOne(@Param("userId") userId: UUID) {
    return this.userService.findOne(userId);
  }

  @Get(":userId/expertTeams")
  findExpertTeams(@Param("userId") userId: UUID) {
    return this.userService.findExpertTeams(userId);
  }

  @Patch(":userId")
  update(
    @Param("userId") userId: UUID,
    @Body() updateUserDto: UpdateUserDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    return this.userService.update(userId, updateUserDto, supabaseUser.sub);
  }

  @Delete(":userId")
  remove(
    @Param("userId") userId: UUID,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    return this.userService.remove(userId, supabaseUser.sub);
  }
}
