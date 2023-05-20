import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/common/entities/list.entity';
import { Room } from 'src/common/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async getListsByUserId(userId: number): Promise<List[]> {
    return await this.listRepository.find({
      where: { owner: { id: userId } },
    });
  }

  async findOne(id: number): Promise<List> {
    return await this.listRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.listRepository.findOneOrFail({
      where: { id },
    });
    return await this.listRepository.delete(id);
  }

  async create(userId: number, createListDto: any): Promise<List> {
    const list = {
      owner: { id: userId },
      name: createListDto.name,
    };
    const exist = await this.listRepository.findOne({
      where: list,
    });
    if (exist) throw new BadRequestException('List have been existed');
    return await this.listRepository.create(list);
  }

  async append(userId: number, appendListItemDto: any): Promise<List> {
    const list = await this.listRepository.findOneOrFail(appendListItemDto.id);
    const room = await this.roomRepository.findOneOrFail(
      appendListItemDto.roomId,
    );
    if (list.owner.id != userId)
      throw new UnauthorizedException('sonething wrong!');
    list.rooms = [...list.rooms, room];
    return await this.listRepository.save(list);
  }
}
