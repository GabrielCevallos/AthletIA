import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { Measurement } from './measurements.entity';
import { AccountsModule } from 'src/users/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Measurement]),
    AccountsModule,
  ],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
  exports: [MeasurementsService],
})
export class MeasurementsModule {}
