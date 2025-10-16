import { Test, TestingModule } from '@nestjs/testing';
import { WorkingSetsService } from './working-sets.service';

describe('WorkingSetsService', () => {
  let service: WorkingSetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkingSetsService],
    }).compile();

    service = module.get<WorkingSetsService>(WorkingSetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
