import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { FriendRequestEntity } from "./friend-request.entity";
import { ChatEntity } from "src/chats/models/chat.entity";
import { MessageEntity } from "src/chats/models/message.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imagePath: string;

  @OneToMany(() => FriendRequestEntity, friendRequestEntity => friendRequestEntity.creator)
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity, friendRequestEntity => friendRequestEntity.receiver)
  receivedFriendRequests: FriendRequestEntity[];

  @ManyToMany(() => ChatEntity, ChatEntity => ChatEntity.users)
  chats: ChatEntity[];

  @OneToMany(() => MessageEntity, messageEntity => messageEntity.user)
  messages: MessageEntity[];
}
