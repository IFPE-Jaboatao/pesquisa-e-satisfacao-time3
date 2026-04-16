import { Entity, ObjectIdColumn, Column } from 'typeorm';
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

  @Column()
  publicada!: boolean;
}