import { UserEntity } from "src/auth/models/user.entity";
import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MessageEntity } from "./message.entity";
@Entity("chat")
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => MessageEntity, message => message.chat)
  messages: MessageEntity[];

  @UpdateDateColumn()
  lastUpdate: Date;
}
