import { Test, TestingModule } from '@nestjs/testing';
import { CursoService } from './curso.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Campus } from '../../institutional/campus/entities/campus.entity';

describe('CursoService', () => {
  let service: CursoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursoService,
        {
          provide: getRepositoryToken(Curso, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Campus, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CursoService>(CursoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});