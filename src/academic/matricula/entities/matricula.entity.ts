import { Turma } from "src/academic/turma/entities/turma.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class Matricula {

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

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
