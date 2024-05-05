import type { User } from "../../users/models/user.interfase";

export interface Message {
  text: string;
  time: string;
  sender: string;
}
