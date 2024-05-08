import { ChatEntity } from "src/chats/models/chat.entety";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

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
}
