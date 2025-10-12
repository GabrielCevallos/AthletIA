import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [PersonsModule, TypeOrmModule.forFeature([Account])],
  providers: [AccountsService],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
