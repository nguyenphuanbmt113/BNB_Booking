import { IsDate, IsEnum, IsInt, IsNumber } from 'class-validator';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { User } from './user.entity';
import { Room } from './room.entity';
import { DateDiff, DateRange } from '../utils/datetime.utils';
import { dateTransformer } from '../middleware/class-validate';

export enum ReservationStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  FAEILED = 'FAEILED',
  CHECKEDIN = 'CHECKEDIN',
  CHECKEDOUT = 'CHECKEDOUT',
  CANCELED = 'CANCELED',
}

@Entity()
export class Reservation extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.reservations, { eager: true })
  @JoinTable()
  guests: User[];

  @Column({ type: 'int' })
  @IsInt()
  guestCnt: number;

  @Column({ type: 'enum', enum: ReservationStatus, nullable: true })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @Column({
    transformer: dateTransformer,
  })
  @IsDate()
  checkIn: Date;

  @Column({
    transformer: dateTransformer,
  })
  @IsDate()
  checkOut: Date;

  @Column({ type: 'int' })
  @IsNumber()
  price: number;

  @ManyToOne(() => Room, (room) => room.reservations)
  room: Room;

  getDurationInDyas(): number {
    return DateDiff.inDays(this.checkIn, this.checkOut);
  }

  isScheduled(): boolean {
    return (
      this.status === ReservationStatus.REQUESTED ||
      this.status === ReservationStatus.ACCEPTED
    );
  }

  getStayTerm(): DateRange {
    const d = new Date(this.checkOut);
    d.setDate(this.checkOut.getDate() - 1);
    const a = new DateRange(this.checkIn, d);
    return a;
  }
}
