import { Test, TestingModule } from '@nestjs/testing';
import { TurmaService } from './turma.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Turma } from './entities/turma.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Periodo } from '../periodo/entities/periodo.entity';
import { User } from '../../users/user.entity';

describe('TurmaService', () => {
  let service: TurmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurmaService,
        {
          provide: getRepositoryToken(Turma, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Disciplina, 'mysql'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Periodo, 'mysql'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User, 'mysql'),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TurmaService>(TurmaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});