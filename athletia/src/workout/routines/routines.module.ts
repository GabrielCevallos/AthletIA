import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Routine } from './routines.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Routine]),
  ],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}
