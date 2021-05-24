import {
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventCategory } from './EventCategory';

@Entity('event_category_item')
export class EventCategoryItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => EventCategory, (e) => e.items)
  category: EventCategory;
}
