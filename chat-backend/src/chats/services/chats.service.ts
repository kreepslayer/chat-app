import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../models/chat.entety";
import { Repository } from "typeorm";
import { User } from "src/users/models/user.interface";
import { Chat } from "../models/chat.interface";

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async createChat(chat: Chat, creator: User): Promise<Chat> {
    const newChat = await this.addCreator(chat, creator);
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
}
