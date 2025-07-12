import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;
}
