import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("active_chat")
export class activeChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  userId: number;

  @Column()
  chatId: number;
}
