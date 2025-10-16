import { forwardRef, Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    TypeOrmModule.forFeature([Profile]),
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
