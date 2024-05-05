import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "../../users/models/user.interfase";

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  text: string;

  @Column() // Change the type to 'timestamp'
  time: string;
}
