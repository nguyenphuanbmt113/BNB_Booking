import { IsString } from 'class-validator';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class List extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @ManyToMany(() => Room, (room) => room.lists)
  @JoinTable()
  rooms: Room[];

  @ManyToOne(() => User, (user) => user.saveLists)
  owner: User;
}
