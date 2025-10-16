import { Module } from '@nestjs/common';
import { RepetitionService } from './repetition.service';
import { RepetitionController } from './repetition.controller';

@Module({
  providers: [RepetitionService],
  controllers: [RepetitionController]
})
export class RepetitionModule {}
