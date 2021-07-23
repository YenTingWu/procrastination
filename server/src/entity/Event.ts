import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEventEntity } from './module/BaseEventEntity';
import { Calendar } from './Calendar';
import { Field } from './Field';

@Entity('events')
export class Event extends BaseEventEntity {
  // TODO: location (GEO point)

  @Column({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endTime: Date;

  @Column({ type: 'timestamp with time zone', array: true, default: [] })
  timestamp: Date[];

  @ManyToOne(() => Calendar, (calendar) => calendar.events, { cascade: true })
  calendar: Calendar;

  @OneToMany(() => Field, (e) => e.eventId)
  fields: Field[];
}
