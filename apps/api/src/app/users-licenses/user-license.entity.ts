import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { License } from './license.entity';

@Entity('user_licenses')
export class UserLicense {
  @PrimaryColumn()
  public userId!: number;

  @PrimaryColumn()
  public licenseId!: number;

  @ManyToOne((type) => User)
  @Type((t) => User)
  public user!: User;

  @ManyToOne((type) => License)
  @Type((t) => License)
  public license!: License;

  @Column()
  public yearsActive!: number;
}
