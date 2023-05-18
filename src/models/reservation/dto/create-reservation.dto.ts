import { IsNumber } from 'class-validator';
export class CreateReservationDto {
  @IsNumber()
  roomId: number;
  @IsNumber()
  guestCnt: number;

  checkIn: string;

  checkOut: string;
  @IsNumber()
  price: number;

  // @IsNumber()
  // paymentId: number;
}
