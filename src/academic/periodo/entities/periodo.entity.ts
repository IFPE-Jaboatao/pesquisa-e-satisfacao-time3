import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['ano', 'semestre'])
export class Periodo {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ano!: number

    @Column()
    semestre!: number

}
