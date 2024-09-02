import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('admin/questions')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return await this.adminService.createQuestion(createQuestionDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllQuestions() {
    try {
      return await this.adminService.getAllQuestions();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch questions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    try {
      return await this.adminService.getQuestionById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    try {
      return await this.adminService.updateQuestion(id, updateQuestionDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: string) {
    try {
      return await this.adminService.deleteQuestion(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/tests/:testId')
  async getTestDetails(@Param('testId') testId: string) {
    try {
      console.log('xxcvvx');
      return await this.userService.getTestDetails(testId);
    } catch (error) {
      console.log('bhaar error', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve test details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
