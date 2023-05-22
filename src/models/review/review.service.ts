import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/common/entities/rating.entity';
import { Review } from 'src/common/entities/review.entity';
import { ParallelAsync } from 'src/common/utils/async.utils';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
  ) {}
  async create(userId: number, createReviewDto: any) {
    const n_review = new Review();
    n_review.guestId = userId;
    n_review.roomId = createReviewDto.roomId;
    await n_review.save();

    const parallelAsync = new ParallelAsync();
    for (let i = 0; i < createReviewDto.ratings.length; i++) {
      parallelAsync.add(
        this.ratingsRepository.save({
          star: createReviewDto.ratings[i].star,
          category: createReviewDto.ratings[i].category,
          reviewId: n_review.id,
        }),
      );
    }
    await parallelAsync.done();

    //tạo ra starts
    return 'This action adds a new review';
  }

  async findAll() {
    const review = await this.reviewsRepository.find({
      relations: ['guest', 'room'],
    });
    return review;
  }

  async findAllReviewOfUser(id: number) {
    const review = await this.reviewsRepository.find({
      where: { guestId: id },
    });
    return review;
  }

  async findAllReviewOfRoom(id: number) {
    const review = await this.reviewsRepository.find({
      where: { roomId: id },
    });
    return review;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  async update(userId: number, roomId: number, updateReviewDto: any) {
    const review = await this.reviewsRepository.findOne({
      where: {
        roomId,
        guestId: userId,
      },
    });
    const rating = await this.ratingsRepository.findOne({
      where: {
        reviewId: review.id,
        category: updateReviewDto.category,
      },
    });

    rating.star = updateReviewDto.star;
    await rating.save();
    return 'update success okale';
  }
  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
