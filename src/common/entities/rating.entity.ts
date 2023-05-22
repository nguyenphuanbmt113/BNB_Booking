import { IsEnum, IsInt } from 'class-validator';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import BaseClassEntity from './global/base-entity.entity';

export enum RatingCategory {
  CLEANNESS = 'CLEANNESS',
  ACCURACY = 'ACCURACY',
  COMMUNICATION = 'COMMUNICATION',
  LOCATION = 'LOCATION',
  CHECKIN = 'CHECKIN',
  PRICE = 'PRICE',
}

@Entity()
@Check(`star BETWEEN 0 AND 5`)
export class Rating extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewId: number;

  @ManyToOne(() => Review, (review) => review.ratings)
  @JoinColumn()
  review: Review;

  @Column({ type: 'enum', enum: RatingCategory })
  @IsEnum(RatingCategory)
  category: RatingCategory;

  @Column({ type: 'int' })
  @IsInt()
  star: number;
}
