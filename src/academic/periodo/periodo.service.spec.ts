import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoService } from './periodo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Periodo } from './entities/periodo.entity';

describe('PeriodoService', () => {
  let service: PeriodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodoService,
        {
          provide: getRepositoryToken(Periodo, 'mysql'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeriodoService>(PeriodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});