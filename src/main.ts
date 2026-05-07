import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mantendo suas configurações originais
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  // --- IMPLEMENTAÇÃO DO SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('Sistema de Pesquisa e Satisfação - IFPE')
    .setDescription('API para gestão de pesquisas institucionais e acadêmicas (Time 3)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Cole seu token JWT aqui',
        in: 'header',
      },
      'JWT-auth', // Nome da segurança que usaremos nos controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  // --------------------------------

  await app.listen(3000);
  console.log(` Servidor rodando em: http://localhost:3000`);
  console.log(` Documentação disponível em: http://localhost:3000/api`);
}
bootstrap();