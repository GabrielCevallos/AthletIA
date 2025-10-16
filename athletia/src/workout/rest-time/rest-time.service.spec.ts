import { Test, TestingModule } from '@nestjs/testing';
import { RestTimeService } from './rest-time.service';

describe('RestTimeService', () => {
  let service: RestTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestTimeService],
    }).compile();

    service = module.get<RestTimeService>(RestTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
