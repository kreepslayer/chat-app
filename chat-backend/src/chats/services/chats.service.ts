import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../models/chat.entety";
import { Repository, type DeleteResult } from "typeorm";
import { User } from "src/users/models/user.interface";
import { Chat } from "../models/chat.interface";
import { UsersService } from "src/users/service/users.service";
import { from, map, mergeMap, of, switchMap, take, type Observable } from "rxjs";
import { log } from "console";
import { ChatInSidebar } from "../models/ChatInSidebar.interface";
import { activeChatEntity } from "../models/activeChat.entity";
import { MessageEntity } from "../models/message.entity";
import type { activeChat } from "../models/activeChat.interface";
import type { Message } from "../models/message.interface";

@Injectable()
export class ChatsService {
  constructor(
    private userService: UsersService,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(activeChatEntity)
    private readonly activeChatRepository: Repository<activeChatEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  // async createChat(chat: Chat, creator: User): Promise<Chat> {
  //   console.log("🚀 ~ ChatsService ~ createChat ~ creator:", creator);
  //   console.log("🚀 ~ ChatsService ~ createChat ~ chat:", chat);
  //   const newChat = await this.addCreator(chat, creator);
  //   const user = await this.userService.getUserByUserName(chat.users[0].userName);
  //   if (user == null) throw new Error("User not found");
  //   newChat.users.push(user);
  //   newChat.users.splice(0, 1);
  //   console.log("🚀 ~ ChatsService ~ createChat ~ newChat.users:", newChat.users);
  //   console.log("🚀 ~ ChatsService ~ createChat ~ newChat:", newChat);
  //   return this.chatRepository.save(newChat);
  // }

  createChat(creator: User, user2: User): Observable<Chat> {
    return this.geyChatBy2Users(creator.id, user2.id).pipe(
      switchMap((chat: Chat) => {
        const isExist = !!chat;
        if (!isExist) {
          const newChat: Chat = {
            users: [creator, user2],
          };
          return from(this.chatRepository.save(newChat));
        }
        return of(chat);
      }),
    );
  }

  geyChatBy2Users(user1ID: number, user2ID: number): Observable<ChatEntity> {
    return from(
      this.chatRepository
        .createQueryBuilder("chat")
        .leftJoin("chat.users", "user")
        .where("user.id = :user1.id", { user1ID })
        .orWhere("user.id = :user2.id", { user2ID })
        .groupBy("chat.id")
        .having("COUNT(*) > 1")
        .getOne(),
    );
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

  async getAllChats(): Promise<Chat[]> {
    log(`getAllChats`);
    let allChats = await this.chatRepository.createQueryBuilder("chat").leftJoinAndSelect("chat.users", "user").select(["chat", "user.userName"]).getMany();
    console.log("🚀 ~ ChatsService ~ getAllChats ~ allChats:", allChats);
    console.log("users -->");
    allChats = allChats.map((chat: ChatEntity) => {
      console.log(
        chat.users.map((user: User) => {
          return user.userName;
        }),
      );
      return chat;
    });
    return await this.chatRepository.find({
      relations: ["users"],
      order: {
        id: "ASC",
      },
    });
  }

  getChatsForUser(userId: number): Observable<Chat[] | undefined> | undefined {
    return from(
      this.chatRepository.createQueryBuilder("chat").leftJoin("chat.users", "users").where("users.id = :userId", { userId }).orderBy("chat.lastUpdate", "DESC").getMany(),
    );
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

  // async getChatsInSidebar(user: User): Promise<ChatInSidebar[]> {
  //   const chats = await this.getChatsForUser(user.id);
  //   let res: ChatInSidebar[] = [];
  //   chats.forEach((chat: Chat) => {
  //     if (chat.users[0].userName == user.userName) {
  //       res.push({
  //         userName: chat.users[1].userName,
  //         lastMessageText: "chat.lastMessageText",
  //       });
  //     } else {
  //       res.push({
  //         userName: chat.users[0].userName,
  //         lastMessageText: "chat.lastMessageText",
  //       });
  //     }
  //   });

  //   console.log("🚀 ~ ChatsService ~ getChatsInSidebar ~ res:", res);

  //   return res;
  // }

  getUsersInChat(ChatID: number): Observable<Chat[]> {
    return from(this.chatRepository.createQueryBuilder("chat").leftJoin("chat.users", "users").where("chat.id = :ChatID", { ChatID }).getMany());
  }

  getChatsWithUser(userId: number): Observable<Chat[]> {
    return this.getChatsForUser(userId).pipe(
      take(1),
      switchMap((chats: Chat[]) => chats),
      mergeMap((chat: Chat) => {
        return this.getUsersInChat(chat.id);
      }),
    );
  }

  joinChat(userId: number, user2Id: number, socketId: string): Observable<activeChat> {
    return this.geyChatBy2Users(userId, user2Id).pipe(
      switchMap((chat: Chat) => {
        if (!chat) {
          console.warn(`chat don't exists for userID ${userId} and user2ID ${user2Id}`);
          return of();
        }
        const chatId = chat.id;
        return from(this.activeChatRepository.findOne({ where: { userId } })).pipe(
          switchMap((activeChat: activeChat) => {
            if (activeChat) {
              return from(this.activeChatRepository.delete({ userId })).pipe(
                switchMap(() => {
                  return from(this.activeChatRepository.save({ socketId, userId, chatId }));
                }),
              );
            } else {
              return from(this.activeChatRepository.save({ socketId, userId, chatId }));
            }
          }),
        );
      }),
    );
  }

  leaveChat(socketId: string): Observable<DeleteResult> {
    return from(this.activeChatRepository.delete({ socketId }));
  }

  //for messages
  createMessage(message: Message): Observable<Message> {
    return from(this.messageRepository.save(message));
  }

  getMessages(chatID: number): Observable<Message[]> {
    return from(
      this.messageRepository
        .createQueryBuilder("message")
        .innerJoinAndSelect("message.user", "user")
        .where("message.conversation.id =:chatID", { chatID })
        .orderBy("message.createdAt", "ASC")
        .getMany(),
    );
  }

  //for active users
  getActiveUsers(chatId: number): Observable<activeChat[]> {
    return from(
      this.activeChatRepository.find({
        where: [{ chatId }],
      }),
    );
  }

  // Note: В продакшне удалять по хорошему :)
  removeActiveChat() {
    return from(this.activeChatRepository.createQueryBuilder().delete().execute());
  }

  removeMessages() {
    return from(this.messageRepository.createQueryBuilder().delete().execute());
  }

  removeChats() {
    return from(this.chatRepository.createQueryBuilder().delete().execute());
  }
}
