import { MinLength } from "class-validator";
import { Curso } from "src/academic/curso/entities/curso.entity";
import { Setor } from "src/institutional/setor/entities/setor.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cidades } from "../campus-cidades.enum";

@Entity()
export class Campus {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column({ type: 'enum', enum: Cidades, unique: true })
    cidade?: Cidades

    @OneToMany(() => Setor, setor => setor.campus)
    setores?: Setor[]

    @OneToMany(() => Curso, curso => curso.campus)
    cursos?: Curso[]

}

// ( 
//  id INT PRIMARY KEY AUTO_INCREMENT,  
//  nome VARCHAR NOT NULL,  
//  cidade ENUM(‘cidades de pernambuco’) NOT NULL,   
//  createdAt DATETIME NOT NULL,  
//  updatedAt DATETIME NOT NULL,
//  deletedAt DATETIME DEFAULT NULL, 
// ); 