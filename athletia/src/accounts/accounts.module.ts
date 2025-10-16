import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountsController } from './accounts.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([Account])],
  providers: [AccountsService],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
