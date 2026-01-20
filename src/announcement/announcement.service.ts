import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { User } from "@prisma/client";
import { S3BucketService } from "../s3-bucket/s3-bucket.service";
import { VisibilityType } from "./enums/visibility-type.enum";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly S3BucketService: S3BucketService,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, user: User) {
    const announcement = await this.prisma.announcement.create({
      data: {
        ...createAnnouncementDto,
        author: user.firstname + " " + user.lastname,
      },
    });

    return announcement;
  }

  async getAll(visibilityType: VisibilityType) {
    return this.prisma.announcement.findMany({
      where: {
        isPrivate:
          visibilityType === VisibilityType.PRIVATE
            ? true
            : visibilityType === VisibilityType.PUBLIC
              ? false
              : undefined,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    return this.prisma.announcement.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    const files = await this.prisma.announcement
      .findUnique({
        where: { id },
        select: { files: true },
      })
      .then((announcement) => announcement?.files as string[]);

    if (files && files.length > 0) {
      for (const file of files) {
        await this.S3BucketService.deleteFile("annonces", file);
      }
    }

    await this.prisma.announcement.delete({
      where: { id },
    });
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
    user: User,
  ) {
    const existingAnnouncement = await this.prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      throw new Error("Announcement not found");
    }

    const updatedAnnouncement = await this.prisma.announcement.update({
      where: { id },
      data: {
        ...updateAnnouncementDto,
        author: user.firstname + " " + user.lastname, // Update author to the user making the change
      },
    });

    return updatedAnnouncement;
  }
}
