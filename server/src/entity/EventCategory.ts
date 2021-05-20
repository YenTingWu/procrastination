import {
  Entity,
  BaseEntity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventCategoryItem } from './EventCategoryItem';

@Entity('event_category')
export class EventCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  color: string;

  @OneToMany(() => EventCategoryItem, (e) => e.category)
  items: EventCategoryItem[];
}
