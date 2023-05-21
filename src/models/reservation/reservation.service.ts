import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Reservation,
  ReservationStatus,
} from 'src/common/entities/reservation.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Room } from 'src/common/entities/room.entity';

@Injectable()
export class ReservationService {
  @InjectRepository(Reservation)
  private reservationRepo: Repository<Reservation>;

  @InjectRepository(Room)
  private readonly roomRepository: Repository<Room>;

  async findOneById(id: number) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    return reservation;
  }

  async findAll() {
    const reservations = await this.reservationRepo.find({
      relations: ['room'],
    });
    return reservations;
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
      guests: [{ id: guest.id }],
      room: { id: reserveRoomDTO.roomId },
      checkIn: new Date(reserveRoomDTO.checkIn),
      checkOut: new Date(reserveRoomDTO.checkOut),
    });

    //timd phòng và kiển tra phòng xem có hợp kệ hay không
    const room = await this.roomRepository.findOne({
      where: { id: reserveRoomDTO.roomId },
      relations: ['reservations', 'discounts', 'country'],
    });
    await room.validateReservation(reservation);

    reservation.status = ReservationStatus.REQUESTED;
    return await this.reservationRepo.save(reservation);
  }
}
