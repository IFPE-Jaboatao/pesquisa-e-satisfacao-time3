import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaService } from './matricula.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Matricula } from './entities/matricula.entity';
import { Turma } from '../turma/entities/turma.entity';
import { User } from '../../users/user.entity';

describe('MatriculaService', () => {
  let service: MatriculaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatriculaService,
        {
          provide: getRepositoryToken(Matricula, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Turma, 'mysql'),
          useValue: {
            find: jest.fn(),
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

    service = module.get<MatriculaService>(MatriculaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});