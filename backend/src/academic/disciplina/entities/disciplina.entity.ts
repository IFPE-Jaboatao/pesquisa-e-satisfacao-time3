import { Curso } from "src/academic/curso/entities/curso.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Disciplina {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @Column({nullable: false})
    codigo!: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Curso, (curso) => curso.disciplinas, {
        onDelete: "CASCADE"
    })
    curso!: Curso

}
