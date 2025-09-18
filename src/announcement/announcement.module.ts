import { Module } from "@nestjs/common";
import { AnnouncementController } from "./announcement.controller";
import { AnnouncementService } from "./announcement.service";
import { S3BucketModule } from "src/s3-bucket/s3-bucket.module";

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
  imports: [S3BucketModule],
})
export class AnnouncementModule {}
