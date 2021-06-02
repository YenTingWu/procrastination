import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Calendar } from './Calendar';

@Entity('users')
@Unique(['displayName'])
@Unique(['insensitiveName'])
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  displayName: string;

  @Column({ type: 'varchar', length: 64 })
  insensitiveName: string;

  @IsEmail()
  @Column('text')
  email: string;

  @Column('boolean', { default: false })
  isVerifiedEmail: boolean;

  @Column('text', { default: null })
  twitterId: string;

  @Column('text', { default: null })
  googleId: string;

  /**
   * If the user is created by social login, do not access the user login by manual
   */

  @Column('text', { default: null })
  password: string;

  @Column('text', { default: null })
  avatar: string;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @ManyToMany(() => Calendar, (calendar) => calendar.user_id)
  calendars: Calendar[];
}
