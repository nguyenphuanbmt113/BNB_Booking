import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import BaseClassEntity from './global/base-entity.entity';

@Entity()
export class Rule extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsString()
  description: string;

  @Column({ default: false })
  @IsBoolean()
  isExplainable: boolean;
}

@Entity()
export class RuleChoice extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsBoolean()
  isOkay: boolean;

  @Column({ nullable: true })
  @IsString()
  description: string;

  @ManyToOne(() => Rule)
  rule: Rule;

  @ManyToOne(() => Room)
  room: Room;
}

@Entity()
export class CustomRule extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @ManyToOne(() => Room)
  room: Room;
}

//===============================

@Entity()
export class Detail extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  description: string;
}

@Entity()
export class DetailChoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  explain: string;

  @ManyToOne((type) => Detail)
  detail: Detail;

  @ManyToOne((type) => Room)
  room: Room;
}
