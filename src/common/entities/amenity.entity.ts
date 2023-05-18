import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import BaseClassEntity from './global/base-entity.entity';

@Entity()
export class AmenityGroup extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @OneToMany(() => AmenityItem, (amentity) => amentity.group)
  amennities: AmenityItem[];
}

@Entity()
export class AmenityItem extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AmenityGroup, (amenitiesGroup) => amenitiesGroup.amennities)
  group: AmenityGroup;

  @Column({ unique: true })
  @IsString()
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  description: string;

  @ManyToMany(() => Room, (room) => room.amenities)
  rooms: Room[];
}
