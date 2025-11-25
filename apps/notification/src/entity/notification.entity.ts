import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum MessageType {
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({
    type: "enum",
    enum: MessageType,
    default: MessageType.INFO,
  })
  type: MessageType;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
