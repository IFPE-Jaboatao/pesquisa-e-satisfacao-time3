import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

type RespostaItem = {
  questaoId: string;
  valor: string;
};

@Entity('respostas')
export class Resposta {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  pesquisaId!: string;

  @Column()
  respostas!: RespostaItem[];

  @Column()
  enviadoEm!: Date;

  @Column()
  anonId!: string;

  @Column()
  fingerprint!: string;
}