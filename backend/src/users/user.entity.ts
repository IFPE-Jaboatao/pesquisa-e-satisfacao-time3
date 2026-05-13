import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { Role } from './user-role.enum';
import { Campus } from 'src/institutional/campus/entities/campus.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  matricula!: string;

  @Column()
  nome!: string;

  @Column()
  email!: string;

  @Column({ type: 'enum', enum: Role, default: Role.ALUNO })
  role?: Role

  @ManyToOne(() => Campus , (campus) => campus.users)
  campus!: Campus;

  @Column()
  password!: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt!: Date;

  @DeleteDateColumn({type: 'timestamp'})
  deletedAt!: Date;
}