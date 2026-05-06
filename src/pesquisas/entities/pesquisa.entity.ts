import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
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
  publicada: boolean = false; 

  @Column({ default: false })
  finalizada: boolean = false; 

  @Column({ default: false })
  encerrada: boolean = false; 

  @Column({ default: false })
  notificacaoAberturaEnviada: boolean = false;

  // NOVO: Armazena a data do último envio de lembretes para evitar loops no mesmo dia
  @Column({ nullable: true })
  dataUltimoLembrete?: Date;

  @Column()
  emailDocente!: string;

  @Column({ nullable: true })
  assunto?: string; 

  @Column()
  turmaId!: number; // Usado pelo método findAllByTurma no service

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date; // Útil para auditoria e controle de alterações

  // RECOMENDADO: Soft Delete padronizado com o restante do projeto (Adila)
  @DeleteDateColumn()
  deletedAt?: Date; 
}