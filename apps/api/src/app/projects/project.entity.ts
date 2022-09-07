import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity, MayBe } from '@sdw/models';
import {
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  IsDefined,
  IsBoolean
} from 'class-validator';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm';

import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { UserProject } from './user-project.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('projects')
export class Project extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsDefined({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  public name?: MayBe<string>;

  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  public description?: MayBe<string>;

  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: true })
  public isActive?: MayBe<boolean>;

  @IsOptional({ always: true })
  @IsNumber({}, { always: true })
  @Column({ nullable: false })
  public companyId?: MayBe<number>;

  /**
   * Relations
   */

  @ManyToOne((type) => Company, (c) => c.projects)
  public company?: Company;

  @ManyToMany((type) => User, (u) => u.projects, { cascade: true })
  @JoinTable({
    name: 'user_projects',
    joinColumn: {
      name: 'projectId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    }
  })
  public users?: User[];

  @OneToMany((type) => UserProject, (el) => el.project, {
    persistence: false,
    onDelete: 'CASCADE'
  })
  public userProjects!: UserProject[];
}
