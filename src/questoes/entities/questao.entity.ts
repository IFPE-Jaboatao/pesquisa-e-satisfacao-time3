import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum TipoQuestao {
  ESCALA = 'ESCALA',
  MULTIPLA = 'MULTIPLA',
  ABERTA = 'ABERTA',
}

@Entity('questoes')
export class Questao {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  pesquisaId!: string;

  @Column()
  pergunta!: string;

  @Column()
  tipo!: TipoQuestao;

  @Column({ nullable: true })
  opcoes?: string[];

  @Column({ nullable: true })
  escalaMax?: number;
}