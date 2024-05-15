import { UserEntity } from "src/users/models/enteties/user.entity";
import { User } from "src/users/models/user.interface";
import type { Message } from "./message.interface";

export class Chat {
  id?: number;
  name?: string;
  users?: User[];
  // messages?: Message[];
  lastUpdate?: Date;
}
