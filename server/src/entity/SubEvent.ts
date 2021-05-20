import { Entity, Column, ManyToOne } from 'typeorm';
import { Event } from './Event';
import { BaseEventEntity } from './module/BaseEventEntity';

@Entity('sub_events')
export class SubEvent extends BaseEventEntity {
  @Column({ type: 'int' })
  percentage: number;

  @ManyToOne(() => Event, (e) => e.subEvents)
  event: Event;
}
