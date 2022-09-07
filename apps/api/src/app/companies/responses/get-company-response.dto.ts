import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetCompanyResponseDto {
  @ApiProperty({ type: 'number' })
  public id!: string;

  @ApiProperty({ type: 'string' })
  public name!: string;

  @ApiProperty({ type: 'string' })
  public domain!: string;

  @ApiProperty({ type: 'string' })
  public description!: string;

  @Exclude()
  public createdAt!: never;

  @Exclude()
  public updatedAt!: never;
}
