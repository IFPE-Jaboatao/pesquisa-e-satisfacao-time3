import { Delete } from "@nestjs/common";
import { CreateDisciplinaDto } from "src/academic/disciplina/dto/create-disciplina.dto";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class Periodo {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ano!: number

    @Column()
    semestre!: number

    @Column({ type: 'date' })
    startDate!: string;

    @Column({ type: 'date' })
    endDate!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

}