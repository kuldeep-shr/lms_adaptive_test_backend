import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  questionText?: string;

  @IsArray()
  @IsOptional()
  options?: { option: string }[];

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsNumber()
  @IsOptional()
  weightage?: number;
}
