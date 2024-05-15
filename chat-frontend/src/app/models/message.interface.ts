import { User } from './user.interface';
export interface Message {
  text: string;
  time: string;
  sender: User;
}
