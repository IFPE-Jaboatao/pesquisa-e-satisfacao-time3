import { Test, TestingModule } from '@nestjs/testing';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';

describe('CursoController', () => {
  let controller: CursoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursoController],
      providers: [
        {
          provide: CursoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CursoController>(CursoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});