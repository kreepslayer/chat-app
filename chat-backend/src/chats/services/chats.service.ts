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
    const user = await this.userService.getUserByUserName(chat.users[0].userName);
    newChat.users.push(user);
    newChat.users.splice(0, 1);
    console.log("🚀 ~ ChatsService ~ createChat ~ newChat.users:", newChat.users);
    console.log("🚀 ~ ChatsService ~ createChat ~ newChat:", newChat);

    //TODO
    //check if chat already exists

    return this.chatRepository.save(newChat);
  }

  async addCreator(chat: Chat, creator: User): Promise<Chat> {
    console.log("🚀 ~ ChatsService ~ addCreator ~ chat:", chat);
    chat.users.push(creator);
    return chat;
  }

  async addUserToChat(chat: Chat, user: User): Promise<Chat> {
    console.log("🚀 ~ ChatsService ~ addUserToChat ~ chat:", chat);
    console.log("🚀 ~ ChatsService ~ addUserToChat ~ user:", user);
    chat.users.push(user);
    return chat;
  }

  async getChatsForUser(userId: number): Promise<Chat[]> {
    const query = this.chatRepository.createQueryBuilder("chat").leftJoinAndSelect("chat.users", "user").select(["chat", "user.userName"]);
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

  async dropTable() {
    const query = this.chatRepository.createQueryBuilder("chat").leftJoinAndSelect("chat.users", "user").delete();
    return await query.execute();
  }
}
