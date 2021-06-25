import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
} from 'typeorm';

export enum Status {
  CREATED = 'CREATED',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
}

export type EventType = 'to_do' | 'event';
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

  @Column({ type: 'varchar' })
  type: EventType;

  @Column('text', { array: true, nullable: true })
  parents: string[];

  @Column('text', { array: true, nullable: true })
  children: string[];

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;
}
