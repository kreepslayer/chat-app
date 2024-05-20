import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../models/chat.entity";
import { Repository, DeleteResult } from "typeorm";
import { User } from "src/auth/models/user.class";
import { Chat } from "../models/chat.interface";
import { from, map, mergeMap, of, switchMap, take, type Observable } from "rxjs";
import { log } from "console";
import { activeChatEntity } from "../models/activeChat.entity";
import { MessageEntity } from "../models/message.entity";
import { ActiveChat } from "../models/activeChat.interface";
import { Message } from "../models/message.interface";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(activeChatEntity)
    private readonly activeChatRepository: Repository<activeChatEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  getChat(creatorId: number, friendId: number): Observable<Chat | undefined> {
    return from(
      this.chatRepository
        .createQueryBuilder("chat")
        .leftJoin("chat.users", "user")
        .where("user.id = :creatorId", { creatorId })
        .orWhere("user.id = :friendId", { friendId })
        .groupBy("chat.id")
        .having("COUNT(*) > 1")
        .getOne(),
    ).pipe(map((chat: Chat) => chat || undefined));
  }

  createChat(creator: User, friend: User): Observable<Chat> {
    return this.getChat(creator.id, friend.id).pipe(
      switchMap((chat: Chat) => {
        const doeschatExist = !!chat;
        if (!doeschatExist) {
          const newchat: Chat = {
            users: [creator, friend],
          };
          return from(this.chatRepository.save(newchat));
        }
        return of(chat);
      }),
    );
  }

  getChatsForUser(userId: number): Observable<Chat[]> {
    console.log("getChatsForUser, id->", userId);
    return from(this.chatRepository.createQueryBuilder("chat").leftJoin("chat.users", "user").where("user.id = :userId", { userId }).orderBy("chat.lastUpdate", "DESC").getMany());
  }

  getUsersInChat(chatId: number): Observable<Chat[]> {
    return from(this.chatRepository.createQueryBuilder("chat").innerJoinAndSelect("chat.users", "user").where("chat.id = :chatId", { chatId }).getMany());
  }

  getChatsWithUsers(userId: number): Observable<Chat[]> {
    return this.getChatsForUser(userId).pipe(
      take(1),
      switchMap((chats: Chat[]) => chats),
      mergeMap((chat: Chat) => {
        return this.getUsersInChat(chat.id);
      }),
    );
  }

  joinChat(friendId: number, userId: number, socketId: string): Observable<ActiveChat> {
    return this.getChat(userId, friendId).pipe(
      switchMap((chat: Chat) => {
        if (!chat) {
          console.warn(`No chat exists for userId: ${userId} and friendId: ${friendId}`);
          return of();
        }
        const chatId = chat.id;
        return from(this.activeChatRepository.findOne({ where: [{ userId }] })).pipe(
          switchMap((activeChat: ActiveChat) => {
            if (activeChat) {
              return from(this.activeChatRepository.delete({ userId })).pipe(
                switchMap(() => {
                  return from(
                    this.activeChatRepository.save({
                      socketId,
                      userId,
                      chatId,
                    }),
                  );
                }),
              );
            } else {
              return from(
                this.activeChatRepository.save({
                  socketId,
                  userId,
                  chatId,
                }),
              );
            }
          }),
        );
      }),
    );
  }

  leaveChat(socketId: string): Observable<DeleteResult> {
    return from(this.activeChatRepository.delete({ socketId }));
  }

  getActiveUsers(chatId: number): Observable<ActiveChat[]> {
    return from(
      this.activeChatRepository.find({
        where: [{ chatId }],
      }),
    );
  }

  createMessage(message: Message): Observable<Message> {
    console.log("🚀 ~ ChatService ~ createMessage ~ message:", message);
    return from(this.messageRepository.save(message));
  }

  getMessages(chatId: number): Observable<Message[]> {
    return from(
      this.messageRepository
        .createQueryBuilder("message")
        .innerJoinAndSelect("message.user", "user")
        .where("message.chat.id =:chatId", { chatId })
        .orderBy("message.createdAt", "ASC")
        .getMany(),
    );
  }

  // Note: Would remove below in production - helper methods
  // removeActiveChats() {
  //   return from(this.activeChatRepository.createQueryBuilder().delete().execute());
  // }

  // removeMessages() {
  //   return from(this.messageRepository.createQueryBuilder().delete().execute());
  // }

  // removeChats() {
  //   return from(this.chatRepository.createQueryBuilder().delete().execute());
  // }
}
