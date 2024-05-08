import type { Chat } from "src/chats/models/chat.interface";

export interface User {
  id?: number;
  userName?: string;
  password?: string;
  chats?: Chat[];
}
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
