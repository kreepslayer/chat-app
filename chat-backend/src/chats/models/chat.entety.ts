import { UserEntity } from "src/users/models/enteties/user.entity";
import { MessageEntity } from "src/chats/models/message.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("chat")
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => MessageEntity, message => message.chat)
  messages: MessageEntity[];

  @UpdateDateColumn()
  lastUpdate: Date;
}
