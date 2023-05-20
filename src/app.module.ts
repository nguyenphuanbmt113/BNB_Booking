import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './models/role/role.module';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './models/auth/auth.module';
import { ReservationModule } from './models/reservation/reservation.module';
import { RoomModule } from './models/room/room.module';
import { PhotoModule } from './models/photo/photo.module';
import { DiscountModule } from './models/discount/discount.module';
import { ReviewModule } from './models/review/review.module';
import { ListModule } from './models/list/list.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './models/auth/guards/role.guard';
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
