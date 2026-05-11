import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('Users (e2e)', () => {
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

  describe('Fluxo: Usuario loga, troca senha e loga com a senha nova', () => {
    let matricula: string;
    
    it('Deve logar usuário novo', async () => {
      // 1. Criar um Campus primeiro (via Repositório para ser mais rápido)
      const usersRepo = mysqlDataSource.getRepository('User'); // Nome da sua entidade

      const hash = await bcrypt.hash("senha_do_aluno", 10);

      matricula = `${new Date().getMilliseconds()}_aluno@teste.com`

      const user = await usersRepo.save({
            matricula: matricula,
            password: hash,
            nome: 'Aluno Teste',
            email: `${new Date().getMilliseconds()}_aluno@teste.com` });

      // 2. usuario loga
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          matricula: matricula,
          password: 'senha_do_aluno',
        })
        .expect(201)
        
        accessToken = res.body.access_token;
    });

    it('Muda a própria senha com sucesso', async () => {
        return request(app.getHttpServer())
                .patch('/users/me/password')
                .send({ password: 'nova_senha', passwordAtual: 'senha_do_aluno'})
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
    });

    it('Loga com a senha nova com sucesso', async () => {
        return request(app.getHttpServer())
        .post('/auth/login')
        .send({ matricula: matricula, password: 'nova_senha'})
        .expect(201)
    })

});

describe('Fluxo: Usuario tenta trocar senha incorretamente', () => {
 
    it('Troca a senha com campo faltando', async () => {
        return request(app.getHttpServer())
                .patch('/users/me/password')
                .send({ password: 'nova_senha',})
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400)
    });

    it('Usa senha atual errada', async () => {
        return request(app.getHttpServer())
                .patch('/users/me/password')
                .send({ password: 'outra_sehha', passwordAtual: 'nova_senha_123'})
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(401)
    })

    it('Tenta trocar senha com valores iguais', async () => {
        return request(app.getHttpServer())
                .patch('/users/me/password')
                .send({ password: 'nova_senha', passwordAtual: 'nova_senha'})
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400)
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