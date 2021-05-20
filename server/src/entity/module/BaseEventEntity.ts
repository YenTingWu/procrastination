import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum Status {
  CREATED = 'created',
  WORKING = 'working',
  COMPLETED = 'completed',
}

@Entity()
export class BaseEventEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'boolean' })
  isProcrastinationTime: boolean;

  @Column({ type: 'int' })
  expectedDuration: number;

  @Column({ type: 'int' })
  duration: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;
}
