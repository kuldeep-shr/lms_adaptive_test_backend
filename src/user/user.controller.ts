import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  NotFoundException,
  ConflictException,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('tests')
  async getTest(@Req() request: AuthenticatedRequest) {
    try {
      const userId = request.user;
      return await this.userService.getTestByUniqueURL(userId.id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new ConflictException(
        'An unexpected error occurred while processing the request',
      );
    }
  }

  @Get('tests/:testId/start')
  async startTest(
    @Param('testId') testId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const userId = request.user;
      return await this.userService.startAdaptiveTest(testId, userId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new ConflictException(
        'An unexpected error occurred while starting the test',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':testId/questions/:questionId/answer')
  @HttpCode(HttpStatus.OK)
  async answerQuestion(
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() answerQuestionDto: AnswerQuestionDto,
  ) {
    return this.userService.answerQuestion(
      testId,
      questionId,
      answerQuestionDto,
    );
  }
}
