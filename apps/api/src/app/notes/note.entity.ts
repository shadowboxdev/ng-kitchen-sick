import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'revision_id', nullable: false })
  public revisionId!: number;
}
