import { User } from "src/auth/models/user.class";
import { Chat } from "./chat.interface";

export interface Message {
  id?: number;
  message?: string;
  user?: User;
  chat: Chat;
  createdAt?: Date;
}
