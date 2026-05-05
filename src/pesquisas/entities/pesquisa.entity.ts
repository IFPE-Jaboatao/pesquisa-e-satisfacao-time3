import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  tipo!: string; 

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
  turmaId!: number; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date; 
}