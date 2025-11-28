import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../common/config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../users/accounts/accounts.module';
import { AuthModule } from '../auth/auth.module';
import { BootstrapService } from './bootstrap.service';
import { ProfilesModule } from 'src/users/profiles/profiles.module';
import { ExercisesModule } from 'src/workout/exercises/exercises.module';
import { RoutinesModule } from 'src/workout/routines/routines.module';
import { SplitsModule } from 'src/workout/splits/splits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    AccountsModule,
    ProfilesModule,
    SplitsModule,
    RoutinesModule,
    ExercisesModule,
  ],
  controllers: [AppController],
  providers: [AppService, BootstrapService],
})
export class AppModule {}
