import { IsDate, IsEnum, IsInt } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Room } from './room.entity';

export enum DiscountType {
  Week = 'Week',
  Month = 'Month',
  Special = 'Special',
}

@Entity()
export class Discount extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: DiscountType })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ManyToOne(() => Room, (room) => room.discounts)
  room: Room;

  @Column({ type: 'int', nullable: true })
  @IsInt()
  percent: number;

  @Column({ type: 'datetime', nullable: true })
  @IsDate()
  endDate: Date;
}
