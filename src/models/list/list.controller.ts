import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { List } from 'src/common/entities/list.entity';
import { User } from 'src/common/entities/user.entity';
import { ListService } from './list.service';
import { UserDeco } from '../auth/decorator/user.decorator';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';

@Controller('list')
export class ListController {
  constructor(private readonly listsService: ListService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @UserDeco() user: User,
    @Body() createListDto: any,
  ): Promise<List> {
    return await this.listsService.create(user.id, createListDto);
  }

  @Get()
  async append(
    @Req() { user }: { user: User },
    @Body() appendListItemDto: any,
  ): Promise<List> {
    return await this.listsService.append(user.id, appendListItemDto);
  }

  @Get()
  async getMyLists(@Req() { user }: { user: User }): Promise<List[]> {
    return await this.listsService.getListsByUserId(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<List> {
    return await this.listsService.findOne(+id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return await this.listsService.delete(+id);
  }
}
