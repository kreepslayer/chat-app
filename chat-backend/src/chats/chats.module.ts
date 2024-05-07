import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { userModule } from "src/users/users.module";
import { ChatsGetaway } from "./getaway/chatsGetaway";

@Module({
  imports: [userModule, AuthModule],
  providers: [ChatsGetaway],
})
export class ChatsModule {}
