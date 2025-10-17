import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

type systemStatusOnly = { status: string };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health-check')
  healthCheck(): systemStatusOnly {
    return { status: 'OK' };
  }
}
