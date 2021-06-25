import {
  Entity,
  BaseEntity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './Event';
import { EventCategory } from './EventCategory';
import { EventCategoryItem } from './EventCategoryItem';

@Entity('event_type')
export class Field extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (e) => e.fields)
  eventId: Event;

  @OneToOne(() => EventCategory)
  @JoinColumn()
  category: EventCategory;

  @OneToOne(() => EventCategoryItem)
  @JoinColumn()
  item: EventCategoryItem;
}
