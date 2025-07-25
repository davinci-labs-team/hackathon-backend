import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UUID } from "crypto";
import { SupabaseUser } from "src/common/decorators/supabase-user.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { SupabaseDecodedUser } from "src/common/decorators/supabase-decoded-user.types";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser
  ) {
    return this.userService.create(createUserDto, supabaseUser.sub);
  }

  @Post("login")
  async login(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.userService.login(supabaseUser.sub);
  }

  @Get()
  @Public()
  findAll() {
    return this.userService.findAll();
  }

  @Get("/protected")
  protected(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return supabaseUser;
  }

  @Get(":userId")
  findOne(@Param("userId") userId: UUID) {
    return this.userService.findOne(userId);
  }

  @Patch(":userId")
  update(
    @Param("userId") userId: UUID,
    @Body() updateUserDto: UpdateUserDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser
  ) {
    return this.userService.update(userId, updateUserDto, supabaseUser.sub);
  }

  @Delete(":userId")
  remove(@Param("userId") userId: UUID, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.userService.remove(userId, supabaseUser.sub);
  }
}
