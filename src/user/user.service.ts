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

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, supabaseUserId: string): Promise<UserResponse> {
    // Check if the user already exists
    const existUser = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (existUser) {
      throw new ConflictException("User with this Supabase ID already exists.");
    }

    return await this.prisma.user.create({
      data: {
        supabaseUserId,
        name: createUserDto.name,
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

    return await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
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
    return;
  }
}
