import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { Role } from "@prisma/client";
import { S3BucketService } from "src/s3-bucket/s3-bucket.service";

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly S3BucketService: S3BucketService
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, userId: string) {
    // check if user exists and have admin role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: userId },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can create announcements");
    }

    // Add the announcement image to s3 bucket and get the URL
    let imageUrls: string[] = [];
    if (createAnnouncementDto.files && createAnnouncementDto.files.length !== 0) {
      imageUrls = await Promise.all(
        createAnnouncementDto.files.map(async file => {
          const location = await this.S3BucketService.uploadFile("annonces", file);
          return location;
        })
      );
    }

    const announcement = await this.prisma.announcements.create({
      data: {
        title: createAnnouncementDto.title,
        author: user.name,
        tags: createAnnouncementDto.tags,
        description: createAnnouncementDto.description,
        imageUrl: imageUrls,
      },
    });

    return announcement;
  }
}
