import { Global, Module } from "@nestjs/common";
import { S3BucketService } from "./s3-bucket.service";
import { S3BucketController } from "./s3-bucket.controller";

@Global()
@Module({
  controllers: [S3BucketController],
  providers: [S3BucketService],
  exports: [S3BucketService],
})
export class S3BucketModule {}
