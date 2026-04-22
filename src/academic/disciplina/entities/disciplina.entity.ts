import { Curso } from "src/academic/curso/entities/curso.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Disciplina {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @ManyToOne(() => Curso, (curso) => curso.disciplinas, {
        onDelete: "CASCADE"
    })
    curso!: Curso

}
