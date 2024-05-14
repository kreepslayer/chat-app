import type { User } from './user.interface';

export interface chatInSidebar {
  userName: string;
  lastMessageText?: string;
  notifications?: number;
}
