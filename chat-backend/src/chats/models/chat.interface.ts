import { User } from "../../users/models/user.interfase";
import { Message } from "./message.interface";

export interface Chat {
  User1Name?: string;
  User2Name?: string;
  Messages?: string[];
}
