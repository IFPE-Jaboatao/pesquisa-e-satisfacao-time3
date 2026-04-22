import { IsArray, IsString, MinLength } from "class-validator";

export class CreateCampusDto {

    @IsString()
    @MinLength(3)
    nome!: string;
}
