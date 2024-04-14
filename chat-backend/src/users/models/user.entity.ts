import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "./user.interfase";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column()
  avatarURL: string;

  @Column()
  displayName: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
