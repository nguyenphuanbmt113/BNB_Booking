import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { List } from 'src/common/entities/list.entity';
import { Room } from 'src/common/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([List, Room])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
