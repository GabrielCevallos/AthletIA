import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

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
  @ApiBadRequestResponse({
    description: 'Invalid request or API key not configured',
  })
  async generateExerciseDescription(
    @Body() body: { name: string; muscle?: string; equipment?: string },
  ) {
    try {
      if (!body.name || body.name.trim() === '') {
        throw new HttpException('Exercise name is required', HttpStatus.BAD_REQUEST);
      }

      const description = await this.aiService.generateExerciseDescription(
        body.name,
        body.muscle,
        body.equipment,
      );
      return { description };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Log the error for server-side debugging
      console.error('AI Controller Error:', error);
      
      throw new HttpException(
        error.message || 'Error generating exercise description',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
