import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content!: string;

  @Column()
  link!: string;

  @Column({ type: "boolean", default: false })
  isRead!: boolean;

  @ManyToOne(() => User, user => user.notifications)
  user!: User;
}
