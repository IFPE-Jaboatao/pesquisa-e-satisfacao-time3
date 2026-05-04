import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('pesquisas')
export class Pesquisa {
  @ObjectIdColumn()
  id!: ObjectId; // Identificador nativo do MongoDB

  @Column()
  titulo!: string;

  @Column()
  dataInicio!: Date;

  @Column()
  dataFinal!: Date;

  @Column()
  tipo!: string; // Ex: 'INSTITUCIONAL', 'ACADEMICO'

  @Column({ default: false })
  publicada: boolean = false; // Valor padrão para evitar campos 'undefined'

  @Column()
  turmaId!: number; // Usado pelo método findAllByTurma no service

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date; // Útil para auditoria e controle de alterações
}