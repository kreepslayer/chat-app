import { ChatEntity } from "src/chats/models/chat.entety";
import { MessageEntity } from "src/chats/models/message.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @ManyToMany(() => ChatEntity, chat => chat.users)
  chats: ChatEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[];
}
