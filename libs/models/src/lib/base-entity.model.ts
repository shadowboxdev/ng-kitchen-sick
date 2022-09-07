import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { MayBe } from './maybe.type';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn({ nullable: true })
  public createdAt?: MayBe<Date>;

  @UpdateDateColumn({ nullable: true })
  public updatedAt?: MayBe<Date>;
}
