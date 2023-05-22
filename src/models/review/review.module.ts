import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/common/entities/review.entity';
import { Rating } from 'src/common/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Rating])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
