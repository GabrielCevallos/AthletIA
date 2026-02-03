import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

type systemStatusOnly = { status: string };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Returns a hello message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health-check')
  @ApiResponse({ status: 200, description: 'Returns the system health status.' })
  healthCheck(): systemStatusOnly {
    return { status: 'OK' };
  }
}
