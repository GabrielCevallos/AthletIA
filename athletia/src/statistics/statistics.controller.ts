import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    return this.statisticsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(id);
  }

  @Post()
  async create(@Body() payload: any) {
    return this.statisticsService.create(payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.statisticsService.remove(id);
  }
}
