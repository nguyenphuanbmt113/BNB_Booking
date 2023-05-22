import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { UserDeco } from '../auth/decorator/user.decorator';
import { User } from 'src/common/entities/user.entity';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: any, @UserDeco() user: User) {
    return this.reviewsService.create(user.id, createReviewDto);
  }

  @Get('')
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('user/:id')
  findAllReviewOfUser(@Param('id') id: string) {
    return this.reviewsService.findAllReviewOfUser(+id);
  }

  @Get('room/:id')
  findAllReviewOfRoom(@Param('id') id: string) {
    return this.reviewsService.findAllReviewOfRoom(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateReviewDto: any,
    @UserDeco() user: User,
  ) {
    return this.reviewsService.update(user.id, id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
