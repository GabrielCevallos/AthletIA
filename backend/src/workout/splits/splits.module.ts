import { Module } from '@nestjs/common';
import { SplitsService } from './splits.service';
import { SplitsController } from './splits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Split } from './splits.entity';
import { Routine } from '../routines/routines.entity';
import { AccountsModule } from 'src/users/accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Split, Routine]), AccountsModule],
  providers: [SplitsService],
  controllers: [SplitsController],
})
export class SplitsModule {}
