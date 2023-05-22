import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { User } from './user.entity';
import { Room } from './room.entity';
import { Rating } from './rating.entity';

@Entity()
export class Review extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guestId: number;
  @Column()
  roomId: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn()
  guest: User;

  @ManyToOne(() => Room, (room) => room.reviews)
  @JoinColumn()
  room: Room;

  // Inverse side Relation
  @OneToMany(() => Rating, (rating) => rating.review)
  ratings: Rating[];
}
