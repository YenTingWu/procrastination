import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  BaseEntity,
  OneToMany,
  Generated,
} from 'typeorm';
import { Event } from './Event';
import { User } from './User';

@Entity('calendars')
export class Calendar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column({
    type: 'timestamptz',
    transformer: {
      from: (dbType) => {
        if (typeof dbType === 'string') {
          return new Date(dbType);
        }
      },
      to: (type) => type,
    },
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    transformer: {
      from: (dbType) => {
        if (typeof dbType === 'string') {
          return new Date(dbType);
        }
      },
      to: (type) => type,
    },
  })
  modifiedAt: Date;

  @OneToMany(() => Event, (event) => event.calendar)
  events: Event[];

  @ManyToMany(() => User, (user) => user.calendars)
  @JoinTable()
  users: User[];
}
