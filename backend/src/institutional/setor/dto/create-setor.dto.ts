import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateSetorDto {

    @IsString()
    @MinLength(2)
    nome!: string;

    @IsNumber()
    campusId!: number;
}
