import { Test, TestingModule } from '@nestjs/testing';
import { WorkingSetsController } from './working-sets.controller';

describe('WorkingSetsController', () => {
  let controller: WorkingSetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkingSetsController],
    }).compile();

    controller = module.get<WorkingSetsController>(WorkingSetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
