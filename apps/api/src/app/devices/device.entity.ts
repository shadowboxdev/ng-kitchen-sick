import { CrudValidationGroups } from '@nestjsx/crud';
import { MayBe } from '@sdw/models';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('devices')
export class Device {
  @IsOptional({ always: true })
  @IsUUID('4', { always: true })
  @PrimaryGeneratedColumn('uuid')
  public deviceKey!: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true })
  public description?: MayBe<string>;
}
