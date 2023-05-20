import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Room } from 'src/common/entities/room.entity';
import { RoomService } from './room.service';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { UserDeco } from '../auth/decorator/user.decorator';
import { User } from 'src/common/entities/user.entity';
@Controller('room')
export class RoomController {
  constructor(private readonly roomsService: RoomService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  //@Roles(UserRole.Host)
  async create(
    @UserDeco() user: User,
    @Body() createRoomDto: any,
  ): Promise<any> {
    return await this.roomsService.create(user, createRoomDto);
  }

  @Get()
  async findAll(): Promise<Room[]> {
    return await this.roomsService.findAll();
  }

  //@Roles(UserRole.Host)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roomsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: any) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
