import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Event } from './Event';
import { User } from './User';

@Entity('calendars')
export class Calendar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz')
  modifiedAt: Date;

  @OneToMany(() => Event, (event) => event.calendar)
  events: Event[];

  @ManyToMany(() => User, (user) => user.calendars)
  @JoinTable()
  users: User[];
}
