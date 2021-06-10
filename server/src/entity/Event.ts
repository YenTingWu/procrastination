import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEventEntity } from './module/BaseEventEntity';
import { Calendar } from './Calendar';
import { SubEvent } from './SubEvent';
import { EventType } from './EventType';

@Entity('events')
export class Event extends BaseEventEntity {
  // TODO: location (GEO point)

  @Column({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ type: 'timestamp with time zone' })
  endTime: Date;

  @ManyToOne(() => Calendar, (calendar) => calendar.events, { cascade: true })
  calendar: Calendar;

  @OneToMany(() => SubEvent, (s) => s.event)
  subEvents: SubEvent[];

  @OneToMany(() => EventType, (e) => e.eventId)
  eventType: EventType[];
}
