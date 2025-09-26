import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UUID } from "crypto";
import { UserResponse } from "./dto/user-response";
import { Role } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class UserService {
  private supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ côté serveur uniquement
  );

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, supabaseUserId: string): Promise<UserResponse> {
    const requestingUser = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (!requestingUser) {
      throw new NotFoundException("You are not authenticated");
    }
    if (requestingUser.role !== Role.ORGANIZER) {
      throw new ForbiddenException("You are not authorized to create users");
    }

    // Create user in supabase auth first
    const { data: authUser, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
      email: createUserDto.email,
      email_confirm: true,
      password: Math.random().toString(36).slice(-8), // Generate a random password
    });

    if (authError) {
      throw new ConflictException(`Supabase Auth Error: ${authError.message}`);
    }

    return await this.prisma.user.create({
      data: {
        supabaseUserId: authUser.user?.id,
        ...createUserDto,
      },
    });
  }

  async login(supabaseUserId: string): Promise<UserResponse> {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    return user;
  }

  async findAll(): Promise<UserResponse[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: UUID): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: UUID,
    updateUserDto: UpdateUserDto,
    supabaseUserId: string
  ): Promise<UserResponse> {
    const user = await this.findOne(id);

    if (user.supabaseUserId !== supabaseUserId) {
      const requestingUser = await this.prisma.user.findUnique({
        where: { supabaseUserId },
      });
      if (!requestingUser) {
        throw new NotFoundException("You are not authenticated");
      }
      if (requestingUser.role !== Role.ORGANIZER) {
        throw new ForbiddenException("You can only update your own profile");
      }
    }

    if (updateUserDto.email !== user.email) {
      const requestingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (requestingUser) {
        throw new ConflictException("Email already in use");
      }

      const { error: authError } = await this.supabaseAdmin.auth.admin.updateUserById(
        user.supabaseUserId,
        {
          email: updateUserDto.email,
          email_confirm: true,
        }
      );

      if (authError) {
        throw new ConflictException(`Supabase Auth Error: ${authError.message}`);
      }
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: UUID, supabaseUserId: string): Promise<void> {
    const user = await this.findOne(id);

    if (user.supabaseUserId !== supabaseUserId) {
      const requestingUser = await this.prisma.user.findUnique({
        where: { supabaseUserId },
      });
      if (!requestingUser) {
        throw new NotFoundException("You are not authenticated");
      }
      if (requestingUser.role !== Role.ORGANIZER) {
        throw new ForbiddenException("You can only update your own profile");
      }
    }

    await this.prisma.user.delete({
      where: { id },
    });
    await this.supabaseAdmin.auth.admin.deleteUser(user.supabaseUserId);
    return;
  }
}
