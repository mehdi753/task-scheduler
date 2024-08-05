import { IsBoolean, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsBoolean()
  readonly is_enabled: boolean;

  @ApiProperty()
  @IsString({})
  readonly interval: string;

  @ApiProperty()
  @IsObject()
  readonly meta_data: Record<any, any>;
}
