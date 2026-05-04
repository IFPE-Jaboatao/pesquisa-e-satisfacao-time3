import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from './user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  matricula!: string;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'enum', enum: Role, default: Role.ALUNO })
  role?: Role

  @Column()
  password!: string;
}