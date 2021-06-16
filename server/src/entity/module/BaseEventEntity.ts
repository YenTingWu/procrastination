import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
} from 'typeorm';

enum Status {
  CREATED = 'created',
  WORKING = 'working',
  COMPLETED = 'completed',
}

@Entity()
export class BaseEventEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isProcrastinationTime: boolean;

  @Column({ type: 'int' })
  expectedDuration: number;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;
}
