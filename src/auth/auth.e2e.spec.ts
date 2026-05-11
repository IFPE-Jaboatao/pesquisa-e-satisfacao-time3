import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mysqlDataSource: DataSource;
  let mongoDataSource: DataSource;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // valida o body do login
    await app.init();

    // pegar as instâncias para garantir o fechamento manual
    mysqlDataSource = app.get<DataSource>(getDataSourceToken('mysql'));
    
    //  try/catch para o caso o mongo não estiver disponível no ambiente de teste
    try {
      mongoDataSource = app.get<DataSource>(getDataSourceToken('mongo'));
    } catch (e) {
      console.warn('MongoDataSource não encontrado, mas seguindo com os testes...');
    }
  });

  it('/auth/login (POST) - Success', async () => {
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;

    const finalPassword = (seedPassword && seedPassword.trim().length >= 6) ? seedPassword : 'admin123';

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ matricula: 'admin', password: finalPassword})
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });

      accessToken = response.body.access_token;
      expect(accessToken).toBeDefined();
  });

    it('/auth/login (POST) - Error (Unauthorized)', () => {
      // credenciais inválidas não devem funcionar para logar no sistema
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ matricula: 'matriculaInexistente', password: 'matriculaInexistente'})
      .expect(401)
      .expect((res) => {
        expect(res.body).not.toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST) /users (GET) - Success', () => {
    // admin deve conseguir acessar a sua rota
    // testa se o token está sendo gerado corretamente
    return request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.length > 0).toBe(true);
          })
  });

    it('/auth/login (POST) /users/dashboard/aluno (GET) - Error (Forbidden)', () => {
    // admin não deve conseguir acessar rota de outro role
    // testa se o rolesguard está funcionando normalmente
    return request(app.getHttpServer())
          .get('/users/dashboard/aluno')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(403)
          .expect((res) => {
            expect(res.body).toBeDefined();
          })
  });

  afterAll(async () => {
  // pegar as conexões diretamente pelo token (se falhar, tem o catch)
  try {
    const mysql = app.get<DataSource>(getDataSourceToken('mysql'));
    if (mysql?.isInitialized) await mysql.destroy();
    
    const mongo = app.get<DataSource>(getDataSourceToken('mongo'));
    if (mongo?.isInitialized) await mongo.destroy();
  } catch (e) {
    console.log(e)
    // silencia erros caso os DataSources não tenham sido inicializados
  }

  // fecha o servidor HTTP para liberar a porta
  if (app) {
    await app.getHttpServer().close();
    // close do app por último, mas dentro de um try/catch
    try {
      await app.close();
    } catch (e) {
      // ignora erro de provider não encontrado no shutdown
    }
  }
})
});