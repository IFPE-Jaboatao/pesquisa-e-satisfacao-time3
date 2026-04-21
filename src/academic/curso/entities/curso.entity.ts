import { Disciplina } from "src/academic/disciplina/entities/disciplina.entity";
import { Campus } from "src/institutional/campus/entities/campus.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Curso {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @ManyToOne(() => Campus, (campus) => campus.cursos, {
        onDelete: "CASCADE"
    })
    campus!: Campus

    @OneToMany(() => Disciplina, disciplina => disciplina.curso)
    disciplinas?: Disciplina[]

}
