import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @CreateDateColumn()
  loginTime: Date;
}
