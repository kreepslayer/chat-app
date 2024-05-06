import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "../../users/models/user.interfase";
import { Message } from "./message.interface";
import { MessageEntity } from "./message.entity";

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  User1Name: string;

  @Column()
  User2Name: string;

  @Column("text", { array: true, default: [], nullable: true })
  Messages: string[];
}
