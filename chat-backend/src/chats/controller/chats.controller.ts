import { Body, Controller, Delete, Get, Post, UsePipes, ValidationPipe, Param, HttpException, Patch, Put, UseGuards } from "@nestjs/common";
import { ChatsService } from "../service/chats.service";
import { Chat } from "../models/chat.interface";
import { Message } from "../models/message.interface";
import { map, Observable, catchError, throwError, of } from "rxjs";
import { log } from "console";

@Controller("chats")
export class ChatsController {
  constructor(private readonly ChatsService: ChatsService) {}
  //get User chats
  @Get(":userName")
  getUserChats(@Param("userName") userName: string): Observable<Chat[] | void> {
    log(`userName: ${userName}`);
    log("getUserChats res: ", this.ChatsService.getUserChats(userName).pipe(map((data: Chat[]) => data)));
    return this.ChatsService.getUserChats(userName);
  }

  @Get()
  getAllChats(): Observable<Chat[]> {
    log("getAllChats req");
    log("getAllChats res: ", this.ChatsService.getAllChats());
    return this.ChatsService.getAllChats();
  }

  //add message to chat

  @Post(":userName/:user2Name/")
  addMessageToChat(@Body() message: Message, @Param("userName") userName: string, @Param("user2Name") user2Name: string): Observable<Chat> {
    return this.ChatsService.addMessageToChat(userName, user2Name, message);
  }

  @Delete()
  deleteAllChats(): Observable<any> {
    return this.ChatsService.deleteAllChats();
  }
}
