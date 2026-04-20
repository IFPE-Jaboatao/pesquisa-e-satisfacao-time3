import { Turma } from "src/academic/turma/entities/turma.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Matricula {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, {
        nullable: false,
        onDelete: "CASCADE"
    })
    aluno!: User
    
    @ManyToOne(() => Turma, {
        nullable: false,
        onDelete: "CASCADE"
    })
    turma!: Turma

}
