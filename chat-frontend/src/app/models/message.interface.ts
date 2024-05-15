import type { Chat } from './chat.interface';
import { User } from './user.interface';
export interface Message {
  id?: number;
  message?: string;
  user?: User;
  createdAt?: Date;
  chat: Chat;
}
