import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('auditoria')
export class Auditoria {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  usuarioId!: string; 

  @Column()
  usuarioNome!: string; // aceitar o nome do Admin/Gestor

  @Column()
  entidade!: string; // 'Pesquisa'

  @Column()
  entidadeId!: string; 

  @Column()
  acao!: string; 

  @Column({ type: 'json', nullable: true }) // Adicionado nullable para evitar erros em deletes
  dadosAnteriores: any;

  @Column({ type: 'json', nullable: true }) // Adicionado nullable
  dadosNovos: any;

  @CreateDateColumn()
  timestamp!: Date;
}