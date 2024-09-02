import { IsString, IsBoolean } from 'class-validator';

export class AnswerQuestionDto {
  @IsString()
  option: string;

  @IsBoolean()
  isAttempted: boolean;
}
