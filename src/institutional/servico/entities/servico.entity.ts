import { Setor } from "src/institutional/setor/entities/setor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Servico {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @ManyToOne(() => Setor, (setor) => setor.servicos, {
        onDelete: "CASCADE"
    })
    setor!: Setor;

}
