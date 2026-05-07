import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'Nome de usuário cadastrado no sistema',
        example: 'lucas.admin', // Exemplo que aparecerá no Swagger
    })
    @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio' })
    @IsString()
    username!: string;

    @ApiProperty({
        description: 'Senha de acesso do usuário',
        example: 'senha123',
        format: 'password', // Isso faz o campo ocultar os caracteres no navegador
    })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password!: string;
}