import { BaseEntity } from '@sdw/models';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity('licenses')
export class License extends BaseEntity {
  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  public name!: string;
}
