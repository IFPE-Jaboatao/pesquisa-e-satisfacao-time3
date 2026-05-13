import { Test, TestingModule } from '@nestjs/testing';
import { ServicoService } from './servico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';
import { Setor } from '../setor/entities/setor.entity';

describe('ServicoService', () => {
  let service: ServicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicoService,
        {
          provide: getRepositoryToken(Servico, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Setor, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServicoService>(ServicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});