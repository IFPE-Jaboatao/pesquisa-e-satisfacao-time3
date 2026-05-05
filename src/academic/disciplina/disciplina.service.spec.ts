import { Test, TestingModule } from '@nestjs/testing';
import { DisciplinaService } from './disciplina.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Disciplina } from './entities/disciplina.entity';
import { Curso } from '../curso/entities/curso.entity';

describe('DisciplinaService', () => {
  let service: DisciplinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinaService,
        {
          provide: getRepositoryToken(Disciplina, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Curso, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DisciplinaService>(DisciplinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});