import { User } from './user.interface';
import { Message } from './message.interface';

export class Chat {
  id?: number;
  name?: string;
  users?: User[];
  lastUpdate?: Date;
}
