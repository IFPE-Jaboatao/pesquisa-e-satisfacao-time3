import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // Importação necessária para o Swagger
import { Cidades } from "../campus-cidades.enum";

export class CreateCampusDto {

    @ApiProperty({
        description: 'Nome do campus do IFPE',
        example: 'Campus Recife',
        minLength: 3
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nome!: string;

    @ApiProperty({
        description: 'Cidade onde o campus está localizado',
        enum: Cidades,
        example: Cidades.RECIFE // Substitua pelo valor padrão do seu enum se necessário
    })
    @IsEnum(Cidades)
    @IsNotEmpty()
    cidade?: Cidades;
}