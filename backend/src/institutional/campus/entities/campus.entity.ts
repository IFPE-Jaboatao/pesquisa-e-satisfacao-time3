import { MinLength } from "class-validator";
import { Curso } from "src/academic/curso/entities/curso.entity";
import { Setor } from "src/institutional/setor/entities/setor.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cidades } from "../campus-cidades.enum";
import { User } from "src/users/user.entity";

@Entity()
export class Campus {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column({ type: 'enum', enum: Cidades })
    cidade?: Cidades

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @OneToMany(() => Setor, setor => setor.campus)
    setores?: Setor[]

    @OneToMany(() => Curso, curso => curso.campus)
    cursos?: Curso[]

    @OneToMany(() => User, user => user.campus)
    users?: User[]

}