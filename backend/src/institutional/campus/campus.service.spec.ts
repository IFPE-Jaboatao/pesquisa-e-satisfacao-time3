import { Test, TestingModule } from '@nestjs/testing';
import { CampusService } from './campus.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Campus } from './entities/campus.entity';

describe('CampusService', () => {
  let service: CampusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampusService,
        {
          provide: getRepositoryToken(Campus, 'mysql'),
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

    service = module.get<CampusService>(CampusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});