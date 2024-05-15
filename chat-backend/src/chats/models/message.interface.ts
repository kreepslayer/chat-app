import type { User } from "src/users/models/user.interface";
import type { Chat } from "./chat.interface";

export interface Message {
  id?: number;
  message?: string;
  user?: User;
  createdAt?: Date;
  chat?: Chat;
}
