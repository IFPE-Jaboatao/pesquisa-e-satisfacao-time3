import { Max, Min, minLength, MinLength } from "class-validator";
import { Column, Entity, FindOperator, LessThan, MoreThan, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Periodo {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ano!: number

    @Column()
    semestre!: number

}
