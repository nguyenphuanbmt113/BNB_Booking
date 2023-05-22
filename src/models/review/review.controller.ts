import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { UserDeco } from '../auth/decorator/user.decorator';
import { User } from 'src/common/entities/user.entity';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { UserRole } from 'src/common/entities/role.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  create(@Body() createReviewDto: any, @UserDeco() user: User) {
    console.log('user:', user);
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

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Host)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateReviewDto: any,
    @UserDeco() user: User,
  ) {
    console.log('user:', user);
    return this.reviewsService.update(user.id, id, updateReviewDto);
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Host)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
