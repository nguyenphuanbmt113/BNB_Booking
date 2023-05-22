import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './models/auth/auth.module';
import { CountryModule } from './models/country/country.module';
import { DiscountModule } from './models/discount/discount.module';
import { ListModule } from './models/list/list.module';
import { PhotoModule } from './models/photo/photo.module';
import { ReservationModule } from './models/reservation/reservation.module';
import { ReviewModule } from './models/review/review.module';
import { RoleModule } from './models/role/role.module';
import { RoomModule } from './models/room/room.module';
@Module({
  imports: [
    RoleModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    ReservationModule,
    RoomModule,
    PhotoModule,
    DiscountModule,
    ReviewModule,
    ListModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
