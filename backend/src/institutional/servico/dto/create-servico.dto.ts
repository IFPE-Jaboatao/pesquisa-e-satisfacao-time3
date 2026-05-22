import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateServicoDto {
    @IsString()
    @MinLength(4)
    nome!: string;

    @IsNumber()
    setorId!: number;

}
