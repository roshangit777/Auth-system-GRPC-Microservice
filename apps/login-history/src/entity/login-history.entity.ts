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

  @Column({ type: "jsonb", nullable: true })
  userDetails: { id: number; name: string; email: string; role: string };

  @CreateDateColumn()
  loginTime: Date;
}
