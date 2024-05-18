import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { FeedController } from "./controllers/feed.controller";

@Module({
  imports: [AuthModule, FeedModule],
  controllers: [FeedController],
  providers: [],
})
export class FeedModule {}
