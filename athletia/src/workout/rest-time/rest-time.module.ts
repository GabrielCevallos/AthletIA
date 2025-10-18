import { Module } from '@nestjs/common';
import { RestTimeService } from './rest-time.service';
import { RestTimeController } from './rest-time.controller';

@Module({
  providers: [RestTimeService],
  controllers: [RestTimeController],
})
export class RestTimeModule {}
