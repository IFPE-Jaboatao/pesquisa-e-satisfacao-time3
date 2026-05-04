import { Disciplina } from "src/academic/disciplina/entities/disciplina.entity";
import { Campus } from "src/institutional/campus/entities/campus.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class Curso {
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Campus, (campus) => campus.cursos, {
        onDelete: "CASCADE"
    })
    campus!: Campus

    @OneToMany(() => Disciplina, disciplina => disciplina.curso)
    disciplinas?: Disciplina[]

}
