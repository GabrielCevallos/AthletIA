import { forwardRef, Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/users/accounts/accounts.module';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';
import { MeasurementsModule } from 'src/measurements/measurements.module';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    MeasurementsModule,
    TypeOrmModule.forFeature([Profile]),
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
