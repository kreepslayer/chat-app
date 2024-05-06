import type { Message } from './message.interface';

export interface ActiveChat {
  username: string;
  messages: Message[];
}
