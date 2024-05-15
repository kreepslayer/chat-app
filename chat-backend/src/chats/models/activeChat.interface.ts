import { User } from "src/users/models/user.interface";

export class activeChat {
  id?: number;
  socketId: string;
  userId: number;
  chatId: number;
}
