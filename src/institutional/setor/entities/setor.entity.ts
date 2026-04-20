import { Campus } from "src/institutional/campus/entities/campus.entity";
import { Servico } from "src/institutional/servico/entities/servico.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Setor {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @ManyToOne(() => Campus, (campus) => campus.setores)
    campus!: Campus;

    @OneToMany(() => Servico, (servico) => servico.setor)
    servicos!: Servico[];

}
