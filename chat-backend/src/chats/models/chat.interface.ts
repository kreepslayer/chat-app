import { User } from "src/auth/models/user.class";

export interface Chat {
  id?: number;
  users?: User[];
  lastUpdated?: Date;
}
