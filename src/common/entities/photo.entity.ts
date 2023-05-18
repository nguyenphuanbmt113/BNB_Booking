import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Room } from './room.entity';

@Entity()
export class Photo extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  url: string;

  @Column({ nullable: true })
  @IsString()
  caption?: string;

  // Inver Side Relation
  @ManyToOne(() => Room, (room) => room.photos, { nullable: true })
  room: Room;
}
