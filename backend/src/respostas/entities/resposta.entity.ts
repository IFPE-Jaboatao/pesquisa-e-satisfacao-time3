import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export interface RespostaItem {
  questaoId: string;
  valor: string;
}

@Entity('respostas')
export class Resposta {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  pesquisaId!: string;

  // FK do aluno no MySQL para controle de unicidade
  @Column()
  alunoHash!: string;

  @Column()
  respostas!: RespostaItem[];

  @Column()
  enviadoEm!: Date;

  @CreateDateColumn({type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt!: Date; 

  @DeleteDateColumn({type: 'timestamp'})
  deletedAt?: Date; 
}