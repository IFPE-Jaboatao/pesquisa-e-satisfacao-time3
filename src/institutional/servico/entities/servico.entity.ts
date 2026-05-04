import { Setor } from "src/institutional/setor/entities/setor.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Servico {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt!: Date;

    @ManyToOne(() => Setor, (setor) => setor.servicos, {
        onDelete: "CASCADE"
    })
    setor!: Setor;

}
