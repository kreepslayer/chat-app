import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatEntity } from "./chat.entety";
import { UserEntity } from "src/users/models/enteties/user.entity";

@Entity("messages")
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => UserEntity, user => user.messages)
  user: UserEntity;

  @ManyToOne(() => ChatEntity, chat => chat.messages)
  chat: ChatEntity;

  @CreateDateColumn()
  createdAt: Date;
}
