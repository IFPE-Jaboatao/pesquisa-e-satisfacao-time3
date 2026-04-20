import { Setor } from "src/institutional/setor/entities/setor.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campus {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @OneToMany(() => Setor, setor => setor.campus)
    setores?: Setor[]

}
