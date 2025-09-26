import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { User } from "@prisma/client";
import { S3BucketService } from "../s3-bucket/s3-bucket.service";
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

    const announcement = await this.prisma.announcement.create({
      data: {
        title: createAnnouncementDto.title,
        author: user.firstname + " " + user.lastname,
        tags: createAnnouncementDto.tags,
        content: createAnnouncementDto.content,
        images: imageUrls,
      },
    });

    return announcement;
  }

  async getAll() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    return this.prisma.announcement.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    await this.prisma.announcement.delete({
      where: { id },
    });
  }

  async update(id: string, updateAnnouncementDto: Partial<PatchAnnouncementDto>, user: User) {
    const existingAnnouncement = await this.prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw new Error("Announcement not found");
    }

    // Add new images to s3 bucket and get the URLs
    let imageUrls: string[] = (existingAnnouncement.images as string[]) || [];
    if (updateAnnouncementDto.files && updateAnnouncementDto.files.length !== 0) {
      const newImageUrls = await Promise.all(
        updateAnnouncementDto.files.map(async file => {
          const location = await this.S3BucketService.uploadFile("annonces", file);
          return location;
        })
      );
      imageUrls = imageUrls.concat(newImageUrls);
    }

    const updatedAnnouncement = await this.prisma.announcement.update({
      where: { id },
      data: {
        title: updateAnnouncementDto.title || existingAnnouncement.title,
        author: user.firstname + " " + user.lastname,
        tags: updateAnnouncementDto.tags || existingAnnouncement.tags || undefined,
        images: imageUrls,
        content: updateAnnouncementDto.content || existingAnnouncement.content,
      },
    });

    return updatedAnnouncement;
  }
}
