import { forwardRef, Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    TypeOrmModule.forFeature([Person]),
  ],
  providers: [PersonsService],
  controllers: [ProfilesController],
  exports: [PersonsService],
})
export class PersonsModule {}
