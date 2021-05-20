import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEventEntity } from './module/BaseEventEntity';
import { Calendar } from './Calendar';
import { SubEvent } from './SubEvent';
import { EventType } from './EventType';

@Entity('events')
export class Event extends BaseEventEntity {
  // TODO: location (GEO point)

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @ManyToOne(() => Calendar, (calendar) => calendar.events)
  calendar: Calendar;

  @OneToMany(() => SubEvent, (s) => s.event)
  subEvents: SubEvent[];

  @OneToMany(() => EventType, (e) => e.eventId)
  eventType: EventType[];
}
