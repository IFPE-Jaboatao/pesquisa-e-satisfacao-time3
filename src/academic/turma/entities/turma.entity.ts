import { Curso } from "src/academic/curso/entities/curso.entity";
import { Disciplina } from "src/academic/disciplina/entities/disciplina.entity";
import { Matricula } from "src/academic/matricula/entities/matricula.entity";
import { Periodo } from "src/academic/periodo/entities/periodo.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Turnos } from "../turma-turnos.enum";

@Entity()
export class Turma {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'enum', enum: Turnos})
    turno!: Turnos;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Disciplina)
    disciplina!: Disciplina;

    @ManyToOne(() => Periodo)
    periodo!: Periodo;

    @ManyToOne(() => User)
    docente!: User;

    @OneToMany(() => Matricula, (matricula) => matricula.turma)
    matriculas?: Matricula[]

}
