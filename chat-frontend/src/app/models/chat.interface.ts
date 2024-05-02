import { User } from './user.interface';
import { Message } from './message.interface';

export interface Chat {
  User1: User;
  User2: User;
  Messages: Message[];
}
