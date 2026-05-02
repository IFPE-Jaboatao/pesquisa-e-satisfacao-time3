import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('pesquisas')
export class Pesquisa {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  titulo!: string;

  @Column()
  dataInicio!: Date;

  @Column()
  dataFinal!: Date;

  @Column()
  tipo!: string; // Ex: 'INSTITUCIONAL', 'ACADEMICO'

  @Column({ default: false })
  publicada!: boolean;

  
  @Column()
  turmaId!: number; 

  @CreateDateColumn()
  createdAt!: Date;
}