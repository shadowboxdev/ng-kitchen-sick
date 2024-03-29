import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { Project } from './project.entity';

@Entity('user_projects')
export class UserProject {
  @PrimaryColumn()
  public projectId!: number;

  @PrimaryColumn()
  public userId!: number;

  @Column({ nullable: true })
  public review!: string;

  @ManyToOne(() => Project, (el) => el.userProjects, {
    persistence: false,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'projectId' })
  public project!: Project;

  @ManyToOne(() => User, (el) => el.userProjects, {
    persistence: false
  })
  @JoinColumn({ name: 'userId' })
  public user!: User;
}
