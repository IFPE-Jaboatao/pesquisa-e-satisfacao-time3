import { Campus } from "src/institutional/campus/entities/campus.entity";
import { Servico } from "src/institutional/servico/entities/servico.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Setor {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt!: Date

    @ManyToOne(() => Campus, (campus) => campus.setores, {
        onDelete: "CASCADE"
    })
    campus!: Campus;

    @OneToMany(() => Servico, (servico) => servico.setor)
    servicos!: Servico[];

}
