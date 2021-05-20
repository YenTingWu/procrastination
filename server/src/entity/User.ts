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

  @Column('text')
  password: string;

  @Column('text')
  avatar: string;

  @Column('int')
  tokenVersion: number;
}
