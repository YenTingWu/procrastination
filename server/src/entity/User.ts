import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';
import { SOCIAL_LOGIN_TYPE } from '../types';

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

  @Column('text')
  email: string;

  /**
   * Not sure if enum's default value can be NULL or not
   */

  @Column('enum', { enum: SOCIAL_LOGIN_TYPE, default: null })
  socialLoginType: SOCIAL_LOGIN_TYPE;

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
}
