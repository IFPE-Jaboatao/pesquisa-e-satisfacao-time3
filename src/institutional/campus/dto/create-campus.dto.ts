import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { Cidades } from "../campus-cidades.enum";

export class CreateCampusDto {

    @IsString()
    @MinLength(3)
    nome!: string;

    @IsEnum(Cidades)
    cidade?: Cidades;
}
