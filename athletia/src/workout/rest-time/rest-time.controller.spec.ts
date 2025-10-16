import { Test, TestingModule } from '@nestjs/testing';
import { RestTimeController } from './rest-time.controller';

describe('RestTimeController', () => {
  let controller: RestTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestTimeController],
    }).compile();

    controller = module.get<RestTimeController>(RestTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
