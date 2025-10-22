import { Module } from '@nestjs/common';
import { SplitsService } from './splits.service';
import { SplitsController } from './splits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Split } from './splits.entity';
import { Routine } from '../routines/routines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Split, Routine])],
  providers: [SplitsService],
  controllers: [SplitsController],
})
export class SplitsModule {}
