import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../models/chat.entety";
import { Repository } from "typeorm";
import { User } from "src/users/models/user.interface";
import { Chat } from "../models/chat.interface";
import { UsersService } from "src/users/service/users.service";
import { map } from "rxjs";

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private userService: UsersService,
  ) {}

  async createChat(chat: Chat, creator: User): Promise<Chat> {
    console.log("🚀 ~ ChatsService ~ createChat ~ creator:", creator);
    console.log("🚀 ~ ChatsService ~ createChat ~ chat:", chat);
    const newChat = await this.addCreator(chat, creator);
    console.log("🚀 ~ ChatsService ~ createChat ~ newChat:", newChat);
    return this.chatRepository.save(newChat);
  }

  async addCreator(chat: Chat, creator: User): Promise<Chat> {
    chat.users.push(creator);
    return chat;
  }

  async getChatsForUser(userId: number): Promise<Chat[]> {
    const query = this.chatRepository.createQueryBuilder("chat").leftJoin("chat.users", "user").where("user.id = :id", { id: userId });
    return await query.getMany();
  }

  async getChatsByTwoUsers(user1Name: string, user2Name: string) {
    const user1 = await this.userService.findByUserName(user1Name);
    console.log("🚀 ~ ChatsService ~ getChatsByTwoUsers ~ user1:", user1);
    const user2 = await this.userService.findByUserName(user2Name);
    console.log("🚀 ~ ChatsService ~ getChatsByTwoUsers ~ user2:", user2);
    if (!user1 || !user2) {
      throw new Error("User not found");
    }
    console.log("res -->");

    console.log(
      await this.chatRepository.findOne({
        where: [
          {
            users: [user1, user2],
          },
          {
            users: [user2, user1],
          },
        ],
        relations: ["users"],
      }),
    );

    return this.chatRepository.findOne({
      where: [
        {
          users: [user1, user2],
        },
        {
          users: [user2, user1],
        },
      ],
      relations: ["users"],
    });
  }
}
