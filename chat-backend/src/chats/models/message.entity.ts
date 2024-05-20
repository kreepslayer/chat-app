import { UserEntity } from "src/auth/models/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatEntity } from "./chat.entity";

@Entity("message")
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => UserEntity, userEntity => userEntity.messages)
  user: UserEntity;

  @ManyToOne(() => ChatEntity, ChatEntity => ChatEntity.messages)
  chat: ChatEntity;

  @CreateDateColumn()
  createdAt: Date;
}
