import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from '../schemas/question.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    try {
      const question = new this.questionModel({
        ...createQuestionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await question.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create question');
    }
  }

  async updateQuestion(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    try {
      const question = await this.questionModel.findByIdAndUpdate(
        id,
        { ...updateQuestionDto, updatedAt: new Date() },
        { new: true },
      );

      if (!question) {
        throw new NotFoundException(`Question with ID "${id}" not found`);
      }

      return question;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update question');
    }
  }

  async getQuestionById(id: string): Promise<Question> {
    try {
      const question = await this.questionModel.findById(id);

      if (!question) {
        throw new NotFoundException(`Question with ID "${id}" not found`);
      }

      return question;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch question');
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    try {
      const result = await this.questionModel.findByIdAndDelete(id);

      if (!result) {
        throw new NotFoundException(`Question with ID "${id}" not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete question');
    }
  }

  async getAllQuestions(): Promise<Question[]> {
    try {
      return await this.questionModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch questions');
    }
  }
}
