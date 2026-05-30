import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  // Configuração avançada do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Pesquisa e Avaliação Docente')
    .setDescription('Documentação técnica das rotas do IFPE - Sistema de Satisfação')
    .setVersion('1.0')
    // Configura o Bearer Auth para que o cadeado apareça no Swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT gerado no login para acessar rotas protegidas',
        in: 'header',
      },
      'access-token', // Nome de referência para usar nos decorators futuramente
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();