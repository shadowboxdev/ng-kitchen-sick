import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(100)
  public name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(100)
  public domain: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(100)
  public description: string;
}
