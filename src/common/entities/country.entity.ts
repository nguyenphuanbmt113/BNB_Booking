import { IsEnum } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Room } from './room.entity';
import { taxStrategies } from '../strategy/taxStrategy';

export enum CountryName {
  SouthKorea = 'SouthKorea',
  Japan = 'Japan',
  Bermuda = 'Bermuda',
  Brazil = 'Brazil',
  BritishVirginIslands = 'BritishVirginIslands',
  Canada = 'Canada',
  France = 'France',
  Germany = 'Germany',
  India = 'India',
  Italy = 'Italy',
  Lithuania = 'Lithuania',
  Mexico = 'Mexico',
  Netherlands = 'Netherlands',
  Portugal = 'Portugal',
  Switzerland = 'Switzerland',
}

@Entity()
export class Country extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CountryName })
  @IsEnum(CountryName)
  name: CountryName;

  @OneToMany(() => Room, (room) => room.country)
  rooms: Room[];

  calculateTax(room: Room, price: number, stayDays: number, guestCnt: number) {
    const tax = taxStrategies[this.name].calculateTax(room, stayDays);

    let result = 0;
    result += price * (tax.percent * 0.01);
    result += tax.amount * guestCnt * stayDays;
    return result;
  }
}
