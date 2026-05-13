import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Cidades } from "../campus-cidades.enum";

export class CreateCampusDto {

    
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nome!: string;

    @IsEnum(Cidades)
    @IsNotEmpty()
    cidade?: Cidades;
}
