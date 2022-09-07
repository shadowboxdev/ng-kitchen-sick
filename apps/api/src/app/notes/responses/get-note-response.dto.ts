import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetNoteResponseDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  public id!: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  public revisionId!: string;
}
