import { Test, TestingModule } from '@nestjs/testing';
import { SetorService } from './setor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Setor } from './entities/setor.entity';
import { Campus } from '../campus/entities/campus.entity';

describe('SetorService', () => {
  let service: SetorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetorService,
        {
          provide: getRepositoryToken(Setor, 'mysql'),
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

    service = module.get<SetorService>(SetorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});