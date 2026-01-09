import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: false })
  user_detailID_to: number;

  @Column({ type: 'int', nullable: false })
  user_detailID_from: number;

  @Column({ type: 'text', nullable: true })
  msg: string;

  @Column({ type: 'varchar', nullable: false })
  notification_type: string;

  @Column({ type: 'varchar', nullable: true })
  redirect_route: string;

  @Column({ type: 'tinyint', default: false })
  isOpenned: boolean;

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
