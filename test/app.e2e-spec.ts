import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mysqlDataSource: DataSource;
  let mongoDataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    mysqlDataSource = app.get<DataSource>(getDataSourceToken('mysql'));
    mongoDataSource = app.get<DataSource>(getDataSourceToken('mongo'));
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

    afterAll(async () => {
  try {
    // await mongoose.disc
    await mongoDataSource.destroy();

  } catch (e) {
    console.warn('Erro ao fechar conexão mongo:', e);
  }

    try {
    await mysqlDataSource.destroy();
  } catch (e) {
    console.warn('Erro ao fechar conexão mysql:', e);
  }

});
});