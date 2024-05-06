import { User } from './user.interface';
import { Message } from './message.interface';

export interface Chat {
  User1Name: string;
  User2Name: string;
  Messages: Message[];
}
