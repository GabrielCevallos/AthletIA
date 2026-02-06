import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AccountsModule } from 'src/users/accounts/accounts.module';

@Module({
    imports: [
        ConfigModule,
        AccountsModule,
    ],
    controllers: [AiController],
    providers: [AiService],
})
export class AiModule { }
