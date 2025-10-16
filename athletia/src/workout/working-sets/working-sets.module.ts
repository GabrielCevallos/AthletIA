import { Module } from '@nestjs/common';
import { WorkingSetsService } from './working-sets.service';
import { WorkingSetsController } from './working-sets.controller';

@Module({
  providers: [WorkingSetsService],
  controllers: [WorkingSetsController]
})
export class WorkingSetsModule {}
