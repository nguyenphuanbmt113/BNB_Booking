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

  @Column({ type: 'date', nullable: true })
  @IsDate()
  endDate: Date;

  calculateDiscountFee(price: number, stayDays: number) {
    let result = 0;
    // const now = new Date();

    // if (
    //   this.endDate.getTime() !== null &&
    //   this.endDate.getTime() < now.getTime()
    // ) {
    //   return result;
    // }

    const isSatisfied = discountStrategies[this.type].isSatisfied(stayDays);
    if (isSatisfied) result += price * (this.percent * 0.01);

    return result;
  }

  calculateDiscountFeeV2(price: number, stayDays: number) {
    let result = 0;
    const now = new Date();

    //kiem tra xem date có hợp lệ hay không
    if (
      this.endDate.getTime() !== null &&
      this.endDate.getTime() < now.getTime()
    ) {
      return result;
    }
    const isSatisfied = discountStrategies[this.type].isSatisfied(stayDays);
    if (isSatisfied) {
      result += price * (this.percent * 0.01);
    }
  }
}
export interface DiscountStrategy {
  isSatisfied: (stayDays: number) => boolean;
}

export const discountStrategies: Record<DiscountType, DiscountStrategy> = {
  Week: { isSatisfied: (stayDays) => (stayDays >= 7 ? true : false) },
  Month: { isSatisfied: (stayDays) => (stayDays >= 28 ? true : false) },
  Special: { isSatisfied: () => true },
};
