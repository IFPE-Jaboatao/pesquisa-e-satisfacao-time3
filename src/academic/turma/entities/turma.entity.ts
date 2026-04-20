import { Curso } from "src/academic/curso/entities/curso.entity";
import { Disciplina } from "src/academic/disciplina/entities/disciplina.entity";
import { Matricula } from "src/academic/matricula/entities/matricula.entity";
import { Periodo } from "src/academic/periodo/entities/periodo.entity";
import { User } from "src/users/user.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Turma {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Disciplina)
    disciplina!: Disciplina

    @ManyToOne(() => Periodo)
    periodo!: Periodo;

    @ManyToOne(() => User)
    docente!: User;

    @OneToMany(() => Matricula, (matricula) => matricula.turma)
    matriculas!: Matricula[]

}
