import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';

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

  @Column('boolean')
  isSocialLogin: boolean;

  /**
   * If the user is created by social login, do not access the user login by manual
   */

  @Column('text', { default: null })
  password: string;

  @Column('text')
  avatar: string;

  @Column('int', { default: 0 })
  tokenVersion: number;
}
