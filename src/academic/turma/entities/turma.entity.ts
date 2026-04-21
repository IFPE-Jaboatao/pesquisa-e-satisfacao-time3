import { Curso } from "src/academic/curso/entities/curso.entity";
import { Disciplina } from "src/academic/disciplina/entities/disciplina.entity";
import { Matricula } from "src/academic/matricula/entities/matricula.entity";
import { Periodo } from "src/academic/periodo/entities/periodo.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['nome','disciplina', 'periodo', 'docente'])
export class Turma {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @ManyToOne(() => Disciplina)
    disciplina!: Disciplina;

    @ManyToOne(() => Periodo)
    periodo!: Periodo;

    @ManyToOne(() => User)
    docente!: User;

    @OneToMany(() => Matricula, (matricula) => matricula.turma)
    matriculas?: Matricula[]

}
