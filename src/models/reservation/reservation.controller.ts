import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Reservation } from 'src/common/entities/reservation.entity';
import { User } from 'src/common/entities/user.entity';
import { UserDeco } from '../auth/decorator/user.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  GetUserById(@Param('reservationId') reservationId: number) {
    return this.reservationService.findOneById(reservationId);
  }

  @Delete('delete-reservation/:id')
  deleteUser(@Param('id') id: number) {
    return this.reservationService.delete(id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('create')
  async reserve(
    @UserDeco() user: User,
    @Body() reserveRoomDTO: CreateReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.reserve(user, reserveRoomDTO);
  }
}
