import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { User } from "@prisma/client";
import { S3BucketService } from "src/s3-bucket/s3-bucket.service";
import { PatchAnnouncementDto } from "./dto/patch-announcement.dto";

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly S3BucketService: S3BucketService
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, user: User) {
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

  async getAll() {
    return this.prisma.announcements.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    return this.prisma.announcements.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    await this.prisma.announcements.delete({
      where: { id },
    });
  }

  async update(id: string, updateAnnouncementDto: Partial<PatchAnnouncementDto>, user: User) {
    const existingAnnouncement = await this.prisma.announcements.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw new Error("Announcement not found");
    }

    // Add new images to s3 bucket and get the URLs
    let imageUrls: string[] = existingAnnouncement.imageUrl || [];
    if (updateAnnouncementDto.files && updateAnnouncementDto.files.length !== 0) {
      const newImageUrls = await Promise.all(
        updateAnnouncementDto.files.map(async file => {
          const location = await this.S3BucketService.uploadFile("annonces", file);
          return location;
        })
      );
      imageUrls = imageUrls.concat(newImageUrls);
    }

    const updatedAnnouncement = await this.prisma.announcements.update({
      where: { id },
      data: {
        title: updateAnnouncementDto.title || existingAnnouncement.title,
        author: user.name,
        description: updateAnnouncementDto.description || existingAnnouncement.description,
        tags: updateAnnouncementDto.tags || existingAnnouncement.tags,
        imageUrl: imageUrls,
      },
    });

    return updatedAnnouncement;
  }
}
