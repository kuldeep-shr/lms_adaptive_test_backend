import { IsString, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsArray()
  @IsNotEmpty()
  options: { option: string }[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsNumber()
  weightage: number;
}
