import { IsBoolean, IsMongoId, IsString, IsNotEmpty } from 'class-validator';

export class CreateTestDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  testUrl: string;

  @IsBoolean()
  @IsNotEmpty()
  isExpired: boolean;
}
