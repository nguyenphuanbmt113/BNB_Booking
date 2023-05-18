import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Reservation,
  ReservationStatus,
} from 'src/common/entities/reservation.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  @InjectRepository(Reservation)
  private reservationRepo: Repository<Reservation>;

  async findOneById(id: number) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    return reservation;
  }

  async findAll() {
    const users = await this.reservationRepo.find();
    return users;
  }

  async delete(id: number) {
    const reservation = await this.findOneById(id);
    await this.reservationRepo.remove(reservation);
    return reservation;
  }

  async update(id: number, data: any) {
    const reservation = await this.findOneById(id);
    Object.assign(reservation, data);
    return this.reservationRepo.save(reservation);
  }

  async reserve(
    guest: User,
    reserveRoomDTO: CreateReservationDto,
  ): Promise<Reservation> {
    const reservation = this.reservationRepo.create({
      ...reserveRoomDTO,
      guests: [guest],
      checkIn: new Date(reserveRoomDTO.checkIn),
      checkOut: new Date(reserveRoomDTO.checkOut),
    });

    reservation.status = ReservationStatus.REQUESTED;
    return await this.reservationRepo.save(reservation);
  }
}
