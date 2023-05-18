import { IsEnum } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Room } from './room.entity';

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
}
