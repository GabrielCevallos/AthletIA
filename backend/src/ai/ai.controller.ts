import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-exercise')
  @ApiOperation({ summary: 'Generate exercise description using AI' })
  @ApiOkResponse({
    description: 'Exercise description generated successfully',
    schema: {
      example: {
        description: 'Este es un ejercicio para trabajar el pecho...',
      },
    },
  })
  async generateExerciseDescription(
    @Body() body: { name: string; muscle?: string; equipment?: string },
  ) {
    const description = await this.aiService.generateExerciseDescription(
      body.name,
      body.muscle,
      body.equipment,
    );
    return { description };
  }
}
