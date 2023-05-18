import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { EmailConfirmEntity } from '../entities/emailConfirm.entity';
import { PasswordConfirmEntity } from '../entities/passwordConfirm.entity';
import { Reservation } from '../entities/reservation.entity';
import { Room } from '../entities/room.entity';
import {
  CustomRule,
  Detail,
  DetailChoice,
  Rule,
  RuleChoice,
} from '../entities/rule.entity';
import { AmenityGroup, AmenityItem } from '../entities/amenity.entity';
import { Photo } from '../entities/photo.entity';
import { Rating } from '../entities/rating.entity';
import { Review } from '../entities/review.entity';
import { Discount } from '../entities/discount.entity';
import { List } from '../entities/list.entity';
import { Country } from '../entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          User,
          Role,
          EmailConfirmEntity,
          PasswordConfirmEntity,
          Reservation,
          Room,

          Country,
          List,
          Discount,
          Reservation,

          Review,
          Rating,
          Photo,

          AmenityGroup,
          AmenityItem,

          Rule,
          RuleChoice,
          CustomRule,
          Detail,
          DetailChoice,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
