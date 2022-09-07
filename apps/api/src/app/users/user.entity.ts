/* eslint-disable @typescript-eslint/naming-convention */
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity, MayBe } from '@sdw/models';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested
} from 'class-validator';
import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  DeleteDateColumn
} from 'typeorm';

import { Company } from '../companies/company.entity';
import { Project } from '../projects/project.entity';
import { UserProject } from '../projects/user-project.entity';
import { UserLicense } from '../users-licenses/user-license.entity';
import { UserProfile } from '../users-profiles/user-profile.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Name {
  @IsString({ always: true })
  @Column({ nullable: true })
  public first: string | null = null;

  @IsString({ always: true })
  @Column({ nullable: true })
  public last: string | null = null;
}

// tslint:disable-next-line:max-classes-per-file
@Entity('users')
export class User extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @IsEmail({ require_tld: false }, { always: true })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  public email!: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: true })
  public isActive!: boolean;

  @Type((t) => Name)
  @Column((type) => Name)
  public name!: Name;

  @Column({ nullable: true })
  public profileId?: MayBe<number>;

  @Column({ nullable: false })
  public companyId?: MayBe<number>;

  @DeleteDateColumn({ nullable: true })
  public deletedAt?: MayBe<Date>;

  /**
   * Relations
   */

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ValidateNested({ always: true })
  @Type((t) => UserProfile)
  @OneToOne((type) => UserProfile, (p) => p.user, { cascade: true })
  @JoinColumn()
  public profile?: MayBe<UserProfile>;

  @ManyToOne((type) => Company, (c) => c.users)
  public company?: MayBe<Company>;

  @ManyToMany((type) => Project, (c) => c.users)
  public projects?: MayBe<Project[]>;

  @OneToMany((type) => UserProject, (el) => el.user, {
    persistence: false,
    onDelete: 'CASCADE'
  })
  public userProjects?: MayBe<UserProject[]>;

  @OneToMany((type) => UserLicense, (ul) => ul.user)
  @Type((t) => UserLicense)
  @JoinColumn()
  public userLicenses?: MayBe<UserLicense[]>;
}
