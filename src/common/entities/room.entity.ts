import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AmenityItem } from './amenity.entity';
import { Country } from './country.entity';
import { Discount } from './discount.entity';
import BaseClassEntity from './global/base-entity.entity';
import { List } from './list.entity';
import { Photo } from './photo.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';
import { CustomRule, DetailChoice, RuleChoice } from './rule.entity';
import { User } from './user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DateRange } from '../utils/datetime.utils';

export enum RoomType {
  Apartment = 'Apartment',
  House = 'House',
  SecondaryUnit = 'SecondaryUnit',
  UniqueSpace = 'UniqueSpace',
  BedAndBreakfast = 'BedAndBreakfast',
  BoutiqueHotel = 'BoutiqueHotel',
}

@Entity()
export class Room extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.rooms)
  host: User;

  @Column({ type: 'enum', enum: RoomType })
  @IsEnum(RoomType)
  roomType: RoomType;

  @Column({ type: 'int' })
  @IsInt()
  price: number;

  @OneToMany(() => Discount, (discount) => discount.room)
  discounts: Discount[];

  @Column({ type: 'int', nullable: true })
  @IsInt()
  cleaningFee: number;

  @Column({ type: 'int' })
  @IsInt()
  roomCnt: number;

  @Column({ type: 'int' })
  @IsInt()
  bedCnt: number;

  @Column({ type: 'float' })
  @IsNumber()
  bathCnt: number;

  @Column({ type: 'int' })
  @IsInt()
  maxGuestCnt: number;

  @Column()
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @IsString()
  description: string;

  @OneToMany(() => Photo, (photo) => photo.room)
  photos: Photo[];

  @ManyToOne(() => Country, (country) => country.rooms)
  country: Country;

  // ===== Address =====
  @Column()
  @IsString()
  addressState: string;

  @Column()
  @IsString()
  addressCity: string;

  @Column()
  @IsString()
  addressStreet: string;

  @Column({ nullable: true })
  @IsString()
  addressEtc: string;

  @Column()
  @IsString()
  addressZipCode: string;
  // ====================

  // ===== Options =====
  @OneToMany(() => RuleChoice, (rule) => rule.room)
  ruleChoices: RuleChoice[];

  @OneToMany(() => CustomRule, (desc) => desc.room)
  customRules: CustomRule[];

  @OneToMany(() => DetailChoice, (detail) => detail.room)
  detailChoices: DetailChoice[];

  @ManyToMany(() => AmenityItem, (amenityItem) => amenityItem.rooms)
  @JoinTable()
  amenities: AmenityItem[];
  // ====================

  // Inverse Side Relation
  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.room)
  reviews: Review[];

  @ManyToMany(() => List, (list) => list.rooms)
  lists: List[];

  // ===== Domain Methods =====
  validateReservation(reservation: Reservation): boolean {
    //kiểm tra: phải đăng ký ở tương lại
    const currentTime = new Date();
    if (
      currentTime > reservation.checkIn ||
      currentTime > reservation.checkOut ||
      reservation.checkIn >= reservation.checkOut
    ) {
      throw new BadRequestException('reservation wrong!');
    }

    //kiểm tra
    console.log('this.reservations:', this.reservations);
    if (!this.isAccommodable(reservation.getStayTerm())) {
      //false thì không thực hiện
      throw new BadRequestException('can not reservation');
    }

    //tính giá tiền
    const totalPrice = this.calculateTotalPrice(
      reservation.getDurationInDyas(),
      reservation.guestCnt,
    );
    if (totalPrice != reservation.price) {
      throw new BadRequestException(`The price has changed: ${totalPrice}`);
    }
    return true;
  }

  private isAccommodable(stayTerm: DateRange): boolean {
    if (!this.reservations)
      throw new InternalServerErrorException("Reservations doesn't exist.");
    return !this.reservations
      .filter((reservation) => reservation.isScheduled())
      .map((reservation) => reservation.getStayTerm())
      .some((otherStayRange) => otherStayRange.intersect(stayTerm));
  }

  calculateTotalPrice(stayDays: number, guestCnt: number): number {
    return this.calculatePriceInDetail(stayDays, guestCnt).totalPrice;
  }

  calculatePriceInDetail(stayDays: number, guestCnt: number): IPriceDetail {
    const accommodationFee = this.price * stayDays;
    const discountFee = this.calculateDiscountFee(accommodationFee, stayDays);
    const cleaningFee = this.cleaningFee || 0;

    const serviceFee = this.calculateServiceFee(
      accommodationFee - discountFee + cleaningFee,
    );
    const taxFee = this.calculateTaxFee(serviceFee, stayDays, guestCnt);

    const totalPrice =
      accommodationFee - discountFee + cleaningFee + serviceFee + taxFee;
    return {
      accommodationFee,
      discountFee,
      cleaningFee,
      serviceFee,
      taxFee,
      totalPrice,
    };
  }

  private calculateDiscountFee(price: number, stayDays: number): number {
    if (!this.discounts)
      throw new InternalServerErrorException("Discounts does't exist.");
    return this.discounts
      .map((discount) => discount.calculateDiscountFee(price, stayDays))
      .reduce((acc, cur) => Math.max(acc, cur), 0);
  }

  private calculateServiceFee(price: number): number {
    // TODO: Make Billing System
    const commissionPercent = 15;
    return price * (commissionPercent * 0.01);
  }

  private calculateTaxFee(
    price: number,
    stayDays: number,
    guestCnt: number,
  ): number {
    if (!this.country)
      throw new InternalServerErrorException("Country does't exist.");
    return this.country.calculateTax(this, price, stayDays, guestCnt);
  }
}

interface IPriceDetail {
  accommodationFee: number;
  discountFee: number;
  cleaningFee: number;
  serviceFee: number;
  taxFee: number;
  totalPrice: number;
}
