import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/common/entities/room.entity';
import { PhotoModule } from '../photo/photo.module';
import {
  CustomRule,
  DetailChoice,
  RuleChoice,
} from 'src/common/entities/rule.entity';
import { AmenityGroup, AmenityItem } from 'src/common/entities/amenity.entity';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      RuleChoice,
      DetailChoice,
      CustomRule,
      AmenityItem,
      AmenityGroup,
    ]),
    PhotoModule,
    DiscountModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
