import { BaseEntity, MayBe } from '@sdw/models';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Entity, Column, OneToOne, DeleteDateColumn } from 'typeorm';

import { User } from '../users/user.entity';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  public name!: string;

  @DeleteDateColumn({ nullable: true })
  public deletedAt?: MayBe<Date>;

  /**
   * Relations
   */
  @OneToOne((type) => User, (u) => u.profile)
  public user?: MayBe<User>;
}
