import { Injectable } from "@nestjs/common";
import { ChatEntity } from "../models/chat.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { catchError, from, map, Observable, switchMap, throwError } from "rxjs";
import { MessageEntity } from "../models/message.entity";
import { Chat } from "../models/chat.interface";
import { Message } from "../models/message.interface";
import { log } from "console";

@Injectable()
export class ChatsService {
  constructor(@InjectRepository(ChatEntity) private readonly ChatRepository: Repository<ChatEntity>) {}
  getUserChats(userName: string): Observable<Chat[]> {
    return from(this.ChatRepository.find({ where: [{ User1Name: userName }, { User2Name: userName }] }));
  }

  //get chat by 2 users
  getChatBy2Users(userName: string, user2Name: string): Observable<Chat> {
    return from(
      this.ChatRepository.findOne({
        where: [
          { User1Name: userName, User2Name: user2Name },
          { User1Name: user2Name, User2Name: userName },
        ],
      }),
    );
  }

  addMessageToChat(userName: string, user2Name: string, message: Message): Observable<Chat> {
    return this.getChatBy2Users(userName, user2Name).pipe(
      switchMap((chat: Chat) => {
        if (chat) {
          chat.Messages.push(JSON.stringify(message));
          return this.ChatRepository.save(chat);
        } else {
          let newChat = new ChatEntity();
          newChat.User1Name = userName;
          newChat.User2Name = user2Name;
          newChat.Messages = [JSON.stringify(message)];
          return this.ChatRepository.save(newChat);
        }
      }),
    );
  }

  //delete all chats
  deleteAllChats(): Observable<any> {
    return from(this.ChatRepository.delete({}));
  }

  getAllChats(): Observable<Chat[]> {
    return from(this.ChatRepository.find());
  }
}
