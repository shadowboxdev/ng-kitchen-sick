import { ApiProperty } from '@nestjs/swagger';
import { MayBe } from '@sdw/models';
import { Exclude } from 'class-transformer';

export class DeleteDeviceResponseDto {
  @ApiProperty({ type: 'string' })
  public deviceKey!: string;

  @Exclude()
  public description?: MayBe<string>;
}
