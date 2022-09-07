import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity, MayBe } from '@sdw/models';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  IsEmpty
} from 'class-validator';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn
} from 'typeorm';

import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('companies')
export class Company extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsEmpty({ groups: [CREATE] })
  @IsNumber({}, { groups: [UPDATE] })
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  public name!: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(100, { groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  public domain!: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true, default: null })
  public description!: string;

  @DeleteDateColumn({ nullable: true })
  public deletedAt?: MayBe<Date>;

  /**
   * Relations
   */

  @OneToMany((type) => User, (u) => u.company)
  @Type((t) => User)
  public users!: User[];

  @OneToMany((type) => Project, (p) => p.company)
  public projects!: Project[];
}
