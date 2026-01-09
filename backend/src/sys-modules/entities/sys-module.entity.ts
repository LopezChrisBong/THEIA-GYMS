import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['title', 'parentID'], { unique: true })
export class SysModule {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  icon: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  route: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  parentID: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: false,
  })
  isParent: boolean;

  @CreateDateColumn({
    nullable: false,
    type: 'datetime',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;
}
