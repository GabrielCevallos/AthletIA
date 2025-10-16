import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../common/config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthModule } from '../auth/auth.module';
import { BootstrapService } from './bootstrap.service';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    AccountsModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService, BootstrapService],
})
export class AppModule {}
