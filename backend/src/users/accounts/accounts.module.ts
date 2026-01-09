import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountsController } from './accounts.controller';
import { ProfilesModule } from 'src/users/profiles/profiles.module';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([Account]), MailModule],
  providers: [AccountsService],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
